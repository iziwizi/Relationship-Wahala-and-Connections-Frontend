// src/lib/email/email.service.ts
// Resend Transactional Email Service with Relationship Wahala & Connections branding

import { Resend } from "resend";

const defaultFromEmail = process.env.EMAIL_FROM || "Relationship Wahala & Connections <support@relationshipwahalaandconnections.com>";
const defaultBaseUrl = process.env.NEXTAUTH_URL || "https://www.relationshipwahalaandconnections.com";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || "re_LisCUjEM_N9r2VamXW1tfevN8WocEKD2b";

  if (!apiKey) {
    console.warn(`[Resend Email Service] Cannot send email "${subject}" to ${to} — RESEND_API_KEY is not configured in Vercel environment variables.`);
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || defaultFromEmail;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[Resend Email Service] Failed to send to ${to} using ${from}:`, error.message);

      // Graceful fallback: If custom domain is not yet verified on Resend, retry with Resend sandbox sender
      if (
        error.message?.toLowerCase().includes("domain") ||
        error.message?.toLowerCase().includes("verify") ||
        error.message?.toLowerCase().includes("not verified")
      ) {
        console.warn("[Resend Email Service] Custom domain not verified on Resend. Retrying with onboarding@resend.dev...");
        const fallback = await resend.emails.send({
          from: "Relationship Wahala <onboarding@resend.dev>",
          to,
          subject,
          html,
        });

        if (fallback.data?.id) {
          console.log(`[Resend Email Service] Successfully sent email via sandbox fallback to ${to} (ID: ${fallback.data.id})`);
          return { success: true, id: fallback.data.id };
        }
      }

      return { success: false, error: error.message };
    }

    console.log(`[Resend Email Service] Successfully sent "${subject}" to ${to} (ID: ${data?.id})`);
    return { success: true, id: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown email error";
    console.error("[Resend Email Service] Exception sending email:", msg);
    return { success: false, error: msg };
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
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e0d4; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #7b1d2a; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { font-family: Georgia, serif; margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px; }
        .header p { color: #c9962c; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; font-weight: bold; }
        .body { padding: 30px; font-size: 14px; line-height: 1.6; color: #333333; }
        .button { display: inline-block; background-color: #7b1d2a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 15px; }
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
          Lagos, Nigeria | Intentional Matchmaking &amp; Relationship Guidance<br/>
          Direct Hotline: <a href="tel:08066689080" style="color: #7b1d2a; font-weight: bold;">08066689080</a><br/>
          <a href="https://www.relationshipwahalaandconnections.com" style="color: #7b1d2a; text-decoration: underline;">www.relationshipwahalaandconnections.com</a>
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
      <p><a href="${defaultBaseUrl}/dashboard" class="button">Go to My Dashboard</a></p>
    `),
  });
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${defaultBaseUrl}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: "Verify Your Email Address — Relationship Wahala & Connections",
    html: emailWrapper(`
      <h2>Verify Your Email, ${name}</h2>
      <p>Please confirm your email address to activate your account and complete your profile setup.</p>
      <p><a href="${verifyUrl}" class="button">Verify Email Address</a></p>
      <p style="font-size: 12px; color: #666;">If you did not register, please ignore this message.</p>
    `),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${defaultBaseUrl}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: "Password Reset Instructions — Relationship Wahala & Connections",
    html: emailWrapper(`
      <h2>Reset Your Password, ${name}</h2>
      <p>We received a request to reset your Relationship Wahala & Connections account password.</p>
      <p><a href="${resetUrl}" class="button">Reset Password</a></p>
      <p style="font-size: 12px; color: #666;">This link expires in 1 hour.</p>
    `),
  });
}

export async function sendProfileApprovedEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Profile Approved! 🎉 — Relationship Wahala & Connections",
    html: emailWrapper(`
      <h2>Great news, ${name}!</h2>
      <p>Your profile has been verified and approved by our moderation team.</p>
      <p>You can now view intentional candidate matches and initiate connections.</p>
      <p><a href="${defaultBaseUrl}/dashboard/matches" class="button">View My Matches</a></p>
    `),
  });
}

export async function sendPaymentConfirmationEmail(to: string, name: string, amount: string, reference: string) {
  return sendEmail({
    to,
    subject: `Payment Confirmed (${reference}) — Relationship Wahala & Connections`,
    html: emailWrapper(`
      <h2>Payment Confirmation</h2>
      <p>Dear ${name},</p>
      <p>We have successfully received and verified your payment of <strong>${amount}</strong> (Ref: ${reference}).</p>
      <p>Your subscription features are now active.</p>
      <p><a href="${defaultBaseUrl}/dashboard/subscription" class="button">View Subscription</a></p>
    `),
  });
}

export interface BookingConfirmationEmailParams {
  to: string;
  customerName: string;
  bookingReference: string;
  packageName: string;
  bookingDate: string;
  bookingTime: string;
  amount: number;
  paymentMethod?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    instructions?: string;
  };
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationEmailParams) {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(params.amount);

  const bank = params.bankDetails || {
    bankName: "First Bank of Nigeria",
    accountName: "Relationship Wahala and Connections Services",
    accountNumber: "2049581735",
    instructions: "Please include your booking reference number in your transfer description.",
  };

  const whatsappUrl = `https://wa.me/2348066689080?text=${encodeURIComponent(
    `Hello Relationship Wahala & Connections, I have booked a physical consultation for ${params.packageName} (Booking Ref: ${params.bookingReference}, Amount: ${formattedAmount}). Here is my payment receipt.`
  )}`;

  return sendEmail({
    to: params.to,
    subject: `Physical Consultation Reserved (${params.bookingReference}) — Relationship Wahala & Connections`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: #fbf5ec; color: #7b1d2a; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 20px;">Appointment Reserved</span>
        <h2 style="font-family: Georgia, serif; color: #1a1a1a; margin-top: 12px; font-size: 24px;">Physical Consultation Booking Confirmation</h2>
      </div>

      <p>Dear <strong>${params.customerName}</strong>,</p>
      <p>Thank you for scheduling your private physical matchmaking consultation with <strong>Relationship Wahala &amp; Connections</strong>. We have reserved your appointment.</p>

      <div style="background-color: #f9f9f9; border: 1px solid #e8e0d4; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #777;">Booking Reference:</td>
            <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #7b1d2a; text-align: right;">${params.bookingReference}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #777;">Package:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #1a1a1a; text-align: right;">${params.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #777;">Scheduled Date &amp; Time:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #7b1d2a; text-align: right;">${params.bookingDate} at ${params.bookingTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #777;">Amount:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #1a1a1a; font-size: 15px; text-align: right;">${formattedAmount}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #fbf5ec; border: 1px solid #e8e0d4; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="font-family: Georgia, serif; color: #7b1d2a; margin-top: 0; font-size: 16px; margin-bottom: 12px;">Official Bank Account Details for Payment</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #555;">Bank Name:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right;">${bank.bankName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #555;">Account Name:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right;">${bank.accountName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #555;">Account Number:</td>
            <td style="padding: 5px 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #7b1d2a; text-align: right;">${bank.accountNumber}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #555;">Transfer Narration / Ref:</td>
            <td style="padding: 5px 0; font-family: monospace; font-weight: bold; text-align: right;">${params.bookingReference}</td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #666; margin-top: 12px; margin-bottom: 0;">
          💡 Please transfer to the account above using your Reference Number (<strong>${params.bookingReference}</strong>) as description. After making the transfer, send your payment receipt via WhatsApp for instant confirmation.
        </p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${whatsappUrl}" class="button" style="background-color: #25D366; color: #ffffff !important; margin-right: 10px;">Send Receipt on WhatsApp</a>
        <a href="${defaultBaseUrl}/matchmaking/physical/confirmation?reference=${params.bookingReference}" class="button">View Booking Details</a>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #e8e0d4; font-size: 12px; color: #777;">
        <p><strong>Private Executive Venue:</strong> For confidentiality and privacy, the exact consultation suite address will be dispatched to your phone and email prior to the meeting.</p>
        <p>Direct Enquiries: Call our matchmaking desk on <a href="tel:08066689080" style="color: #7b1d2a; font-weight: bold;">08066689080</a>.</p>
      </div>
    `),
  });
}
