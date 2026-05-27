import { NextRequest } from "next/server";
import { initDb, Booking } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// GET /api/bookings - Get all bookings from MySQL
export async function GET() {
  try {
    await initDb();
    const bookings = await Booking.findAll({
      order: [["createdAt", "DESC"]],
    });
    return Response.json(bookings);
  } catch (error) {
    console.error("Failed to query bookings:", error);
    return Response.json(
      { error: "Failed to load database records" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create booking in MySQL
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const data = await request.json();

    const { name, email, phone, pickup, dropoff, dateTime, vehicle, passengers } = data;

    if (!name || !pickup || !dropoff || !dateTime || !vehicle) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique ID in the format AR-XXXXXX
    const generateId = () => {
      const num = Math.floor(100000 + Math.random() * 900000);
      return `AR-${num}`;
    };

    let newId = generateId();
    let existing = await Booking.findByPk(newId);
    // Ensure uniqueness
    while (existing) {
      newId = generateId();
      existing = await Booking.findByPk(newId);
    }

    const newBooking = await Booking.create({
      id: newId,
      name,
      email: email || "",
      phone: phone || "",
      pickup,
      dropoff,
      dateTime,
      vehicle,
      passengers: passengers || "1",
      status: "Pending",
    });

    // Send email notifications in a try/catch so booking creation doesn't fail on SMTP errors
    try {
      const formattedDate = new Date(dateTime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // 1. Notify Admin / Dispatcher
      const adminSubject = `[New Booking Request] Ref: ${newId} - ${name}`;
      const adminText = `
New limousine chauffeur booking request received.
Reference ID: ${newId}
Client Name: ${name}
Email: ${email || "Not Provided"}
Phone: ${phone || "Not Provided"}
Vehicle: ${vehicle}
Date/Time: ${formattedDate}
Pickup: ${pickup}
Drop-off: ${dropoff}
Passengers: ${passengers || "1"}
Status: Pending

Manage this booking request in the admin panel.
`;
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dec07e; background-color: #051c14; color: #ffffff;">
          <h2 style="color: #dec07e; border-bottom: 2px solid #dec07e; padding-bottom: 10px; margin-top: 0;">New Booking Dispatch Notification</h2>
          <p>A new chauffeur booking request has been registered in the reservation desk.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; width: 150px; border-bottom: 1px solid #222;">Reference ID:</td><td style="padding: 10px; border-bottom: 1px solid #222; color: #dec07e; font-weight: bold;">${newId}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Client Name:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${name}</td></tr>
            <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #dec07e;">${email || "Not Provided"}</a></td></tr>
            <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Phone:</td><td style="padding: 10px; border-bottom: 1px solid #222;"><a href="tel:${phone}" style="color: #dec07e;">${phone || "Not Provided"}</a></td></tr>
            <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Vehicle:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${vehicle}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Date & Time:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${formattedDate}</td></tr>
            <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Pickup:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${pickup}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Drop-off:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${dropoff}</td></tr>
            <tr style="background-color: #0b2d20;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Passengers:</td><td style="padding: 10px; border-bottom: 1px solid #222;">${passengers || "1"} Guests</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #222;">Status:</td><td style="padding: 10px; border-bottom: 1px solid #222; color: #f3e5c8; font-weight: bold;">Pending</td></tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">FantasticLimo Operations System</p>
        </div>
      `;

      await sendEmail({
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      });

      // 2. Send receipt copy to Customer (if email is provided)
      if (email && email.trim() !== "") {
        const customerSubject = `Limousine Reservation Request Received - Ref: ${newId} | FantasticLimo`;
        const customerText = `
Dear ${name},

Thank you for choosing FantasticLimo. We have received your booking request and our dispatch coordinators are currently reviewing it.

RESERVATION SUMMARY:
Reference ID: ${newId}
Vehicle: ${vehicle}
Date/Time: ${formattedDate}
Pickup: ${pickup}
Drop-off: ${dropoff}
Passengers: ${passengers || "1"} Guests
Status: Pending Confirmation

A dispatch coordinator will contact you shortly to finalize details.
If you need urgent assistance, call us at +1 (306) 240-4000 or email info@fantasticlimo.ca.

Sincerely,
FantasticLimo Chauffeur Services
        `;
        const customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dec07e; background-color: #051c14; color: #ffffff;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">FANTASTICLIMO</span><br/>
              <span style="font-size: 10px; color: #dec07e; letter-spacing: 3px; font-weight: bold;">LUXURY CHAUFFEUR SERVICE</span>
            </div>
            <p>Dear ${name},</p>
            <p>Thank you for choosing FantasticLimo. We have received your chauffeured transportation request and are currently processing the details.</p>
            
            <div style="background-color: #0b2d20; padding: 15px; border-left: 3px solid #dec07e; margin: 20px 0;">
              <h4 style="color: #dec07e; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Reservation Request Details</h4>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Reference ID:</strong> <span style="color: #f3e5c8; font-weight: bold;">${newId}</span></p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Vehicle:</strong> ${vehicle}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Date & Time:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Pickup Location:</strong> ${pickup}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Drop-off Location:</strong> ${dropoff}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Guests count:</strong> ${passengers || "1"}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #f3e5c8; font-weight: bold;">Pending Dispatcher Review</span></p>
            </div>
            
            <p>A dispatch coordinator will contact you shortly to confirm availability and finalize the reservation parameters.</p>
            <p style="font-size: 13px; color: #888;">If you need to make modifications or require immediate support, please contact our concierge desk:</p>
            <div style="margin: 15px 0; font-size: 13px; color: #dec07e;">
              📞 <a href="tel:+13062404000" style="color: #dec07e; text-decoration: none;">+1 (306) 240-4000</a> &nbsp;&nbsp;|&nbsp;&nbsp; 
              ✉️ <a href="mailto:info@fantasticlimo.ca" style="color: #dec07e; text-decoration: none;">info@fantasticlimo.ca</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #222; margin: 25px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center; margin-bottom: 0;">
              This is a booking request confirmation email. A finalized quote and confirmation voucher will follow upon dispatch authorization.
            </p>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: customerSubject,
          text: customerText,
          html: customerHtml,
        });
      }
    } catch (e) {
      console.error("[POST /api/bookings] Failed to dispatch reservation email notifications:", e);
    }

    return Response.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
