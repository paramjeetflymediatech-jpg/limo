import { NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";

// POST /api/contact - Handle contact inquiries and send email alerts
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !phone || !subject || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Notify Admin of new contact inquiry
    const adminMailSubject = `[Inquiry] ${subject} - ${name}`;
    const adminMailText = `
New concierge inquiry received.
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message:
${message}
`;
    const adminMailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dec07e; background-color: #051c14; color: #ffffff;">
        <h2 style="color: #dec07e; border-bottom: 2px solid #dec07e; padding-bottom: 10px; margin-top: 0;">New Concierge Inquiry</h2>
        <p>A user has sent an inquiry via the online contact desk.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 10px;">${name}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;"><a href="mailto:${email}" style="color: #dec07e;">${email}</a></td></tr>
          <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold;">Phone:</td><td style="padding: 10px;"><a href="tel:${phone}" style="color: #dec07e;">${phone}</a></td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Subject:</td><td style="padding: 10px; color: #f3e5c8; font-weight: bold;">${subject}</td></tr>
        </table>
        <h4 style="color: #dec07e; margin-bottom: 5px;">Message Content:</h4>
        <div style="background-color: #0b2d20; padding: 15px; border-radius: 4px; border: 1px solid #222; white-space: pre-wrap; font-size: 13px; line-height: 1.5;">${message}</div>
        <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">FantasticLimo Concierge Desk</p>
      </div>
    `;

    // Send admin notification
    await sendEmail({
      subject: adminMailSubject,
      text: adminMailText,
      html: adminMailHtml,
    });

    // 2. Send receipt auto-responder to customer
    const customerMailSubject = `We Received Your Inquiry - ${subject} | FantasticLimo`;
    const customerMailText = `
Dear ${name},

Thank you for contacting FantasticLimo. We have received your inquiry regarding "${subject}".

Our VIP Concierge coordinators are reviewing your message and will respond to you shortly.

YOUR SUBMITTED MESSAGE:
----------------------------------------
${message}
----------------------------------------

If you require immediate dispatch assistance, please contact us at +1 (306) 240-4000.

Best Regards,
FantasticLimo Support Desk
`;
    const customerMailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dec07e; background-color: #051c14; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">FANTASTICLIMO</span><br/>
          <span style="font-size: 10px; color: #dec07e; letter-spacing: 3px; font-weight: bold;">LUXURY CHAUFFEUR SERVICE</span>
        </div>
        <p>Dear ${name},</p>
        <p>Thank you for contacting FantasticLimo. We have received your online inquiry regarding <strong>${subject}</strong> and are currently reviewing your request.</p>
        
        <p>Our VIP Concierge desk coordinator will reach out to you shortly via your provided contact details.</p>
        
        <div style="background-color: #0b2d20; padding: 15px; border: 1px solid #222; margin: 20px 0; font-size: 13px;">
          <h4 style="color: #dec07e; margin-top: 0; margin-bottom: 10px; text-transform: uppercase;">Message Copy</h4>
          <div style="white-space: pre-wrap; font-style: italic; color: #ccc;">"${message}"</div>
        </div>

        <p style="font-size: 13px; color: #888;">If you need urgent assistance or wish to configure a custom transport routing, feel free to call us directly:</p>
        <div style="margin: 15px 0; font-size: 13px; color: #dec07e;">
          📞 <a href="tel:+13062404000" style="color: #dec07e; text-decoration: none;">+1 (306) 240-4000</a> &nbsp;&nbsp;|&nbsp;&nbsp; 
          ✉️ <a href="mailto:info@fantasticlimo.ca" style="color: #dec07e; text-decoration: none;">info@fantasticlimo.ca</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #222; margin: 25px 0;" />
        <p style="font-size: 11px; color: #555; text-align: center; margin-bottom: 0;">
          This is an automated confirmation of receipt. Please do not reply directly to this auto-response email.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: customerMailSubject,
      text: customerMailText,
      html: customerMailHtml,
    });

    return Response.json({ success: true, message: "Inquiry sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to process contact inquiry:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
