import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload - Handle file upload and store in public directory
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to avoid duplicates
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.name) || ".jpg";
    const filename = `upload-${uniqueSuffix}${originalExtension}`;

    // Target upload directory inside public
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return Response.json({ url: publicUrl });
  } catch (error) {
    console.error("Failed to upload image file:", error);
    return Response.json({ error: "Internal Server Error during upload" }, { status: 500 });
  }
}
