import { NextRequest } from "next/server";
import { initDb, FleetItem, deleteLocalUpload } from "@/lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/fleet/[id] - Edit an existing vehicle in MySQL
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const car = await FleetItem.findByPk(id);
    if (!car) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const oldImage = car.image;
    const updateData = { ...body };
    delete updateData.id;

    // Ensure numeric types are preserved
    if (updateData.passengers !== undefined) updateData.passengers = Number(updateData.passengers);
    if (updateData.luggage !== undefined) updateData.luggage = Number(updateData.luggage);

    // Delete previous local upload if image url has changed
    if (updateData.image !== undefined && updateData.image !== oldImage) {
      await deleteLocalUpload(oldImage);
    }

    await car.update(updateData);

    return Response.json(car);
  } catch (error) {
    console.error("Failed to update vehicle in MySQL:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/fleet/[id] - Remove a vehicle from MySQL
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;

    const car = await FleetItem.findByPk(id);
    if (!car) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Clean up local uploaded file
    await deleteLocalUpload(car.image);

    await car.destroy();

    return Response.json({ message: "Vehicle removed successfully", vehicle: car });
  } catch (error) {
    console.error("Failed to delete vehicle in MySQL:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
