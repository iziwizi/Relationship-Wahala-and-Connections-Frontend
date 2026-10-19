// src/app/api/upload/route.ts
// Server-side media upload handler — uploads directly to Supabase Storage
// Allows profile-photos & avatars during onboarding/registration even if not logged in yet

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { uploadMedia, BucketName } from "@/lib/storage/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as BucketName) || "profile-photos";

    // Check auth for admin / CMS buckets, but allow registration profile-photos & avatars
    const isPublicAllowedBucket = bucket === "profile-photos" || bucket === "avatars";

    if (!isPublicAllowedBucket) {
      const token = req.cookies.get(SESSION_COOKIE)?.value;
      const session = token ? await verifySession(token) : null;

      if (!session) {
        return NextResponse.json({ error: "Authentication required to upload media." }, { status: 401 });
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed formats: JPEG, PNG, WebP." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const result = await uploadMedia(buffer, file.name, bucket, file.type);
    if (result.url) {
      return NextResponse.json({ success: true, url: result.url, path: result.path });
    }

    console.error("[Upload API] Supabase storage upload returned error:", result.error);
    return NextResponse.json(
      { error: result.error || "Failed to upload photo to storage. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
