"use server";

import { Resend } from "resend";

export type ContactState = {
  ok: boolean;
  error?: string;
} | null;

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill every field; humans never see this one.
  if (formData.get("company_url")) return { ok: true };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const site = String(formData.get("site") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email.includes("@") || !message) {
    return { ok: false, error: "Name, email and a few words — that's all we need." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    // TODO(owner): once a domain is verified in Resend, set RESEND_FROM
    // (e.g. "Executive AI <hello@yourdomain.com>") for deliverability.
    from: process.env.RESEND_FROM ?? "Executive AI Solutions <onboarding@resend.dev>",
    to: [process.env.CONTACT_EMAIL!],
    replyTo: email,
    subject: `New project inquiry — ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      site && `Current site: ${site}`,
      type && `Project type: ${type}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return {
      ok: false,
      error: "Something broke on our end — email us directly instead.",
    };
  }

  return { ok: true };
}
