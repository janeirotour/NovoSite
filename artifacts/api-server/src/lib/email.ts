import { logger } from "./logger";

interface BookingEmailData {
  reservationRef: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerCountry?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  pax: number;
  language?: string | null;
  notes?: string | null;
  selectedExtras: Array<{ id: number; name: string; price: number; currency: string }>;
  basePrice: number;
  extrasTotal: number;
  totalAmount: number;
  currency: string;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  hotelAddress?: string | null;
  flightNumber?: string | null;
}

function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isEmailConfigured()) {
    logger.warn({ to: opts.to, subject: opts.subject }, "Email not sent — EMAIL_HOST/USER/PASS not configured");
    return;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT ?? 587),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });

    logger.info({ to: opts.to, subject: opts.subject }, "Email sent");
  } catch (err) {
    logger.error({ err, to: opts.to }, "Failed to send email");
  }
}

function extrasHtml(extras: BookingEmailData["selectedExtras"]): string {
  if (!extras.length) return "<em>None</em>";
  return extras
    .map((e) => `<li>${e.name} — $${e.price.toFixed(2)} ${e.currency}</li>`)
    .join("");
}

export async function sendAdminBookingNotification(
  data: BookingEmailData
): Promise<void> {
  const adminEmail =
    process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? process.env.EMAIL_USER;
  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set — skipping admin notification");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #f5c518; margin: 0; font-size: 22px;">🎉 New Booking — ${data.reservationRef}</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <h2 style="margin-top: 0;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0; font-weight: bold;">${data.customerName}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;">${data.customerEmail}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Phone / WhatsApp</td><td style="padding: 6px 0;">${data.customerPhone ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Country</td><td style="padding: 6px 0;">${data.customerCountry ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Hotel / Address</td><td style="padding: 6px 0;">${data.hotelAddress ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Pickup Location</td><td style="padding: 6px 0;">${data.pickupLocation ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Drop-off Location</td><td style="padding: 6px 0;">${data.dropoffLocation ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Flight Number</td><td style="padding: 6px 0;">${data.flightNumber ?? "—"}</td></tr>
        </table>

        <h2 style="margin-top: 24px;">Booking Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666;">Product</td><td style="padding: 6px 0; font-weight: bold;">${data.tourTitle}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Preferred Date</td><td style="padding: 6px 0;">${data.preferredDate ?? "To be confirmed"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Preferred Time</td><td style="padding: 6px 0;">${data.preferredTime ?? "To be confirmed"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Participants</td><td style="padding: 6px 0;">${data.pax}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Language</td><td style="padding: 6px 0;">${data.language ?? "English"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Notes</td><td style="padding: 6px 0;">${data.notes ?? "—"}</td></tr>
        </table>

        <h2 style="margin-top: 24px;">Extras Selected</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${extrasHtml(data.selectedExtras)}
        </ul>

        <h2 style="margin-top: 24px;">Payment Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666;">Base Price</td><td style="padding: 6px 0;">$${(data.basePrice * data.pax).toFixed(2)} ${data.currency} (${data.pax} × $${data.basePrice.toFixed(2)})</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Extras Total</td><td style="padding: 6px 0;">$${data.extrasTotal.toFixed(2)} ${data.currency}</td></tr>
          <tr style="border-top: 2px solid #333;"><td style="padding: 10px 0; font-weight: bold; font-size: 16px;">Total Paid</td><td style="padding: 10px 0; font-weight: bold; font-size: 16px; color: #22c55e;">$${data.totalAmount.toFixed(2)} ${data.currency}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #f5c518;">
          <strong>Action Required:</strong> Please confirm this reservation with the customer at <a href="mailto:${data.customerEmail}">${data.customerEmail}</a>${data.customerPhone ? ` or WhatsApp <strong>${data.customerPhone}</strong>` : ""}.
        </div>
      </div>
    </div>
  `;

  await sendMail({
    to: adminEmail,
    subject: `[Janeiro Tour] New Booking ${data.reservationRef} — ${data.tourTitle}`,
    html,
  });
}

export async function sendCustomerConfirmation(
  data: BookingEmailData
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #f5c518; margin: 0; font-size: 24px;">Booking Received!</h1>
        <p style="color: #ccc; margin: 8px 0 0;">Janeiro Tour &amp; Travel</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px;">Hi <strong>${data.customerName}</strong>,</p>
        <p>Thank you for booking with Janeiro Tour &amp; Travel! Your booking request has been received and will be confirmed by our team.</p>

        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1a1a1a;">Booking Summary</h2>
          <p><strong>Reference:</strong> ${data.reservationRef}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666;">Tour</td><td style="padding: 6px 0; font-weight: bold;">${data.tourTitle}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Preferred Date</td><td style="padding: 6px 0;">${data.preferredDate ?? "To be confirmed by our team"}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Preferred Time</td><td style="padding: 6px 0;">${data.preferredTime ?? "To be confirmed by our team"}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Participants</td><td style="padding: 6px 0;">${data.pax} person${data.pax > 1 ? "s" : ""}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Language</td><td style="padding: 6px 0;">${data.language ?? "English"}</td></tr>
          </table>

          ${data.selectedExtras.length > 0 ? `
          <h3 style="margin-top: 16px;">Selected Extras</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${extrasHtml(data.selectedExtras)}
          </ul>
          ` : ""}

          <div style="border-top: 1px solid #e0e0e0; margin-top: 16px; padding-top: 16px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Total Paid: <span style="color: #22c55e;">$${data.totalAmount.toFixed(2)} ${data.currency}</span></p>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px; color: #166534;">📋 Important Information</h3>
          <ul style="margin: 0; padding-left: 20px; color: #166534;">
            <li>The date and time are subject to confirmation by our team.</li>
            <li>You will receive a confirmation email from us shortly.</li>
            <li>Please arrive at the meeting point 10–15 minutes early.</li>
            <li>For questions, WhatsApp us at <strong>+55 21 97263-3333</strong>.</li>
          </ul>
        </div>

        <p style="color: #666; font-size: 14px;">We look forward to showing you the best of Rio de Janeiro!</p>
        <p style="color: #666; font-size: 14px;">— The Janeiro Tour &amp; Travel Team 🌴</p>
      </div>
      <div style="background: #1a1a1a; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="color: #888; font-size: 12px; margin: 0;">Janeiro Tour &amp; Travel · Rio de Janeiro, Brazil</p>
        <p style="color: #888; font-size: 12px; margin: 4px 0 0;"><a href="https://wa.me/5521972633333" style="color: #f5c518;">WhatsApp</a> · info@janeirotour.com</p>
      </div>
    </div>
  `;

  await sendMail({
    to: data.customerEmail,
    subject: `Booking Confirmed — ${data.tourTitle} | Janeiro Tour`,
    html,
  });
}
