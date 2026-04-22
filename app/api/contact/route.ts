import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder_key_for_build");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, budget, timeline, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder_key_for_build") {
      console.warn("RESEND_API_KEY is not configured.");
      return NextResponse.json(
        { success: true, message: "Message received (email service not configured)" },
        { status: 200 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Jake Ryall <onboarding@resend.dev>",
      to: "jake@jakeryall.com",
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1816;background:#f3f1ee;">
          <h1 style="font-size:22px;font-weight:600;margin:0 0 8px;letter-spacing:-0.02em;">New inquiry</h1>
          <p style="color:#78736c;margin:0 0 32px;font-size:14px;">From the jakeryall.com contact form · ${new Date().toLocaleString()}</p>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(26,24,22,0.08);">
            ${[
              ["Name", name],
              ["Email", email],
              ["Company", company || "—"],
              ["Project type", projectType || "—"],
              ["Budget", budget || "—"],
              ["Timeline", timeline || "—"],
            ]
              .map(
                ([label, value]) => `
                <tr style="border-bottom:1px solid rgba(26,24,22,0.06);">
                  <td style="padding:14px 20px;width:140px;font-size:13px;color:#78736c;text-transform:uppercase;letter-spacing:0.08em;">${label}</td>
                  <td style="padding:14px 20px;font-size:15px;color:#1a1816;">${value}</td>
                </tr>`
              )
              .join("")}
          </table>
          <div style="margin-top:20px;padding:20px;background:#fff;border-radius:16px;border:1px solid rgba(26,24,22,0.08);">
            <p style="margin:0 0 8px;font-size:13px;color:#78736c;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
            <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
