"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, PlayIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { calculateModuleDuration, formatDuration } from "@/lib/format";
import type { Lesson } from "@/sanity/types";

interface CourseModule {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: Lesson[];
}

interface CourseContentAccordionProps {
  modules: CourseModule[];
  totalModulesCount: number;
  totalDuration: string;
  courseSlug: string;
}

export function CourseContentAccordion({
  modules,
  totalModulesCount,
  totalDuration,
  courseSlug,
}: CourseContentAccordionProps) {
  // By default, open the first module or keep closed
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [showAllModules, setShowAllModules] = useState(false);

  const initialVisibleCount = 6;
  const hasMoreModules = modules.length > initialVisibleCount;
  const visibleModules = showAllModules || !hasMoreModules
    ? modules
    : modules.slice(0, initialVisibleCount);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
          Course Content
        </h2>
        <div className="text-xs sm:text-sm text-neutral-500 font-medium">
          <span>{totalModulesCount} modules</span>
          <span className="mx-2">•</span>
          <span>{totalDuration}</span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {visibleModules.map((module, modIdx) => {
          const isExpanded = !!expandedModules[modIdx];
          const moduleDuration = calculateModuleDuration(module.lessons);
          const lessonsList = Array.isArray(module.lessons) ? module.lessons : [];

          return (
            <div
              key={module._key || modIdx}
              className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:border-neutral-300 transition-all duration-200"
            >
              {/* Module Header Row */}
              <button
                type="button"
                onClick={() => toggleModule(modIdx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 cursor-pointer select-none group"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Module Number Circle */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-semibold text-neutral-800 shrink-0 group-hover:bg-[#FFF5F0] group-hover:text-[#EA580C] transition-colors">
                    {modIdx + 1}
                  </div>

                  {/* Module Title & Summary */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-semibold text-base sm:text-lg text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors truncate sm:whitespace-normal">
                      {module.title}
                    </h3>
                    {module.summary && (
                      <p className="mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {module.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration & Chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                    {moduleDuration}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-neutral-700 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-neutral-900" : ""
                    }`}
                  >
                    <ChevronDownIcon size={18} />
                  </div>
                </div>
              </button>

              {/* Collapsible Lessons List */}
              {isExpanded && (
                <div className="border-t border-neutral-100 bg-[#FAFAFC]/60 px-5 sm:px-6 py-4 space-y-2">
                  {lessonsList.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-2 italic">
                      No lessons listed in this module yet.
                    </p>
                  ) : (
                    lessonsList.map((lesson, lessonIdx) => {
                      const lessonDuration = formatDuration(lesson.duration);
                      const lessonUrl = lesson.slug?.current
                        ? `/lesson/${lesson.slug.current}`
                        : `/courses/${courseSlug}`;

                      return (
                        <Link
                          key={lesson._id || lessonIdx}
                          href={lessonUrl}
                          className="group/lesson flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200/80 transition-all text-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-500 group-hover/lesson:bg-[#FFF5F0] group-hover/lesson:text-[#EA580C] flex items-center justify-center shrink-0 transition-colors">
                              <PlayIcon size={12} className="ml-0.5" />
                            </div>
                            <span className="font-medium text-xs sm:text-sm text-neutral-700 group-hover/lesson:text-neutral-900 truncate">
                              <span className="text-neutral-400 mr-2">
                                {modIdx + 1}.{lessonIdx + 1}
                              </span>
                              {lesson.title}
                            </span>
                            {lesson.freePreview && (
                              <Badge variant="video" className="text-[10px] py-0 px-2">
                                FREE PREVIEW
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs text-neutral-400 group-hover/lesson:text-[#F97316]">
                            <span>{lessonDuration}</span>
                            <span className="text-xs">→</span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show all modules toggle button */}
      {hasMoreModules && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllModules((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
          >
            <span>
              {showAllModules
                ? "Show fewer modules"
                : `Show all ${modules.length} modules`}
            </span>
            <ChevronDownIcon
              size={16}
              className={`text-neutral-500 transition-transform duration-200 ${
                showAllModules ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </section>
  );
}
