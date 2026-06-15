import { NextResponse } from "next/server";
import { initDb, BlogPost } from "@/lib/db";
import { Op } from "sequelize";

export async function GET(request: Request) {
  try {
    await initDb();
    const url = new URL(request.url);
    const publishedOnly = url.searchParams.get("published") === "true";

    const where = publishedOnly ? { published: true } : {};

    const posts = await BlogPost.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    
    // Ensure slug is unique or generate one if missing
    let slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists
    const existing = await BlogPost.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await BlogPost.create({
      ...body,
      slug,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
