import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoItem } from "@/data/videos";

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-200">
        <Image
          src={video.thumbnail}
          alt={video.thumbnailAlt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-200" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200 cursor-pointer group">
            <Play size={18} className="text-[#7b1d2a] ml-0.5 group-hover:scale-110 transition-transform duration-200" fill="#7b1d2a" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white font-sans text-xs px-2 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-[#1a1a1a] text-sm font-bold leading-snug mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="font-sans text-gray-500 text-xs mt-auto">
          {video.views} &bull; {video.publishedAgo}
        </p>
      </div>
    </article>
  );
}
