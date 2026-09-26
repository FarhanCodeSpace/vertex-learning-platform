"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { SearchIcon, StarIcon } from "@/components/ui/icons";
import { CourseCardItem } from "@/components/course/course-card-item";
import type { CourseCardSummary, Category } from "@/sanity/types";

interface CoursesCatalogClientProps {
  initialCourses: CourseCardSummary[];
  categories: Category[];
}

function SearchParamsSync({ onSearchChange }: { onSearchChange: (q: string) => void }) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      onSearchChange(q);
    }
  }, [searchParams, onSearchChange]);
  return null;
}

export function CoursesCatalogClient({
  initialCourses,
  categories,
}: CoursesCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    posthog.capture("course_category_selected", {
      category_slug: categorySlug,
      source: "course_catalog",
    });
  };

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        course.category?.slug?.current === selectedCategory ||
        course.category?.title?.toLowerCase() === selectedCategory.toLowerCase();

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.summary?.toLowerCase().includes(query) ||
        course.category?.title?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialCourses, selectedCategory, searchQuery]);

  return (
    <div className="w-full space-y-10">
      <React.Suspense fallback={null}>
        <SearchParamsSync onSearchChange={setSearchQuery} />
      </React.Suspense>

      {/* Category Pills & Search Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-neutral-200/80 pb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => selectCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
            }`}
          >
            All Courses ({initialCourses.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug?.current;
            const count = cat.courseCount ?? initialCourses.filter(c => c.category?.slug?.current === cat.slug?.current).length;

            return (
              <button
                key={cat._id}
                onClick={() => selectCategory(cat.slug?.current || cat.title)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                }`}
              >
                {cat.title} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <SearchIcon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter courses..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-500 font-medium">
        <span>
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
          {selectedCategory !== "all" && ` in ${categories.find(c => c.slug?.current === selectedCategory)?.title || selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(selectedCategory !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-[#F97316] hover:text-[#EA580C] font-medium cursor-pointer transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-neutral-200/80 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
            <SearchIcon size={24} />
          </div>
          <h3 className="font-serif font-bold text-xl text-neutral-900">
            No courses found
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm">
            We couldn&apos;t find any courses matching your filter criteria. Try searching for a different keyword or category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white text-sm font-medium hover:brightness-105 transition-all cursor-pointer"
          >
            Show all courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCardItem key={course._id} course={course} />
          ))}
        </div>
      )}

      {/* Star Divider Note */}
      <div className="pt-12 flex items-center justify-center gap-4 max-w-3xl mx-auto w-full px-4">
        <div className="h-[1px] flex-1 bg-neutral-200/90" />
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 shrink-0">
          <StarIcon size={18} className="text-[#F97316]" />
          <span>New courses and lessons added every week.</span>
        </div>
        <div className="h-[1px] flex-1 bg-neutral-200/90" />
      </div>
    </div>
  );
}
