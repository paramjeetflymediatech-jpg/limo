import { NextRequest } from "next/server";
import crypto from "crypto";
import { initDb, AdminAccount } from "@/lib/db";
import fs from "fs";
import path from "path";

function cleanString(val?: string | null): string {
  if (!val) return "";
  let s = String(val).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

function getAdminEnvCredentials() {
  const fileEnv: Record<string, string> = {};
  const paths = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
  ];

  for (const envPath of paths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            fileEnv[key] = val;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const rawUsername =
    fileEnv.ADMIN_USERNAME ||
    fileEnv.ADMIN_USER ||
    fileEnv.ADMIN_ID ||
    fileEnv.ADMIN_EMAIL ||
    process.env.ADMIN_USERNAME ||
    process.env.ADMIN_USER ||
    process.env.ADMIN_ID ||
    process.env.ADMIN_EMAIL ||
    "admin";

  const rawPass =
    fileEnv.ADMIN_PASSWORD ||
    fileEnv.ADMIN_PASS ||
    fileEnv.PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_PASS ||
    process.env.PASSWORD ||
    "admin@123";

  return {
    username: cleanString(rawUsername).toLowerCase(),
    password: cleanString(rawPass),
  };
}

async function syncAdminAccount(targetUser: string, newPlainPass: string) {
  try {
    const passwordHash = crypto.createHash("sha256").update(newPlainPass).digest("hex");
    const [admin, created] = await AdminAccount.findOrCreate({
      where: { username: targetUser },
      defaults: {
        username: targetUser,
        passwordHash,
      },
    });

    if (!created && admin.passwordHash !== passwordHash) {
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log(`[Auth] Automatically updated admin passwordHash in DB for: ${targetUser}`);
    } else if (created) {
      console.log(`[Auth] Created new admin user in DB for: ${targetUser}`);
    }
    return admin;
  } catch (err: any) {
    console.warn("[Auth] Database sync warning:", err?.message || err);
    return null;
  }
}

// POST /api/auth - Login verification in MySQL
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    const inputUser = cleanString(username).toLowerCase();
    const inputPass = cleanString(password);

    if (!inputUser || !inputPass) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const adminCreds = getAdminEnvCredentials();

    const isAdminAttempt =
      Boolean(adminCreds.password) &&
      (inputUser === adminCreds.username ||
        inputUser === "admin" ||
        inputUser === "admin@fantasticlimo.ca" ||
        inputUser === "info@fantasticlimo.ca");

    if (isAdminAttempt) {
      // STRICT CHECK: Admin password must match .env ADMIN_PASSWORD!
      if (inputPass !== adminCreds.password) {
        console.warn(`[Auth] Admin login failed: Password mismatch for ${inputUser}`);
        return Response.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      // Automatically sync/update the database hash
      await syncAdminAccount(adminCreds.username, adminCreds.password);
      console.log(`[Auth] Admin login successful for ${adminCreds.username} (synced to database)`);
      return Response.json({ success: true, username: adminCreds.username });
    } else {
      const admin = await AdminAccount.findByPk(inputUser);

      if (!admin) {
        return Response.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      // Compute hash
      const passwordHash = crypto.createHash("sha256").update(inputPass).digest("hex");

      if (admin.passwordHash === passwordHash) {
        return Response.json({ success: true, username: inputUser });
      } else {
        return Response.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
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
    const body = await request.json().catch(() => ({}));
    const { username, currentPassword, newPassword } = body;

    if (!username || !currentPassword || !newPassword) {
      return Response.json(
        { error: "Username, current password, and new password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = cleanString(username).toLowerCase();
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
