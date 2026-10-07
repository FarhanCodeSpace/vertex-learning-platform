"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { VideoResultCard } from "@/components/search/video-result-card";
import { LessonResultCard } from "@/components/search/lesson-result-card";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import type { SearchResponse } from "@/sanity/lib/search";

interface SearchResultsClientProps {
  initialData: SearchResponse;
  initialQuery: string;
  initialSort: "relevant" | "duration" | "course";
}

export function SearchResultsClient({
  initialData,
  initialQuery,
  initialSort = "relevant",
}: SearchResultsClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<"relevant" | "duration" | "course">(initialSort);
  const [data, setData] = useState<SearchResponse>(initialData);

  // Support ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("search-page-input");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track search performance in PostHog
  useEffect(() => {
    if (initialQuery) {
      posthog.capture("search_performed", {
        query: initialQuery,
        total_results: data.totalResults,
        courses_count: data.coursesCount,
      });
    }
  }, [initialQuery, data.totalResults, data.coursesCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(q)}&sort=${sort}`);
      });
    } else {
      startTransition(() => {
        router.push("/courses");
      });
    }
  };

  const handleSortChange = (newSort: "relevant" | "duration" | "course") => {
    setSort(newSort);
    const sortedResults = [...data.results];

    if (newSort === "duration") {
      sortedResults.sort((a, b) => b.duration - a.duration);
    } else if (newSort === "course") {
      sortedResults.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    } else {
      sortedResults.sort((a, b) => b.score - a.score);
    }

    setData((prev) => ({ ...prev, results: sortedResults }));

    const currentQ = query.trim() || initialQuery;
    if (currentQ) {
      router.replace(`/search?q=${encodeURIComponent(currentQ)}&sort=${newSort}`);
    }
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {/* Search Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF5F0] border border-[#FED7AA]/80 text-[#EA580C] font-semibold text-[11px] tracking-[0.16em] uppercase shadow-2xs select-none">
          SEARCH RESULTS
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-900 leading-tight">
          Results for{" "}
          <span className="text-[#EA580C]">
            “{initialQuery || "all"}”
          </span>
        </h1>

        <p className="text-neutral-500 text-sm sm:text-base font-normal">
          Found {data.totalResults} results across {data.coursesCount} courses
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto pt-2">
          <div className="group relative w-full flex items-center gap-3.5 px-5 py-4 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:border-neutral-300 focus-within:border-[#F97316] focus-within:ring-3 focus-within:ring-[#F97316]/15 transition-all">
            <SearchIcon
              size={20}
              className="text-neutral-400 group-focus-within:text-[#F97316] shrink-0 transition-colors"
            />
            <input
              id="search-page-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, video timestamps, topics..."
              className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-lg border border-neutral-200/90 bg-neutral-50/80 text-xs font-mono text-neutral-500 select-none">
              ⌘ K
            </div>
          </div>
        </form>
      </div>

      {/* Results Metadata Bar & Sort Selector */}
      {data.totalResults > 0 && (
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
          <div className="text-sm font-semibold text-neutral-900">
            {data.totalResults} results
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="search-sort-select" className="sr-only">Sort Results</label>
            <select
              id="search-sort-select"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as "relevant" | "duration" | "course")}
              className="appearance-none bg-white border border-neutral-200/90 hover:border-neutral-300 text-neutral-800 text-sm font-medium rounded-xl pl-4 pr-9 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 cursor-pointer transition-all"
            >
              <option value="relevant">Most Relevant</option>
              <option value="duration">Duration</option>
              <option value="course">Course</option>
            </select>
            <ChevronDownIcon size={16} className="absolute right-3 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Results List */}
      {data.totalResults > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {data.results.map((result) => {
            if (result.type === "video") {
              return (
                <VideoResultCard
                  key={result.id}
                  result={result}
                  query={initialQuery}
                />
              );
            }
            return (
              <LessonResultCard
                key={result.id}
                result={result}
                query={initialQuery}
              />
            );
          })}
        </div>
      ) : (
        <SearchEmptyState query={initialQuery} isZeroResults={true} />
      )}

      {/* Bottom Catalog Callout Banner */}
      {data.totalResults > 0 && <SearchEmptyState query={initialQuery} isZeroResults={false} />}
    </div>
  );
}
