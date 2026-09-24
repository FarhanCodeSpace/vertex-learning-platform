import React from "react";
import type { Metadata } from "next";
import { getCourses, getCategories } from "@/sanity/lib/api";
import { SiteHeader } from "@/components/ui/site-header";
import { Breadcrumbs } from "@/components/ui/navigation";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { CoursesCatalogClient } from "@/components/courses/courses-catalog-client";

export const metadata: Metadata = {
  title: "All Courses | Vertex",
  description: "Browse all available interactive courses on Vertex with intelligent search and video intelligence.",
  openGraph: {
    title: "All Courses | Vertex",
    description: "Explore all production-ready courses curated by industry experts.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function AllCoursesPage() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A]">
      {/* Top Header */}
      <SiteHeader activeNav="Courses" />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-20 space-y-8 sm:space-y-10">
        {/* Breadcrumbs */}
        <div>
          <Breadcrumbs
            items={[
              { label: "All Courses" },
            ]}
          />
        </div>

        {/* Page Title & Subtitle */}
        <div className="space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF5F0] border border-[#FED7AA]/80 text-[#C2410C] font-semibold text-[11px] tracking-[0.16em] uppercase shadow-2xs select-none">
            CATALOG
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-900">
            All Courses
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Explore comprehensive courses built for engineers. Filter by category or search for specific technologies.
          </p>
        </div>

        {/* Catalog Client (Filter & Grid) */}
        <CoursesCatalogClient
          initialCourses={courses}
          categories={categories}
        />
      </main>

      {/* Ambient background glow */}
      <AmbientGlow />
    </div>
  );
}
