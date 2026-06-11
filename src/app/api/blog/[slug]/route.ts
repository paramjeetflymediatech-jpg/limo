import { NextResponse } from "next/server";
import { initDb, BlogPost } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await initDb();
    
    // Check by ID or Slug
    let post;
    if (!isNaN(Number(resolvedParams.slug))) {
      post = await BlogPost.findByPk(resolvedParams.slug);
    }
    
    if (!post) {
      post = await BlogPost.findOne({ where: { slug: resolvedParams.slug } });
    }

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await initDb();
    const body = await request.json();
    
    const post = await BlogPost.findByPk(resolvedParams.slug);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await post.update(body);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await initDb();
    const post = await BlogPost.findByPk(resolvedParams.slug);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await post.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
