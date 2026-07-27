"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: "avatars" | "profile-photos" | "cms-media";
  label?: string;
  className?: string;
}

export default function MediaUploader({
  value,
  onChange,
  bucket = "cms-media",
  label = "Upload Featured Image",
  className = "",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("[MediaUploader] Upload error:", err);
      setError("Network error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-gray-700 uppercase">{label}</label>}

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-48 w-full flex items-center justify-center">
          <Image src={value} alt="Uploaded media preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2.5 bg-white text-gray-800 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-gray-100"
            >
              <RefreshCw size={14} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2.5 bg-red-600 text-white rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-red-700"
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-[#7b1d2a] rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-[#fbf5ec]/40 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#7b1d2a]">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-gray-800">
              {uploading ? "Uploading image..." : "Click to select or drag & drop"}
            </p>
            <p className="font-sans text-[11px] text-gray-400 mt-0.5">JPEG, PNG, WebP up to 5MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-sans mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
