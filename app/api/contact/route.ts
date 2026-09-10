import { NextResponse } from "next/server";
import { Resend } from "resend";
import { clientIp, hit } from "@/lib/rate-limit";
import { esc, isEmail } from "@/lib/validate";

/* The lead form -> Jake's inbox. THE one path on this site that must
   never fail quietly, which is exactly what it used to do: the catch
   below was `catch {}` with nothing bound and nothing logged, so a
   failed send returned a 500 the visitor may not have read, and left no
   record anywhere that a real lead had just evaporated.

   Three things changed here and none of them touch the happy path:
     - the error is bound and logged, so a lost lead is discoverable;
     - the route is rate limited, because it shares a Resend quota with
       the chat transcript route and an unlimited form is a way to
       exhaust it (and to flood the inbox it lands in);
     - the email test and the escaper come from lib/ instead of being
       hand-pasted here.

   NOT changed, deliberately: the `from` address. onboarding@resend.dev
   is Resend's shared sender rather than a domain Jake owns, which is a
   deliverability problem worth fixing — but pointing it at an
   unverified domain would stop the mail sending altogether, so that is
   a change to make WITH the Resend dashboard open, not from here. */

export const runtime = "nodejs";

/* A person sends this form once. Twice if they mistyped something. */
const LIMIT = { limit: 5, windowMs: 10 * 60_000 };

export async function POST(req: Request) {
  if (hit("contact", clientIp(req), LIMIT)) {
    return NextResponse.json(
      { error: "That's a few too many in a row. Try again in a few minutes, or email us directly." },
      { status: 429 }
    );
  }

  try {
    const { name, email, business, message, summary, build, buildUrl } = await req.json();

    // email-first: it is the only required field (cognitive-ease signup);
    // name/business/message enrich the lead when present
    if (!email?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_EMAIL;
    if (!process.env.RESEND_API_KEY || !to) {
      console.error("[contact] not configured — RESEND_API_KEY or CONTACT_EMAIL missing");
      return NextResponse.json({ error: "Contact not configured" }, { status: 500 });
    }

    await resend.emails.send({
      from: "Executive AI Solutions <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Quote request from ${name?.trim() ? name : email}${business ? ` (${business})` : ""}`,
      html: `
        <h2>New quote request</h2>
        ${name?.trim() ? `<p><strong>Name:</strong> ${esc(name)}</p>` : ""}
        <p><strong>Email:</strong> ${esc(email)}</p>
        ${business ? `<p><strong>Business:</strong> ${esc(business)}</p>` : ""}
        ${summary ? `<p><strong>Estimator summary:</strong> ${esc(summary)}</p>` : ""}
        ${build ? `<p><strong>Their build:</strong> ${esc(String(build).slice(0, 200))}${typeof buildUrl === "string" && /^https?:\/\/[^"'<>\s]+$/.test(buildUrl) ? ` — <a href="${esc(buildUrl.slice(0, 300))}">open it</a>` : ""}</p>` : ""}
        ${message?.trim() ? `<p><strong>Message:</strong></p><p>${esc(message).replace(/\n/g, "<br/>")}</p>` : "<p><em>Email-only quick request — the estimate context above is the brief.</em></p>"}
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    /* A LEAD MAY HAVE JUST BEEN LOST. Say so where it can be found. */
    console.error("[contact] send failed —", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
