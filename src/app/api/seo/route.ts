import { NextRequest } from "next/server";
import { initDb, SeoConfig, deleteLocalUpload } from "@/lib/db";

// GET /api/seo - Get SEO configuration for all pages from MySQL
export async function GET() {
  try {
    await initDb();
    const list = await SeoConfig.findAll();
    
    // Structure as key-value pairs matching JSON structure
    const seoData: Record<string, any> = {};
    list.forEach((item) => {
      seoData[item.route] = {
        title: item.title,
        description: item.description,
        keywords: item.keywords,
        ogTitle: item.ogTitle,
        ogDescription: item.ogDescription,
        ogImage: item.ogImage,
        canonicalUrl: item.canonicalUrl,
      };
    });

    return Response.json(seoData);
  } catch (error) {
    console.error("Failed to query SEO configs from MySQL:", error);
    return Response.json(
      { error: "Failed to load database records" },
      { status: 500 }
    );
  }
}

// PUT /api/seo - Update SEO configuration for a specific route in MySQL
export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const data = await request.json();
    const { route, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl } = data;

    if (!route || !title || !description) {
      return Response.json(
        { error: "Missing required fields: route, title, and description are required" },
        { status: 400 }
      );
    }

    // Normalize route key (must start with /)
    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

    // Clean up old local upload if changing to a new image
    const existing = await SeoConfig.findByPk(normalizedRoute);
    if (existing && existing.ogImage && existing.ogImage !== ogImage) {
      await deleteLocalUpload(existing.ogImage);
    }

    // Upsert (insert or update) in MySQL
    await SeoConfig.upsert({
      route: normalizedRoute,
      title,
      description,
      keywords: keywords || "",
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description,
      ogImage: ogImage || "",
      canonicalUrl: canonicalUrl || "",
    });

    const updatedConfig = {
      title,
      description,
      keywords: keywords || "",
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description,
      ogImage: ogImage || "",
      canonicalUrl: canonicalUrl || "",
    };

    return Response.json({ message: "SEO updated successfully", route: normalizedRoute, config: updatedConfig });
  } catch (error) {
    console.error("Failed to update SEO in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/seo - Delete SEO configuration for a specific route from MySQL
export async function DELETE(request: NextRequest) {
  try {
    await initDb();
    const url = new URL(request.url);
    const route = url.searchParams.get("route");

    if (!route) {
      return Response.json(
        { error: "Missing required query parameter: route" },
        { status: 400 }
      );
    }

    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

    const existing = await SeoConfig.findByPk(normalizedRoute);
    if (!existing) {
      return Response.json(
        { error: "SEO configuration not found for this route" },
        { status: 404 }
      );
    }

    // Clean up local social card upload if it exists
    if (existing.ogImage) {
      await deleteLocalUpload(existing.ogImage);
    }

    await existing.destroy();

    return Response.json({
      message: "SEO configuration deleted successfully",
      route: normalizedRoute,
    });
  } catch (error) {
    console.error("Failed to delete SEO in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

