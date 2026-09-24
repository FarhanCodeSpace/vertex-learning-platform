import React from "react";
import Link from "next/link";
import { getCourses } from "@/sanity/lib/api";
import { StarIcon } from "@/components/ui/icons";
import { SiteHeader } from "@/components/ui/site-header";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { HeroSearch } from "@/components/home/hero-search";
import { CourseCardItem } from "@/components/course/course-card-item";

export const revalidate = 60;

export default async function VertexHomePage() {
  const allCourses = await getCourses();
  // Display the top 6 courses on the homepage
  const featuredCourses = allCourses.slice(0, 6);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A]">
      {/* Top Header */}
      <SiteHeader activeNav="Courses" />

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-12 sm:pt-16 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Tag / Category Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-[#FFF5F0] border border-[#FED7AA]/80 text-[#C2410C] font-semibold text-[11px] tracking-[0.16em] uppercase shadow-2xs mb-8 select-none">
            INTELLIGENT LEARNING
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-bold text-5xl sm:text-6xl md:text-[68px] leading-[1.12] tracking-[-0.02em] text-neutral-900 max-w-3xl">
            Search your learning
            <br />
            in plain English.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-neutral-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Vertex understands what you want to learn and
            <br className="hidden sm:inline" /> finds the exact lessons across all your courses.
          </p>

          {/* Interactive Search & Explore Component */}
          <HeroSearch />
        </div>

        {/* =========================================================================
            ALL COURSES SECTION (LIVE FROM SANITY)
           ========================================================================= */}
        <section
          id="all-courses-section"
          className="w-full max-w-[1440px] mx-auto mt-24 sm:mt-28"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
              All Courses
            </h2>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors group cursor-pointer"
            >
              <span>View all {allCourses.length} courses</span>
              <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCardItem key={course._id} course={course} />
            ))}
          </div>

          {/* Star Divider Note */}
          <div className="mt-16 flex items-center justify-center gap-4 max-w-3xl mx-auto w-full px-4">
            <div className="h-[1px] flex-1 bg-neutral-200/90" />
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 shrink-0">
              <StarIcon size={18} className="text-[#F97316]" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="h-[1px] flex-1 bg-neutral-200/90" />
          </div>
        </section>
      </main>

      {/* Ambient background glow */}
      <AmbientGlow />
    </div>
  );
}
