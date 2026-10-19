// src/lib/storage/supabase.ts
// Supabase Storage Helper for handling media uploads (avatars, profile-photos, cms-media)
// Uses @supabase/storage-js StorageClient for clean, robust HTTP uploads in Node & Browser

import { StorageClient } from "@supabase/storage-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vfcfqqnyzehjpepwyvpo.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmY2ZxcW55emVoanBlcHd5dnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDk0MTEsImV4cCI6MjEwNTU4NTQxMX0.rEzfiQVHhyJrF-ypVOaaeYHpeK4aCvLpM2FkiMAp9m0";

export const storageClient = new StorageClient(`${SUPABASE_URL}/storage/v1`, {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
});

export type BucketName = "avatars" | "profile-photos" | "cms-media";

export async function uploadMedia(
  file: Blob | Buffer,
  fileName: string,
  bucket: BucketName = "cms-media",
  contentType: string = "image/jpeg"
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data, error } = await storageClient
      .from(bucket)
      .upload(cleanFileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`[Supabase Storage] Error uploading to ${bucket}:`, error.message);
      return { url: null, path: null, error: error.message };
    }

    const { data: publicUrlData } = storageClient.from(bucket).getPublicUrl(cleanFileName);

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
