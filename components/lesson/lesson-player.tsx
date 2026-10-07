"use client";

import React, { useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { getEmbedUrl } from "@/lib/video";
import { PlayIcon } from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

interface LessonPlayerProps {
  videoUrl?: string;
  poster?: SanityImage;
  title: string;
  lessonSlug: string;
  courseSlug?: string;
  startSeconds?: number;
}

export function LessonPlayer({
  videoUrl,
  poster,
  title,
  lessonSlug,
  courseSlug,
  startSeconds = 0,
}: LessonPlayerProps) {
  const [userStarted, setUserStarted] = useState(false);
  const isPlaying = userStarted || startSeconds > 0;
  const parsed = getEmbedUrl(videoUrl, startSeconds);

  // If startSeconds is provided or there is a valid embedUrl, we can either autoplay or show poster overlay
  const posterUrl = poster ? urlFor(poster).width(1280).height(720).url() : null;

  const handleStartPlay = () => {
    setUserStarted(true);
    posthog.capture("lesson_video_played", {
      lesson_slug: lessonSlug,
      course_slug: courseSlug,
      start_seconds: startSeconds,
      has_video: Boolean(videoUrl),
    });
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl flex items-center justify-center group">
      {parsed?.embedUrl && isPlaying ? (
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Poster image or dark gradient placeholder */}
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-neutral-900 via-neutral-950 to-black flex items-center justify-center">
              {/* Minimal brand monogram background */}
              <span className="font-serif font-black text-8xl sm:text-9xl text-white/5 select-none pointer-events-none">
                V
              </span>
            </div>
          )}

          {/* Dark scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Central Play Button */}
          <button
            type="button"
            onClick={handleStartPlay}
            aria-label={`Play ${title}`}
            className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-neutral-900 hover:bg-[#F97316] hover:text-white flex items-center justify-center shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
          >
            <PlayIcon size={26} className="ml-1 text-neutral-900 group-hover/btn:text-white transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
