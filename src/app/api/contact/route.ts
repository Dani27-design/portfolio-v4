import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// --- Rate limiter (same pattern as leaderboard) ---
const RATE_LIMIT = { max: 5, windowMs: 60_000 }; // 5 per minute per IP
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipHits.get(ip) ?? [];
  const valid = timestamps.filter(t => now - t < RATE_LIMIT.windowMs);
  if (valid.length >= RATE_LIMIT.max) {
    ipHits.set(ip, valid);
    return true;
  }
  valid.push(now);
  ipHits.set(ip, valid);
  return false;
}

let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [key, timestamps] of ipHits) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT.windowMs);
    if (valid.length === 0) ipHits.delete(key);
    else ipHits.set(key, valid);
  }
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

// --- Validation ---
const contactSchema = z.object({
  subject: z.string().min(1).max(500),
  message: z.string().min(1).max(10000),
});

export async function POST(request: NextRequest) {
  cleanupStaleEntries();

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
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

  const { subject, message } = result.data;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpUser,
      to: smtpUser,
      subject: `[Portfolio Contact] ${subject}`,
      text: `Subject: ${subject}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
