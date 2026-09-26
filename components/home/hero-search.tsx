"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { SearchIcon } from "@/components/ui/icons";

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Support ⌘K keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("hero-search-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedQuery = searchQuery.trim();

    posthog.capture("course_search_submitted", {
      has_query: normalizedQuery.length > 0,
      query_length: normalizedQuery.length,
      source: "homepage_hero",
    });

    if (normalizedQuery) {
      router.push(`/courses?q=${encodeURIComponent(normalizedQuery)}`);
    } else {
      router.push("/courses");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* CTA Button */}
      <button
        type="button"
        onClick={() => {
          const coursesSection = document.getElementById("all-courses-section");
          if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: "smooth" });
          } else {
            router.push("/courses");
          }
        }}
        className="mt-8 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-medium text-sm shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer group"
      >
        <span>Explore Courses</span>
        <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </button>

      {/* Search Bar Input */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mt-12">
        <div className="group relative w-full flex items-center gap-3.5 px-5 py-4 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:border-neutral-300 focus-within:border-[#F97316] focus-within:ring-3 focus-within:ring-[#F97316]/15 transition-all">
          <SearchIcon
            size={20}
            className="text-neutral-400 group-focus-within:text-[#F97316] shrink-0 transition-colors"
          />
          <input
            id="hero-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything about your learning..."
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-lg border border-neutral-200/90 bg-neutral-50/80 text-xs font-mono text-neutral-500 select-none">
            ⌘ K
          </div>
        </div>
      </form>
    </div>
  );
}
