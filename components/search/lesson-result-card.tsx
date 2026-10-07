"use client";

import React from "react";
import Link from "next/link";
import { trackSearchResultClicked } from "@/lib/analytics";
import { CheckCircleIcon, CourseBrandIcon, DocumentIcon, ExternalLinkIcon } from "@/components/ui/icons";
import type { LessonSearchResult } from "@/sanity/lib/search";

interface LessonResultCardProps {
  result: LessonSearchResult;
  query: string;
  positionIndex?: number;
}

export function LessonResultCard({ result, query, positionIndex }: LessonResultCardProps) {
  const lessonUrl = `/lesson/${result.lessonSlug}`;

  const handleClick = () => {
    trackSearchResultClicked({
      query,
      result_type: "lesson",
      lesson_slug: result.lessonSlug,
      course_title: result.courseTitle,
      position_index: positionIndex,
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-stretch hover:border-neutral-300 hover:shadow-xs transition-all">
      {/* Left Key Points Preview */}
      <div className="shrink-0 w-full md:w-[260px] lg:w-[280px] rounded-xl bg-neutral-50/80 border border-neutral-100 p-4 flex flex-col justify-between min-h-[140px]">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <DocumentIcon size={16} />
          </div>
          <ul className="space-y-1.5">
            {result.keyPoints.slice(0, 3).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-neutral-600 font-medium leading-tight">
                <span className="text-neutral-400 mt-0.5">•</span>
                <span className="line-clamp-1">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <div className="w-5 h-5 rounded-full bg-neutral-600/10 text-neutral-600 flex items-center justify-center">
            <CheckCircleIcon size={14} className="fill-neutral-600 text-white" />
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
        <div className="space-y-2">
          {/* Top Row: Course Info & LESSON Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <CourseBrandIcon title={result.courseTitle} className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium text-neutral-700 truncate">
                {result.courseTitle}
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F3E8FF] text-[#7C3AED] border border-[#E9D5FF] shrink-0 select-none">
              LESSON
            </span>
          </div>

          {/* Lesson Title */}
          <Link
            href={lessonUrl}
            onClick={handleClick}
            className="block font-bold text-base sm:text-lg text-neutral-900 hover:text-[#7C3AED] transition-colors line-clamp-1"
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
          <div className="text-xs text-neutral-500 font-medium">
            {result.moduleLabel}
          </div>

          <Link
            href={lessonUrl}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] group/btn transition-colors cursor-pointer shrink-0"
          >
            <span>View lesson</span>
            <ExternalLinkIcon size={13} className="text-[#EA580C]" />
            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
