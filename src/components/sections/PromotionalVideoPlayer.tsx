"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Film } from "lucide-react";

interface PromotionalVideoPlayerProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export default function PromotionalVideoPlayer({
  title = "Experience Relationship Wahala & Connections",
  subtitle = "Watch our official feature presentation exploring modern relationship challenges, intentional dating, and how our matchmaking platform prepares hearts for enduring marriages.",
  eyebrow = "FEATURED SHOWCASE",
  className = "",
}: PromotionalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header text */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 font-sans text-xs font-bold tracking-widest uppercase text-[#c9962c] bg-[#c9962c]/10 px-3.5 py-1 rounded-full mb-3">
              <Film size={12} />
              {eyebrow}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight">
            {title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Video Card */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#e8e0d4] shadow-xl bg-black group">
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              src="/videos/relationship-wahala-promo.mp4"
              playsInline
              controls={isPlaying}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Custom Overlay (visible when paused or before start) */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 flex flex-col items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/40"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7b1d2a] hover:bg-[#9b2535] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 border-2 border-[#c9962c]">
                  <Play size={28} className="translate-x-0.5 text-[#fbf5ec]" fill="#fbf5ec" />
                </div>
                <div className="mt-4 text-center px-4">
                  <p className="font-serif font-bold text-base sm:text-lg text-white">
                    Click to Play Official Video
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-gray-300 mt-1">
                    Relationship Wahala &amp; Connections · Full Audio &amp; HD Video
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Bar below video */}
          <div className="bg-[#1a1a1a] text-white/90 px-4 py-3 flex items-center justify-between text-xs font-sans border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-semibold text-white">Official Presentation</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className="text-gray-300 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="text-gray-300 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
