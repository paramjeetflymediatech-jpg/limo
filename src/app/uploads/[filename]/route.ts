import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Resolve upload directory path
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Verify if file exists on filesystem
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read the file data
    const fileBuffer = fs.readFileSync(filePath);

    // Determine the Content-Type header based on extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".ico":
        contentType = "image/x-icon";
        break;
      case ".pdf":
        contentType = "application/pdf";
        break;
    }

    // Return file buffer with correct headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
