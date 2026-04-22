import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Submission from '@/lib/Submission';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || '').toString().trim();
    const phone    = (body.phone    || '').toString().trim();

    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      return NextResponse.json({ error: 'Phone number must be at least 10 digits.' }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Save to MongoDB
    await connectDB();
    await Submission.create({ fullName, phone });

    // Send live to Google Sheets via Apps Script
    if (process.env.GOOGLE_SCRIPT_URL) {
      await fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, fullName, phone }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error.';
    console.error('[submit]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
