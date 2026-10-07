import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/ui/site-header";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { SearchResultsClient } from "@/components/search/search-results-client";
import { searchContent } from "@/sanity/lib/search";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    query?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q || params.query || "";
  return {
    title: q ? `Results for “${q}” | Vertex Search` : "Search Courses & Lessons | Vertex",
    description: `Intelligent video timestamp and lesson search for "${q}" across Vertex engineering courses.`,
  };
}

export const revalidate = 0; // Dynamic search

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = (params.q || params.query || "data fetching").trim();
  const sort = (params.sort || "relevant") as "relevant" | "duration" | "course";

  const searchData = await searchContent(q, sort);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A]">
      {/* Top Header */}
      <SiteHeader activeNav="Courses" />

      {/* Main Search Container */}
      <main className="relative z-10 flex-1 max-w-[1000px] w-full mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <Suspense fallback={<div className="py-20 text-center text-neutral-400">Loading search results...</div>}>
          <SearchResultsClient
            initialData={searchData}
            initialQuery={q}
            initialSort={sort}
          />
        </Suspense>
      </main>

      {/* Background Glow */}
      <AmbientGlow />
    </div>
  );
}
