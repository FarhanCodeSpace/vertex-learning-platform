"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VertexLogo,
  BellIcon,
  SearchIcon,
  StarIcon,
  NextJsLogo,
  DockerLogo,
  TypeScriptLogo,
  ChartIcon,
  ClockIcon,
  DocumentIcon,
} from "@/components/ui/icons";

export default function VertexHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Courses");

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

  const courses = [
    {
      id: "nextjs-for-production",
      title: "Next.js for Production",
      description: "Build scalable, high-performance web applications with Next.js.",
      level: "Intermediate",
      duration: "18h 24m",
      modules: "12 modules",
      icon: <NextJsLogo className="w-14 h-14" />,
    },
    {
      id: "docker-essentials",
      title: "Docker Essentials",
      description: "Containerize applications and streamline your development workflow.",
      level: "Beginner",
      duration: "10h 12m",
      modules: "8 modules",
      icon: <DockerLogo className="w-14 h-14" />,
    },
    {
      id: "typescript-deep-dive",
      title: "TypeScript Deep Dive",
      description: "Go beyond the basics and write safer, more expressive code.",
      level: "Intermediate",
      duration: "14h 36m",
      modules: "10 modules",
      icon: <TypeScriptLogo className="w-14 h-14" />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A]">
      {/* Background subtle texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 24px)`,
        }}
      />

      {/* =========================================================================
          TOP NAVIGATION HEADER
         ========================================================================= */}
      <header className="relative z-10 w-full border-b border-transparent">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          {/* Left: Brand & Nav Links */}
          <div className="flex items-center gap-10 sm:gap-14">
            <Link href="/" className="flex items-center gap-2.5 group">
              <VertexLogo className="w-7 h-7 group-hover:scale-105 transition-transform" />
              <span className="font-serif font-bold text-2xl tracking-tight text-neutral-900">
                Vertex
              </span>
            </Link>

            <nav className="flex items-center gap-8 text-sm font-medium">
              <button
                onClick={() => setActiveNav("Courses")}
                className={`transition-colors cursor-pointer ${
                  activeNav === "Courses"
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveNav("My Learning")}
                className={`transition-colors cursor-pointer ${
                  activeNav === "My Learning"
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                My Learning
              </button>
            </nav>
          </div>

          {/* Right: Notifications & Profile Avatar */}
          <div className="flex items-center gap-5 sm:gap-6">
            <button
              aria-label="Notifications"
              className="text-neutral-700 hover:text-neutral-900 hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
            >
              <BellIcon size={20} />
            </button>

            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-200/80 shadow-xs cursor-pointer hover:ring-[#F97316]/50 transition-all">
              <Image
                src="/avatar.jpg"
                alt="User Profile"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
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

          {/* CTA Button */}
          <button
            onClick={() => {
              const coursesSection = document.getElementById("all-courses-section");
              coursesSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-medium text-sm shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>Explore Courses</span>
            <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>

          {/* Search Bar Input */}
          <div className="w-full max-w-2xl mt-12">
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
          </div>
        </div>

        {/* =========================================================================
            ALL COURSES SECTION
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
            <button
              onClick={() => setActiveNav("Courses")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors group cursor-pointer"
            >
              <span>View all courses</span>
              <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between p-8 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="mb-6">{course.icon}</div>
                  <h3 className="font-serif font-bold text-xl text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-10 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <ChartIcon size={14} className="text-neutral-400" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-neutral-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DocumentIcon size={14} className="text-neutral-400" />
                    <span>{course.modules}</span>
                  </div>
                </div>
              </div>
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

      {/* =========================================================================
          BOTTOM AMBIENT GLOW BARS GRAPHIC
         ========================================================================= */}
      <div className="relative w-full overflow-hidden pointer-events-none h-40 sm:h-52 z-0 mt-auto">
        {/* Render columns of rising warm gradient pillars */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-6 w-full max-w-[1440px] mx-auto opacity-70">
          {[
            { height: "45%", opacity: "from-[#F97316]/30" },
            { height: "65%", opacity: "from-[#FB923C]/40" },
            { height: "85%", opacity: "from-[#F97316]/50" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "90%", opacity: "from-[#F97316]/50" },
            { height: "70%", opacity: "from-[#FB923C]/45" },
            { height: "55%", opacity: "from-[#FED7AA]/50" },
            { height: "40%", opacity: "from-[#FED7AA]/35" },
            { height: "60%", opacity: "from-[#FB923C]/45" },
            { height: "80%", opacity: "from-[#F97316]/55" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "85%", opacity: "from-[#F97316]/50" },
            { height: "70%", opacity: "from-[#FB923C]/40" },
            { height: "50%", opacity: "from-[#FED7AA]/40" },
            { height: "65%", opacity: "from-[#F97316]/45" },
            { height: "85%", opacity: "from-[#FB923C]/50" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "90%", opacity: "from-[#F97316]/50" },
            { height: "60%", opacity: "from-[#FB923C]/40" },
            { height: "45%", opacity: "from-[#FED7AA]/35" },
          ].map((bar, index) => (
            <div
              key={index}
              style={{ height: bar.height }}
              className={`flex-1 min-w-[20px] max-w-[70px] bg-gradient-to-t ${bar.opacity} via-[#FED7AA]/25 to-transparent rounded-t-lg backdrop-blur-xs`}
            />
          ))}
        </div>
        {/* Soft bottom edge blend */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F97316]/25 to-transparent" />
      </div>
    </div>
  );
}
