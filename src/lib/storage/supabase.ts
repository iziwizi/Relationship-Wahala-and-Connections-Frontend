// src/lib/storage/supabase.ts
// Supabase Storage Helper for handling media uploads (avatars, profile-photos, cms-media)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BucketName = "avatars" | "profile-photos" | "cms-media";

export async function uploadMedia(
  file: Blob | Buffer,
  fileName: string,
  bucket: BucketName = "cms-media",
  contentType: string = "image/jpeg"
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(cleanFileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`[Supabase Storage] Error uploading to ${bucket}:`, error.message);
      return { url: null, path: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(cleanFileName);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown upload error";
    console.error("[Supabase Storage] Exception:", msg);
    return { url: null, path: null, error: msg };
  }
}
