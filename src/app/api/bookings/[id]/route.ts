import { NextRequest } from "next/server";
import { initDb, Booking } from "@/lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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

    await booking.update(updateData);

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

    await booking.update(updateData);
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
