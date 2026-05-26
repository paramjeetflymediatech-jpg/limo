import { NextRequest } from "next/server";
import { initDb, Booking } from "@/lib/db";

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

    return Response.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
