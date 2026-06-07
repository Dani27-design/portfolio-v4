import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { isRateLimitedPersistent } from '@/lib/rate-limit';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

// --- Validation ---
const contactSchema = z.object({
  senderEmail: z.string().email().max(500),
  subject: z.string().min(1).max(500).refine(s => !/[\r\n]/.test(s), 'Invalid characters in subject'),
  message: z.string().min(1).max(10000),
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (await isRateLimitedPersistent(ip, 'contact', 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const messages = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ error: `Validation failed: ${messages.join('; ')}` }, { status: 400 });
  }

  const { senderEmail, subject, message } = result.data;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpUser,
      to: smtpUser,
      replyTo: senderEmail,
      subject: `[Portfolio Contact] ${subject}`,
      text: `From: ${senderEmail}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
