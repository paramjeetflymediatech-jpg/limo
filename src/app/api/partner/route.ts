import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { companyName, contactName, email, phone, industry, message } = data;

    if (!companyName || !contactName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Send Email to the Company (Fantastic Limo)
    const companySubject = `New Partnership Inquiry: ${companyName}`;
    const companyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #333;">New Partnership Application</h2>
        <p>A new B2B partnership application has been submitted by <strong>${companyName}</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <table style="width: 100%; text-align: left;">
          <tr><th style="padding: 8px 0; width: 150px;">Company:</th><td>${companyName}</td></tr>
          <tr><th style="padding: 8px 0;">Contact Name:</th><td>${contactName}</td></tr>
          <tr><th style="padding: 8px 0;">Email:</th><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><th style="padding: 8px 0;">Phone:</th><td>${phone || 'N/A'}</td></tr>
          <tr><th style="padding: 8px 0;">Industry/Type:</th><td>${industry}</td></tr>
        </table>
        <h3 style="margin-top: 20px; color: #333;">Partnership Proposal:</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        <p style="margin-top: 30px; font-size: 12px; color: #777;">Sent automatically from Fantastic Limo Website.</p>
      </div>
    `;
    const companyText = `New Partnership Inquiry from ${companyName}\n\nContact: ${contactName}\nEmail: ${email}\nPhone: ${phone}\nIndustry: ${industry}\n\nProposal:\n${message}`;

    await sendEmail({
      subject: companySubject,
      html: companyHtml,
      text: companyText,
    });

    // 2. Send Confirmation Email to the Partner
    const partnerSubject = `Your Partnership Application - Fantastic Limo`;
    const partnerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #D0A511;">Fantastic Limo</h2>
        <p>Dear ${contactName},</p>
        <p>Thank you for submitting your partnership application to Fantastic Limo. We have received your inquiry on behalf of <strong>${companyName}</strong>.</p>
        <p>Our executive team is currently reviewing your proposal and will get back to you shortly to discuss potential collaboration opportunities.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="margin-bottom: 5px;"><strong>Your Submission Summary:</strong></p>
        <p style="color: #555; background-color: #f9f9f9; padding: 10px; border-radius: 5px; font-size: 14px;">
          Industry: ${industry}<br/>
          Phone: ${phone || 'N/A'}<br/>
        </p>
        <p style="margin-top: 20px;">We look forward to the possibility of a rewarding partnership.</p>
        <p>Best regards,<br/><strong>The Fantastic Limo Executive Team</strong></p>
      </div>
    `;
    const partnerText = `Dear ${contactName},\n\nThank you for submitting your partnership application to Fantastic Limo. We have received your inquiry on behalf of ${companyName}.\n\nOur executive team is currently reviewing your proposal and will get back to you shortly to discuss potential collaboration opportunities.\n\nBest regards,\nThe Fantastic Limo Executive Team`;

    await sendEmail({
      to: email, // Send to the partner
      subject: partnerSubject,
      html: partnerHtml,
      text: partnerText,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Partner API Error]", error);
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 });
  }
}
