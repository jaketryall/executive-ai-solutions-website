import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, business, message, summary, build, buildUrl } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_EMAIL;
    if (!process.env.RESEND_API_KEY || !to) {
      return NextResponse.json({ error: "Contact not configured" }, { status: 500 });
    }

    const esc = (s: string) =>
      String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

    await resend.emails.send({
      from: "Executive AI Solutions <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Quote request from ${name}${business ? ` (${business})` : ""}`,
      html: `
        <h2>New quote request</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        ${business ? `<p><strong>Business:</strong> ${esc(business)}</p>` : ""}
        ${summary ? `<p><strong>Estimator summary:</strong> ${esc(summary)}</p>` : ""}
        ${build ? `<p><strong>Their build:</strong> ${esc(String(build).slice(0, 200))}${typeof buildUrl === "string" && /^https?:\/\/[^"'<>\s]+$/.test(buildUrl) ? ` — <a href="${esc(buildUrl.slice(0, 300))}">open it</a>` : ""}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
