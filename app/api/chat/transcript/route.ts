import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/* Chat transcripts → Jake's inbox. This is what makes the widget's
   greeting TRUE ("a human reads every conversation") — and every
   transcript is lead intelligence: what visitors actually ask is the
   copy the site should answer. Fired by sendBeacon from site-chat.tsx
   when the visitor closes the panel or leaves the page; the client
   only sends when there's something new, the server just forwards. */

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const w = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  w.push(now);
  hits.set(ip, w);
  if (hits.size > 2000) hits.clear();
  return w.length > 4;
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const to = process.env.CONTACT_EMAIL;
  if (!process.env.RESEND_API_KEY || !to)
    return NextResponse.json({ ok: false }, { status: 503 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let messages: Msg[];
  let page = "";
  try {
    // sendBeacon posts a Blob — same JSON, parsed the same way
    const body = (await req.json()) as { messages?: Msg[]; page?: string };
    messages = body.messages ?? [];
    page = typeof body.page === "string" ? body.page.slice(0, 120) : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const valid =
    Array.isArray(messages) &&
    messages.length >= 2 &&
    messages.length <= 20 &&
    messages.every(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length <= 700
    ) &&
    messages.some((m) => m.role === "assistant");
  if (!valid) return NextResponse.json({ ok: false }, { status: 400 });

  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
    );
  const thread = messages
    .map(
      (m) =>
        `<p style="margin:0 0 10px"><strong>${m.role === "user" ? "Visitor" : "Chat"}:</strong> ${esc(m.content).replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Executive AI Solutions <onboarding@resend.dev>",
      to,
      subject: `Site chat transcript — ${messages.filter((m) => m.role === "user").length} question${messages.filter((m) => m.role === "user").length === 1 ? "" : "s"}`,
      html: `<h2>Ask-this-site conversation</h2>${page ? `<p><em>Started on ${esc(page)}</em></p>` : ""}${thread}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
