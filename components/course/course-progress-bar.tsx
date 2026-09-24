"use client";

import React from "react";
import Link from "next/link";

interface CourseProgressBarProps {
  percentage?: number;
  firstLessonSlug?: string | null;
  courseSlug: string;
}

export function CourseProgressBar({
  percentage = 35,
  firstLessonSlug,
  courseSlug,
}: CourseProgressBarProps) {
  const targetUrl = firstLessonSlug
    ? `/lesson/${firstLessonSlug}`
    : `/courses/${courseSlug}`;

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-8 lg:inset-x-12 z-40 max-w-[1280px] mx-auto pointer-events-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl shadow-xl">
        {/* Left: Progress details and bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <div className="shrink-0">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Your Progress
            </p>
            <p className="font-serif font-bold text-sm sm:text-base text-neutral-900 mt-0.5">
              {percentage}% complete
            </p>
          </div>

          {/* Progress Bar Track */}
          <div className="flex-1 sm:w-64 md:w-80 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Right: Continue Learning Button */}
        <div className="w-full sm:w-auto shrink-0">
          <Link
            href={targetUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-medium text-sm shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>Continue Learning</span>
            <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
