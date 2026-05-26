import { NextRequest } from "next/server";
import { initDb, LocationService, deleteLocalUpload } from "@/lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/services/[id] - Update location-based service in MySQL
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const service = await LocationService.findByPk(id);
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    const oldImage = service.image;
    const updateData = { ...body };
    delete updateData.id;

    // Clean up old local image file if URL changed
    if (updateData.image !== undefined && updateData.image !== oldImage) {
      await deleteLocalUpload(oldImage);
    }

    await service.update(updateData);

    return Response.json(service);
  } catch (error) {
    console.error("Failed to update location service in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Remove location-based service from MySQL
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await initDb();
    const { id } = await params;

    const service = await LocationService.findByPk(id);
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    // Clean up local uploaded file
    await deleteLocalUpload(service.image);

    await service.destroy();

    return Response.json({ message: "Location service removed successfully", service });
  } catch (error) {
    console.error("Failed to delete location service in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
