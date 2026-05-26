import nodemailer from "nodemailer";

interface EmailPayload {
  to?: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailPayload) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  const from = process.env.SMTP_FROM || user || "info@fantasticlimo.ca";
  const defaultTo = process.env.SMTP_TO || "info@fantasticlimo.ca";
  const recipient = to || defaultTo;

  console.log(`[Email Dispatcher] Attempting to send email. Subject: "${subject}", To: "${recipient}"`);

  // Check if SMTP is configured. If not, log to console.
  if (!host || !user || !pass) {
    console.warn(
      "[Email Dispatcher] Warning: SMTP parameters (SMTP_HOST, SMTP_USER, SMTP_PASS) are not fully configured in your .env file. " +
      "Falling back to development log mode. See the content of the email below:"
    );
    console.log("------------------ EMAIL CONTENT START ------------------");
    console.log(`FROM:    ${from}`);
    console.log(`TO:      ${recipient}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`TEXT:\n${text}`);
    console.log(`HTML:\n${html}`);
    console.log("------------------- EMAIL CONTENT END -------------------");
    return { success: true, mode: "log_fallback" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Prevents certificate verification errors on self-signed SMTP hosts
      }
    });

    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject,
      text,
      html,
    });

    console.log(`[Email Dispatcher] Email sent successfully. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, mode: "smtp" };
  } catch (error) {
    console.error("[Email Dispatcher] Error encountered while sending email via SMTP:", error);
    throw error;
  }
}
