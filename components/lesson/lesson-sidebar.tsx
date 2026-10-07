"use client";

import React, { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  PlayFilledIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";
import { CourseIcon } from "@/components/course/course-icon";
import { calculateModuleDuration, formatDuration } from "@/lib/format";
import type { LessonSummary } from "@/sanity/types";

interface CourseModule {
  _key?: string;
  title: string;
  summary?: string;
  lessons: LessonSummary[];
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  courseIcon?: string;
  modules: CourseModule[];
  currentModuleIndex: number;
  currentLessonSlug: string;
  progressPercentage?: number;
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  courseIcon,
  modules,
  currentModuleIndex,
  currentLessonSlug,
  progressPercentage = 35,
}: LessonSidebarProps) {
  // Set the current active module expanded by default
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    [currentModuleIndex]: true,
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLessonClick = (lesson: LessonSummary, modIdx: number, lIdx: number) => {
    posthog.capture("lesson_nav_clicked", {
      course_slug: courseSlug,
      lesson_slug: lesson.slug?.current,
      module_index: modIdx,
      lesson_index: lIdx,
    });
    setMobileDrawerOpen(false);
  };

  return (
    <aside className="w-full lg:w-[300px] shrink-0 lg:pr-6 lg:border-r lg:border-neutral-200/80">
      {/* Mobile Drawer Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="w-full py-3 px-4 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-between shadow-2xs text-sm font-medium text-neutral-800"
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold">Course Navigation</span>
            <span className="text-neutral-500">• Module {currentModuleIndex + 1} of {modules.length}</span>
          </span>
          <ChevronDownIcon
            size={18}
            className={`transition-transform duration-200 ${mobileDrawerOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Sidebar Content (Always visible on desktop, toggleable on mobile) */}
      <div
        className={`space-y-6 ${
          mobileDrawerOpen
            ? "block bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs mb-6"
            : "hidden lg:block"
        }`}
      >
        {/* Back to course link */}
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors group cursor-pointer"
        >
          <ChevronLeftIcon size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to course</span>
        </Link>

        {/* Course Header Banner */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-neutral-200/70">
          <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            <CourseIcon icon={courseIcon} className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-sans font-bold text-sm text-neutral-900 truncate leading-tight">
              {courseTitle}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">
              {progressPercentage}% complete
            </p>
          </div>
        </div>

        {/* Module Status Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 tracking-normal px-0.5">
          <span>Module {currentModuleIndex + 1} of {modules.length}</span>
          <ChevronDownIcon size={14} className="text-neutral-500" />
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {modules.map((mod, modIdx) => {
            const isCurrentModule = modIdx === currentModuleIndex;
            const isExpanded = !!expandedModules[modIdx];
            const isPastModule = modIdx < currentModuleIndex;
            const modDuration = calculateModuleDuration(mod.lessons);
            const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];

            return (
              <div
                key={mod._key || modIdx}
                className="transition-colors"
              >
                {/* Module Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(modIdx)}
                  className="w-full flex items-center justify-between gap-3 text-left py-1 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Numbered / Status Circle */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                        isCurrentModule
                          ? "bg-[#EA580C] text-white font-bold shadow-2xs"
                          : "border border-neutral-300 bg-white text-neutral-700 font-medium"
                      }`}
                    >
                      {modIdx + 1}
                    </div>

                    {/* Title and Duration */}
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs leading-snug truncate ${
                          isCurrentModule
                            ? "font-bold text-neutral-900"
                            : "font-semibold text-neutral-900 group-hover:text-[#EA580C] transition-colors"
                        }`}
                      >
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-normal">
                        {modDuration}
                      </p>
                    </div>
                  </div>

                  {/* Checkmark or Chevron */}
                  <div className="shrink-0 flex items-center pl-1">
                    {isPastModule ? (
                      <span className="text-[#EA580C]">
                        <CheckCircleIcon size={18} />
                      </span>
                    ) : isExpanded ? (
                      <ChevronDownIcon size={15} className="text-neutral-500 rotate-180 transition-transform" />
                    ) : (
                      <ChevronDownIcon size={15} className="text-neutral-400 transition-transform" />
                    )}
                  </div>
                </button>

                {/* Lessons in Active / Expanded Module */}
                {isExpanded && lessons.length > 0 && (
                  <div className="relative mt-2 ml-3.5 pl-5 space-y-3.5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-neutral-200/80">
                    {lessons.map((lesson, lessonIdx) => {
                      const isActiveLesson = lesson.slug?.current === currentLessonSlug;
                      const lessonDuration = formatDuration(lesson.duration) || "15m";
                      const lessonUrl = lesson.slug?.current
                        ? `/lesson/${lesson.slug.current}`
                        : `/courses/${courseSlug}`;

                      return (
                        <Link
                          key={lesson._id || lessonIdx}
                          href={lessonUrl}
                          onClick={() => handleLessonClick(lesson, modIdx, lessonIdx)}
                          className="relative flex items-center justify-between group cursor-pointer text-xs"
                        >
                          {/* Timeline Dot */}
                          <span
                            className={`absolute -left-[24px] top-1.5 w-2 h-2 rounded-full transition-colors ${
                              isActiveLesson
                                ? "bg-[#EA580C] ring-4 ring-[#FFEDD5]"
                                : "border border-neutral-300 bg-white group-hover:border-neutral-400"
                            }`}
                          />

                          <div className="min-w-0 flex-1 pr-2">
                            <span
                              className={`block truncate ${
                                isActiveLesson
                                  ? "font-bold text-neutral-900"
                                  : "text-neutral-700 group-hover:text-neutral-900 font-normal"
                              }`}
                            >
                              {lesson.title}
                            </span>

                            {isActiveLesson ? (
                              <span className="text-[11px] text-[#EA580C] font-semibold block mt-0.5">
                                Now playing
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-400 font-normal block mt-0.5">
                                {lessonDuration}
                              </span>
                            )}
                          </div>

                          {/* Active Play Icon on right */}
                          {isActiveLesson && (
                            <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <PlayFilledIcon size={10} className="ml-0.5" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
