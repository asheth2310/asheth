import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/contact
 * Body: { name: string, email: string, message: string }
 *
 * Sends the portfolio contact form to your inbox via Resend.
 * Required env vars (set in Vercel → Project Settings → Environment Variables):
 *   RESEND_API_KEY   – from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL – the inbox that receives messages (e.g. you@example.com)
 *   CONTACT_FROM_EMAIL (optional) – verified sender, defaults to onboarding@resend.dev
 *                                   (works for testing; use your own domain in production)
 */
export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are all required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Fail loudly instead of pretending the message was sent.
    console.error("[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL env var.");
    return NextResponse.json(
      { error: "Contact form is not configured yet. Please email directly." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Could not send the message. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Could not send the message. Please try again." }, { status: 500 });
  }
}
