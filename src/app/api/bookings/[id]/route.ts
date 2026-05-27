import { NextRequest } from "next/server";
import { initDb, Booking } from "@/lib/db";
import { sendEmail } from "@/lib/email";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Helper to notify the client when booking status changes
async function handleStatusChangeEmail(booking: Booking, newStatus: string) {
  if (!booking.email || booking.email.trim() === "") return;

  const formattedDate = new Date(booking.dateTime).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    if (newStatus === "Confirmed") {
      const subject = `Limousine Reservation CONFIRMED - Ref: ${booking.id} | FantasticLimo`;
      const text = `
Dear ${booking.name},

We are pleased to inform you that your chauffeur reservation request has been CONFIRMED by our dispatch coordinators.

RESERVATION SUMMARY:
Reference ID: ${booking.id}
Vehicle: ${booking.vehicle}
Date/Time: ${formattedDate}
Pickup: ${booking.pickup}
Drop-off: ${booking.dropoff}
Passengers: ${booking.passengers} Guests
Status: Confirmed

Our professional chauffeur will arrive 15 minutes prior to your scheduled pickup time.
If you have any questions or require modifications, please contact our dispatch coordinators at +1 (306) 240-4000.

Sincerely,
FantasticLimo Chauffeur Services
`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dec07e; background-color: #051c14; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">FANTASTICLIMO</span><br/>
            <span style="font-size: 10px; color: #dec07e; letter-spacing: 3px; font-weight: bold;">LUXURY CHAUFFEUR SERVICE</span>
          </div>
          <p>Dear ${booking.name},</p>
          <p>We are pleased to inform you that your chauffeured transportation reservation has been <strong style="color: #4ade80;">CONFIRMED</strong> by our dispatch desk.</p>
          
          <div style="background-color: #0b2d20; padding: 15px; border-left: 3px solid #4ade80; margin: 20px 0;">
            <h4 style="color: #dec07e; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Confirmed Reservation Receipt</h4>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Reference ID:</strong> <span style="color: #dec07e; font-weight: bold;">${booking.id}</span></p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Vehicle:</strong> ${booking.vehicle}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Pickup Location:</strong> ${booking.pickup}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Drop-off Location:</strong> ${booking.dropoff}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Guests:</strong> ${booking.passengers} Guests</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #4ade80; font-weight: bold;">Confirmed & Dispatched</span></p>
          </div>
          
          <p>Our professional chauffeur will arrive at the pickup location 15 minutes prior to your scheduled time. Your vehicle is detailed, inspected, and configured to our signature standard.</p>
          <p style="font-size: 13px; color: #888;">If you need assistance or wish to make modifications, contact our dispatch operations center:</p>
          <div style="margin: 15px 0; font-size: 13px; color: #dec07e;">
            📞 <a href="tel:+13062404000" style="color: #dec07e; text-decoration: none;">+1 (306) 240-4000</a> &nbsp;&nbsp;|&nbsp;&nbsp; 
            ✉️ <a href="mailto:info@fantasticlimo.ca" style="color: #dec07e; text-decoration: none;">info@fantasticlimo.ca</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #222; margin: 25px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center; margin-bottom: 0;">
            Thank you for choosing FantasticLimo. We look forward to providing you with a seamless and luxurious journey.
          </p>
        </div>
      `;

      await sendEmail({
        to: booking.email,
        subject,
        text,
        html,
      });
    } else if (newStatus === "Cancelled") {
      const subject = `Limousine Reservation CANCELLED - Ref: ${booking.id} | FantasticLimo`;
      const text = `
Dear ${booking.name},

Your chauffeur reservation request with Reference ID ${booking.id} has been CANCELLED.

RESERVATION SUMMARY:
Reference ID: ${booking.id}
Vehicle: ${booking.vehicle}
Date/Time: ${formattedDate}
Pickup: ${booking.pickup}
Drop-off: ${booking.dropoff}
Status: Cancelled

If you believe this cancellation is in error or you wish to schedule a different route, please contact us at +1 (306) 240-4000 or email info@fantasticlimo.ca.

Sincerely,
FantasticLimo Chauffeur Services
`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #ef4444; background-color: #051c14; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">FANTASTICLIMO</span><br/>
            <span style="font-size: 10px; color: #ef4444; letter-spacing: 3px; font-weight: bold;">RESERVATION CANCELLED</span>
          </div>
          <p>Dear ${booking.name},</p>
          <p>This email is to confirm that your chauffeur reservation request has been <strong style="color: #ef4444;">CANCELLED</strong>.</p>
          
          <div style="background-color: #0b2d20; padding: 15px; border-left: 3px solid #ef4444; margin: 20px 0;">
            <h4 style="color: #ef4444; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Cancellation Receipt</h4>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Reference ID:</strong> <span style="color: #ef4444; font-weight: bold;">${booking.id}</span></p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Vehicle:</strong> ${booking.vehicle}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">Cancelled</span></p>
          </div>
          
          <p>If this cancellation was made in error, or you wish to discuss scheduling another ride, please contact our dispatch coordinators:</p>
          <div style="margin: 15px 0; font-size: 13px; color: #dec07e;">
            📞 <a href="tel:+13062404000" style="color: #dec07e; text-decoration: none;">+1 (306) 240-4000</a> &nbsp;&nbsp;|&nbsp;&nbsp; 
            ✉️ <a href="mailto:info@fantasticlimo.ca" style="color: #dec07e; text-decoration: none;">info@fantasticlimo.ca</a>
          </div>
        </div>
      `;

      await sendEmail({
        to: booking.email,
        subject,
        text,
        html,
      });
    }
  } catch (err) {
    console.error(`[handleStatusChangeEmail] Failed to send status update email:`, err);
  }
}

// PUT /api/bookings/[id] - Update booking in MySQL
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update only allowed fields
    const updateData = { ...body };
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const statusChanged = updateData.status !== undefined && updateData.status !== booking.status;
    const newStatus = updateData.status;

    await booking.update(updateData);

    if (statusChanged && newStatus) {
      handleStatusChangeEmail(booking, newStatus);
    }

    return Response.json(booking);
  } catch (error) {
    console.error("Failed to update booking in MySQL:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/bookings/[id] - Partial update (e.g. status only)
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const allowed = ["status"];
    const updateData: Record<string, string> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    const statusChanged = updateData.status !== undefined && updateData.status !== booking.status;
    const newStatus = updateData.status;

    await booking.update(updateData);

    if (statusChanged && newStatus) {
      handleStatusChangeEmail(booking, newStatus);
    }

    return Response.json(booking);
  } catch (error) {
    console.error("Failed to patch booking in MySQL:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete booking from MySQL
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;
    
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    await booking.destroy();

    return Response.json({ message: "Booking deleted successfully", booking });
  } catch (error) {
    console.error("Failed to delete booking in MySQL:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
