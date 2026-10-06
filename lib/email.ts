import { Resend } from 'resend';
import { prisma } from '@/lib/db';
import { generateManagementToken } from '@/lib/tokens';

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  return new Resend(process.env.RESEND_API_KEY);
}
const FROM = process.env.RESEND_FROM ?? 'OBSCURA Studio <hello@obscura.studio>';
const STUDIO = process.env.STUDIO_EMAIL ?? 'hello@obscura.studio';
const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export async function sendBookingConfirmation(booking: {
  id: string;
  name: string;
  email: string;
  callType: string;
  date: string;
  timeSlot: string;
  projectNote?: string | null;
}) {
  const label = booking.callType === '30min' ? '30-minute intro' : '60-minute deep dive';
  const dateLabel = new Date(booking.date + 'T12:00:00Z').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // Generate and persist a management token so the client can self-serve.
  const token = generateManagementToken();
  await prisma.booking.update({
    where: { id: booking.id },
    data: { managementToken: token },
  });
  const manageUrl = `${BASE_URL}/booking/manage?token=${token}`;

  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: `Your call is booked — ${dateLabel} at ${booking.timeSlot}`,
    html: `
      <p>Hi ${esc(booking.name)},</p>
      <p>Your <strong>${esc(label)}</strong> with OBSCURA Studio is confirmed:</p>
      <p>
        <strong>Date:</strong> ${dateLabel}<br/>
        <strong>Time:</strong> ${esc(booking.timeSlot)} (Lisbon / GMT+1)
      </p>
      ${booking.projectNote ? `<p><strong>Your note:</strong> ${esc(booking.projectNote)}</p>` : ''}
      <p>I'll send a calendar invite and video call link separately. Looking forward to speaking with you.</p>
      <p>Need to reschedule or cancel? <a href="${manageUrl}">Manage your booking</a></p>
      <p>— OBSCURA Studio</p>
    `,
  });

  await resend.emails.send({
    from: FROM,
    to: STUDIO,
    subject: `New booking: ${booking.name} — ${dateLabel} ${booking.timeSlot}`,
    html: `
      <p><strong>New discovery call booking</strong></p>
      <p>
        <strong>Name:</strong> ${esc(booking.name)}<br/>
        <strong>Email:</strong> ${esc(booking.email)}<br/>
        <strong>Type:</strong> ${esc(label)}<br/>
        <strong>Date:</strong> ${dateLabel}<br/>
        <strong>Time:</strong> ${esc(booking.timeSlot)}
      </p>
      ${booking.projectNote ? `<p><strong>Note:</strong> ${esc(booking.projectNote)}</p>` : ''}
    `,
  });
}

export async function sendInquiryConfirmation(inquiry: {
  name: string;
  email: string;
  subject?: string | null;
  budget?: string | null;
  message: string;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: inquiry.email,
    subject: 'Message received — OBSCURA Studio',
    html: `
      <p>Hi ${esc(inquiry.name)},</p>
      <p>Thank you for reaching out to OBSCURA Studio. I've received your message and will be in touch within two business days.</p>
      <p>— OBSCURA Studio</p>
    `,
  });

  await resend.emails.send({
    from: FROM,
    to: STUDIO,
    subject: `New inquiry from ${inquiry.name}${inquiry.subject ? ` — ${inquiry.subject}` : ''}`,
    html: `
      <p><strong>New contact form inquiry</strong></p>
      <p>
        <strong>Name:</strong> ${esc(inquiry.name)}<br/>
        <strong>Email:</strong> ${esc(inquiry.email)}<br/>
        ${inquiry.subject ? `<strong>Subject:</strong> ${esc(inquiry.subject)}<br/>` : ''}
        ${inquiry.budget ? `<strong>Budget:</strong> ${esc(inquiry.budget)}<br/>` : ''}
      </p>
      <p><strong>Message:</strong><br/>${esc(inquiry.message)}</p>
    `,
  });
}
