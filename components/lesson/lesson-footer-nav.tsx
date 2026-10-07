"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { formatDuration } from "@/lib/format";
import { trackLessonCompleted } from "@/lib/analytics";
import type { LessonNavigationItem } from "@/sanity/types";

interface LessonFooterNavProps {
  previousLesson?: LessonNavigationItem | null;
  nextLesson?: LessonNavigationItem | null;
  courseSlug: string;
}

export function LessonFooterNav({
  previousLesson,
  nextLesson,
  courseSlug,
}: LessonFooterNavProps) {
  const handleNavClick = (direction: "previous" | "next", item: LessonNavigationItem) => {
    if (direction === "next" && previousLesson?.slug?.current) {
      trackLessonCompleted({
        lesson_slug: previousLesson.slug.current,
        course_slug: courseSlug,
        module_index: previousLesson.moduleIndex,
        lesson_index: previousLesson.lessonIndex,
        completion_trigger: "next_lesson_button",
      });
    }

    posthog.capture("lesson_navigation_clicked", {
      direction,
      course_slug: courseSlug,
      target_lesson_slug: item.slug?.current,
      module_index: item.moduleIndex,
      lesson_index: item.lessonIndex,
    });
  };

  return (
    <nav aria-label="Lesson navigation" className="w-full pt-8 sm:pt-10 border-t border-neutral-200/80">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
        {/* Previous Lesson Link */}
        {previousLesson?.slug?.current ? (
          <Link
            href={`/lesson/${previousLesson.slug.current}`}
            onClick={() => handleNavClick("previous", previousLesson)}
            className="group flex items-center gap-3.5 text-left transition-all"
          >
            <div className="px-5 py-3 rounded-xl border border-neutral-200/90 bg-white text-neutral-800 text-xs sm:text-sm font-semibold shadow-2xs group-hover:bg-neutral-50 group-hover:border-neutral-300 flex items-center gap-2 shrink-0 transition-colors">
              <ChevronLeftIcon size={16} className="group-hover:-translate-x-0.5 transition-transform text-neutral-700" />
              <span>Previous Lesson</span>
            </div>

            <div className="min-w-0">
              <span className="block text-xs font-semibold text-neutral-800 truncate max-w-[200px] leading-snug">
                {previousLesson.title}
              </span>
              <span className="block text-[11px] text-neutral-400 font-normal mt-0.5">
                {formatDuration(previousLesson.duration) || "15m"}
              </span>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Lesson Link */}
        {nextLesson?.slug?.current ? (
          <Link
            href={`/lesson/${nextLesson.slug.current}`}
            onClick={() => handleNavClick("next", nextLesson)}
            className="group flex items-center gap-3.5 text-right justify-end transition-all"
          >
            <div className="min-w-0 text-right">
              <span className="block text-xs font-semibold text-neutral-800 truncate max-w-[200px] leading-snug">
                {nextLesson.title}
              </span>
              <span className="block text-[11px] text-neutral-400 font-normal mt-0.5">
                {formatDuration(nextLesson.duration) || "15m"}
              </span>
            </div>

            <div className="px-5 sm:px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 shrink-0 transition-all">
              <span>Next Lesson</span>
              <ChevronRightIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </nav>
  );
}
