import { NextRequest } from "next/server";
import { initDb, LocationService } from "@/lib/db";

// GET /api/services - Retrieve all location-based services from MySQL
export async function GET(request: NextRequest) {
  try {
    await initDb();
    
    // Parse location filter if present
    const url = new URL(request.url);
    const location = url.searchParams.get("location");

    const queryOptions: any = {};
    if (location) {
      queryOptions.where = { location };
    }

    const list = await LocationService.findAll(queryOptions);
    return Response.json(list);
  } catch (error) {
    console.error("Failed to query location services from MySQL:", error);
    return Response.json(
      { error: "Failed to load database records" },
      { status: 500 }
    );
  }
}

// POST /api/services - Register a new location-based service in MySQL
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { name, description, image, location, price, slug, tagline, bulletPoints, featuresJson, imagesJson } = body;

    if (!name || !description || !image || !location) {
      return Response.json(
        { error: "Missing required fields: name, description, image, and location are required" },
        { status: 400 }
      );
    }

    const service = await LocationService.create({
      name,
      description,
      image,
      location,
      price: price || "",
      slug: slug || "",
      tagline: tagline || "",
      bulletPoints: bulletPoints || "[]",
      featuresJson: featuresJson || "[]",
      imagesJson: imagesJson || "[]",
      available: true,
    });

    return Response.json(service, { status: 201 });
  } catch (error) {
    console.error("Failed to create location service in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

