import { NextRequest, NextResponse } from "next/server";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import { createHash } from "crypto";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import { sniffImage } from "@/lib/sniff-image";
import { Otp } from "@/features/users/otp.model";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// Profile photos are uploaded during signup, before the account exists. The caller must have passed the
// emailed signup code for this address within the last 10 minutes (the same proof userSignup requires).
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const email = String(formData.get("email") ?? "").toLowerCase().trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size must be under 2MB" }, { status: 400 });
    }

    await connectToDatabase();
    const verified = await Otp.exists({ email, purpose: "signup", verified: true, expiresAt: { $gt: new Date() } });
    if (!verified) {
      return NextResponse.json({ error: "Please verify your email again before uploading a photo." }, { status: 403 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = sniffImage(buffer);
    if (!ext) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are allowed" }, { status: 400 });
    }

    // At most one photo per email: drop this address's earlier uploads, then store the new one under a
    // fresh name (a new name rather than overwriting, so browsers never show a cached old photo).
    const prefix = createHash("sha256").update(email).digest("hex").slice(0, 24);
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "profiles");
    await mkdir(uploadsDir, { recursive: true });
    const old = (await readdir(uploadsDir)).filter((f) => f.startsWith(`${prefix}-`));
    await Promise.all(old.map((f) => unlink(path.join(uploadsDir, f)).catch(() => {})));

    const filename = `${prefix}-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/profiles/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
