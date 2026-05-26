import { NextRequest } from "next/server";
import crypto from "crypto";
import { initDb, AdminAccount } from "@/lib/db";

// POST /api/auth - Login verification in MySQL
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const admin = await AdminAccount.findByPk(normalizedUsername);

    if (!admin) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compute hash
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    
    if (admin.passwordHash === passwordHash) {
      return Response.json({ success: true, username: normalizedUsername });
    } else {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Authentication query error in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/auth - Update administrator password in MySQL
export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { username, currentPassword, newPassword } = body;

    if (!username || !currentPassword || !newPassword) {
      return Response.json(
        { error: "Username, current password, and new password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const admin = await AdminAccount.findByPk(normalizedUsername);

    if (!admin) {
      return Response.json(
        { error: "Administrator account not found" },
        { status: 404 }
      );
    }

    // Compute hash for current password check
    const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");

    if (admin.passwordHash !== currentHash) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Compute hash for new password
    const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");

    // Update password hash in MySQL
    await admin.update({ passwordHash: newHash });

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update query error in MySQL:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
