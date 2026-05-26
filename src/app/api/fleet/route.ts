import { NextRequest } from "next/server";
import { initDb, FleetItem } from "@/lib/db";

// GET /api/fleet - Get all fleet vehicles from MySQL
export async function GET() {
  try {
    await initDb();
    const fleet = await FleetItem.findAll();
    return Response.json(fleet);
  } catch (error) {
    console.error("Failed to fetch fleet from MySQL:", error);
    return Response.json(
      { error: "Failed to load database records" },
      { status: 500 }
    );
  }
}

// POST /api/fleet - Add new vehicle to fleet in MySQL
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const data = await request.json();
    const { name, category, image, description, price, passengers, luggage } = data;

    if (!name || !category || !image || !description || !price || passengers === undefined || luggage === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Slugify name for a readable ID
    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let id = baseId;
    let counter = 1;
    
    // Ensure uniqueness
    let existing = await FleetItem.findByPk(id);
    while (existing) {
      id = `${baseId}-${counter}`;
      counter++;
      existing = await FleetItem.findByPk(id);
    }

    const newVehicle = await FleetItem.create({
      id,
      name,
      category,
      image,
      description,
      price,
      passengers: Number(passengers),
      luggage: Number(luggage),
      available: true,
    });

    return Response.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to add vehicle to MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
