// src/lib/email/email.service.ts
// Resend Transactional Email Service with Relationship Wahala & Connections branding

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || "Relationship Wahala <no-reply@relationshipwahala.com>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; id?: string }> {
  if (!resend) {
    console.log(`[Resend Email Service] Skipped sending "${subject}" to ${to} (RESEND_API_KEY not configured).`);
    return { success: true, id: "simulated-email-id" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[Resend Email Service] Failed to send to ${to}:`, error.message);
      return { success: false };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Resend Email Service] Exception sending email:", err);
    return { success: false };
  }
}

function emailWrapper(contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf5ec; margin: 0; padding: 20px; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e0d4; shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #7b1d2a; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { font-family: Georgia, serif; margin: 0; font-size: 22px; color: #ffffff; }
        .header p { color: #c9962c; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; }
        .body { padding: 30px; font-size: 14px; line-height: 1.6; color: #333333; }
        .button { display: inline-block; background-color: #7b1d2a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 20px; }
        .footer { background-color: #f9f3ea; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #e8e0d4; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RELATIONSHIP WAHALA &amp; CONNECTIONS</h1>
          <p>Where Love Meets Wisdom</p>
        </div>
        <div class="body">
          ${contentHtml}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Relationship Wahala &amp; Connections. All rights reserved.<br/>
          Lagos, Nigeria | Intentional Matchmaking &amp; Relationship Guidance
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Relationship Wahala & Connections!",
    html: emailWrapper(`
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Thank you for joining Nigeria's premier knowledge-based relationship and matchmaking platform.</p>
      <p>Your journey towards building a healthy, intentional, and lasting marriage begins today.</p>
      <p><a href="${process.env.NEXTAUTH_URL || "https://relationshipwahala.com"}/dashboard" class="button">Go to My Dashboard</a></p>
    `),
  });
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || "https://relationshipwahala.com"}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: "Verify Your Email Address — Relationship Wahala",
    html: emailWrapper(`
      <h2>Verify Your Email, ${name}</h2>
      <p>Please confirm your email address to activate your account and complete your profile setup.</p>
      <p><a href="${verifyUrl}" class="button">Verify Email Address</a></p>
      <p style="font-size: 12px; color: #666;">If you did not register, please ignore this message.</p>
    `),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "https://relationshipwahala.com"}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: "Password Reset Instructions — Relationship Wahala",
    html: emailWrapper(`
      <h2>Reset Your Password, ${name}</h2>
      <p>We received a request to reset your Relationship Wahala account password.</p>
      <p><a href="${resetUrl}" class="button">Reset Password</a></p>
      <p style="font-size: 12px; color: #666;">This link expires in 1 hour.</p>
    `),
  });
}

export async function sendProfileApprovedEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Profile Approved! 🎉 — Relationship Wahala",
    html: emailWrapper(`
      <h2>Great news, ${name}!</h2>
      <p>Your profile has been verified and approved by our moderation team.</p>
      <p>You can now view intentional candidate matches and initiate connections.</p>
      <p><a href="${process.env.NEXTAUTH_URL || "https://relationshipwahala.com"}/dashboard/matches" class="button">View My Matches</a></p>
    `),
  });
}

export async function sendPaymentConfirmationEmail(to: string, name: string, amount: string, reference: string) {
  return sendEmail({
    to,
    subject: `Payment Confirmed (${reference}) — Relationship Wahala`,
    html: emailWrapper(`
      <h2>Payment Confirmation</h2>
      <p>Dear ${name},</p>
      <p>We have successfully received and verified your payment of <strong>${amount}</strong> (Ref: ${reference}).</p>
      <p>Your subscription features are now active.</p>
      <p><a href="${process.env.NEXTAUTH_URL || "https://relationshipwahala.com"}/dashboard/subscription" class="button">View Subscription</a></p>
    `),
  });
}
