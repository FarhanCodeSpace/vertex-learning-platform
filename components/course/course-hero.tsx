"use client";

import React, { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  ChartIcon,
  ClockIcon,
  DocumentIcon,
  UserIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
} from "@/components/ui/icons";
import { CourseVisual } from "./course-icon";
import { formatStudentCount, capitalize } from "@/lib/format";
import type { CourseDetail } from "@/sanity/types";

interface CourseHeroProps {
  course: CourseDetail;
  firstLessonSlug?: string | null;
  totalDuration: string;
  totalModulesCount: number;
}

export function CourseHero({
  course,
  firstLessonSlug,
  totalDuration,
  totalModulesCount,
}: CourseHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const firstLessonUrl = firstLessonSlug
    ? `/lesson/${firstLessonSlug}`
    : `/courses/${course.slug.current}`;

  const toggleBookmark = () => {
    const willBeBookmarked = !isBookmarked;
    setIsBookmarked(willBeBookmarked);
    posthog.capture("course_bookmark_toggled", {
      course_slug: course.slug.current,
      is_bookmarked: willBeBookmarked,
    });
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Column: Course Logo / Hero Tile */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <CourseVisual
            icon={course.icon}
            coverImage={course.coverImage}
            title={course.title}
            className="w-full max-w-[280px] sm:max-w-[320px] aspect-square"
          />
        </div>

        {/* Right Column: Course Info & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          {/* Popular Tag */}
          {course.popular && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF5F0] border border-[#FED7AA]/60 text-[#C2410C] font-semibold text-[11px] tracking-[0.16em] uppercase mb-4 select-none">
              POPULAR
            </div>
          )}

          {/* Main Title */}
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[44px] leading-[1.16] tracking-tight text-neutral-900">
            {course.title}
          </h1>

          {/* Summary / Description */}
          <p className="mt-4 text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed">
            {course.summary}
          </p>

          {/* Metadata Row */}
          <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ChartIcon size={16} className="text-neutral-400" />
              <span>{capitalize(course.level || "Intermediate")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon size={16} className="text-neutral-400" />
              <span>{totalDuration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DocumentIcon size={16} className="text-neutral-400" />
              <span>{totalModulesCount} modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserIcon size={16} className="text-neutral-400" />
              <span>{formatStudentCount(course.studentCount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={firstLessonUrl}
              onClick={() =>
                posthog.capture("learning_continued", {
                  course_slug: course.slug.current,
                  lesson_slug: firstLessonSlug,
                  total_modules: totalModulesCount,
                })
              }
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-medium text-sm shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Continue Learning</span>
              <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>

            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all cursor-pointer shadow-2xs ${
                isBookmarked
                  ? "border-[#F97316]/50 bg-[#FFF5F0] text-[#C2410C]"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
              }`}
            >
              {isBookmarked ? (
                <BookmarkFilledIcon size={16} className="text-[#F97316]" />
              ) : (
                <BookmarkIcon size={16} className="text-neutral-500" />
              )}
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
