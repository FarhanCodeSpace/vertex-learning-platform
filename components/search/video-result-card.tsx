"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { CourseBrandIcon, DocumentIcon, PlayIcon } from "@/components/ui/icons";
import type { VideoSearchResult } from "@/sanity/lib/search";

interface VideoResultCardProps {
  result: VideoSearchResult;
  query: string;
}

export function VideoResultCard({ result, query }: VideoResultCardProps) {
  const lessonUrl = `/lesson/${result.lessonSlug}?start=${result.startSeconds}`;

  const handleClick = () => {
    posthog.capture("search_result_clicked", {
      query,
      result_type: "video",
      lesson_slug: result.lessonSlug,
      start_seconds: result.startSeconds,
      course_title: result.courseTitle,
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-stretch hover:border-neutral-300 hover:shadow-xs transition-all">
      {/* Left 16:9 Thumbnail Preview */}
      <Link
        href={lessonUrl}
        onClick={handleClick}
        className="relative shrink-0 w-full md:w-[260px] lg:w-[280px] aspect-video rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 overflow-hidden flex items-center justify-center group/thumb shadow-inner"
      >
        {/* Visual Brand Background Accent */}
        <div className="absolute inset-0 opacity-20 flex items-center justify-center scale-150 group-hover/thumb:scale-160 transition-transform duration-300">
          <CourseBrandIcon title={result.courseTitle} className="w-24 h-24 opacity-60" />
        </div>

        {/* Play Button Icon Overlay */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-md group-hover/thumb:scale-110 group-hover/thumb:bg-white transition-transform">
          <PlayIcon size={20} className="ml-0.5 text-neutral-900 fill-neutral-900" />
        </div>

        {/* Duration Badge Bottom-Right */}
        <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white font-mono text-xs font-medium tracking-tight select-none">
          {result.startFormatted || result.durationFormatted}
        </div>
      </Link>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
        <div className="space-y-2">
          {/* Top Row: Course Info & VIDEO Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <CourseBrandIcon title={result.courseTitle} className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium text-neutral-700 truncate">
                {result.courseTitle}
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FFF5F0] text-[#EA580C] border border-[#FED7AA]/70 shrink-0 select-none">
              VIDEO
            </span>
          </div>

          {/* Lesson Title */}
          <Link
            href={lessonUrl}
            onClick={handleClick}
            className="block font-bold text-base sm:text-lg text-neutral-900 hover:text-[#EA580C] transition-colors line-clamp-1"
          >
            {result.title}
          </Link>

          {/* Description */}
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {result.summary}
          </p>
        </div>

        {/* Bottom Row: Module Info & Action Link */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100/80">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 min-w-0">
            <DocumentIcon size={14} className="shrink-0 text-neutral-400" />
            <span className="truncate">{result.moduleLabel}</span>
          </div>

          <Link
            href={lessonUrl}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] group/btn transition-colors cursor-pointer shrink-0"
          >
            <div className="w-4 h-4 rounded-full border border-[#EA580C] flex items-center justify-center group-hover/btn:bg-[#EA580C] group-hover/btn:text-white transition-colors">
              <PlayIcon size={9} className="ml-0.5 fill-current" />
            </div>
            <span>Watch from {result.startFormatted}</span>
            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
