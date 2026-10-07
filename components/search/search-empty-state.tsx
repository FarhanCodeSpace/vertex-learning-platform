"use client";

import React from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/ui/icons";

interface SearchEmptyStateProps {
  query?: string;
  isZeroResults?: boolean;
}

export function SearchEmptyState({ query = "", isZeroResults = false }: SearchEmptyStateProps) {
  if (isZeroResults) {
    return (
      <div className="w-full py-16 px-6 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF5F0] border border-[#FED7AA]/80 text-[#EA580C] flex items-center justify-center shadow-xs">
          <SearchIcon size={28} />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif font-bold text-2xl text-neutral-900">
            No matching results found
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            We couldn&apos;t find any video moments or lessons matching <span className="font-semibold text-neutral-900">&ldquo;{query}&rdquo;</span>. Try searching for broader concepts like <span className="text-[#EA580C] font-medium">data fetching</span>, <span className="text-[#EA580C] font-medium">caching</span>, <span className="text-[#EA580C] font-medium">routing</span>, or <span className="text-[#EA580C] font-medium">hooks</span>.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-medium text-sm shadow-xs hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F5] rounded-2xl border border-[#FED7AA]/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 mt-10">
      <div className="flex items-center gap-4 text-center sm:text-left flex-1">
        <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-2xs">
          <SearchIcon size={22} />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 text-base">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>

      <Link
        href="/courses"
        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-900 text-sm font-medium shadow-2xs hover:border-neutral-300 transition-all cursor-pointer"
      >
        <span>Browse all courses</span>
        <span className="text-[#EA580C]">→</span>
      </Link>
    </div>
  );
}
