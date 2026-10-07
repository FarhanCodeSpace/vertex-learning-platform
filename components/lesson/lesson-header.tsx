"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import { Breadcrumbs } from "@/components/ui/navigation";
import { ClockIcon, SignalIcon, UsersIcon, BookmarkIcon } from "@/components/ui/icons";
import { formatDuration, formatStudentCount } from "@/lib/format";

interface LessonHeaderProps {
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string;
  moduleIndex: number;
  lessonIndex: number;
  lessonTitle: string;
  lessonSlug: string;
  summary?: string;
  duration?: string | number;
  level?: string;
  studentCount?: number;
}

export function LessonHeader({
  courseTitle,
  courseSlug,
  moduleTitle,
  moduleIndex,
  lessonIndex,
  lessonTitle,
  lessonSlug,
  summary,
  duration,
  level = "Intermediate",
  studentCount,
}: LessonHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formattedDuration = formatDuration(duration) || "15m";
  const formattedStudents = formatStudentCount(studentCount ?? 3426);
  const lessonNumberLabel = `LESSON ${moduleIndex + 1}.${lessonIndex + 1}`;

  const handleBookmarkToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    posthog.capture("lesson_bookmarked", {
      lesson_slug: lessonSlug,
      course_slug: courseSlug,
      is_bookmarked: nextState,
    });
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "All Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseSlug}` },
          { label: moduleTitle },
          { label: lessonTitle },
        ]}
      />

      {/* Lesson Tag Badge */}
      <div className="pt-1">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider bg-[#FFF2EB] text-[#EA580C] border border-[#FED7AA]/60 uppercase">
          {lessonNumberLabel}
        </span>
      </div>

      {/* Title & Bookmark Row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[40px] text-neutral-900 tracking-tight leading-snug sm:leading-tight">
          {lessonTitle}
        </h1>

        <button
          type="button"
          onClick={handleBookmarkToggle}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
          className={`shrink-0 p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
            isBookmarked
              ? "bg-[#FFF5F0] border-[#FDBA74] text-[#EA580C]"
              : "bg-white border-neutral-200/90 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
          }`}
        >
          <BookmarkIcon
            size={18}
            className={isBookmarked ? "fill-[#EA580C]" : ""}
          />
        </button>
      </div>

      {/* Summary / Description */}
      {summary && (
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl">
          {summary}
        </p>
      )}

      {/* Meta Icons Row */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-1 text-xs sm:text-sm text-neutral-600 font-medium">
        <div className="flex items-center gap-2">
          <ClockIcon size={16} className="text-neutral-400 shrink-0" />
          <span>{formattedDuration}</span>
        </div>

        <div className="flex items-center gap-2">
          <SignalIcon size={16} className="text-neutral-400 shrink-0" />
          <span>{level}</span>
        </div>

        <div className="flex items-center gap-2">
          <UsersIcon size={16} className="text-neutral-400 shrink-0" />
          <span>{formattedStudents}</span>
        </div>
      </div>
    </div>
  );
}
