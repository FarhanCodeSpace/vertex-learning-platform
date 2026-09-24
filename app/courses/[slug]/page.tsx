import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug, getAllCourseSlugs } from "@/sanity/lib/api";
import { calculateCourseDuration } from "@/lib/format";
import { SiteHeader } from "@/components/ui/site-header";
import { Breadcrumbs } from "@/components/ui/navigation";
import { CourseHero } from "@/components/course/course-hero";
import { CourseLearningOutcomes } from "@/components/course/course-learning-outcomes";
import { CourseContentAccordion } from "@/components/course/course-content-accordion";
import { CourseProgressBar } from "@/components/course/course-progress-bar";
import { AmbientGlow } from "@/components/ui/ambient-glow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllCourseSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("Failed to fetch course slugs for generateStaticParams:", err);
    return [];
  }
}

const SLUG_ALIASES: Record<string, string> = {
  "nextjs-for-production": "nextjs-app-router-in-depth",
  "docker-essentials": "devops-with-docker-and-kubernetes",
  "typescript-deep-dive": "typescript-for-application-developers",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = SLUG_ALIASES[slug] || slug;
  const course = await getCourseBySlug(targetSlug);

  if (!course) {
    return {
      title: "Course Not Found | Vertex",
      description: "The requested course could not be found on Vertex.",
    };
  }

  return {
    title: `${course.title} | Vertex`,
    description: course.summary || `Learn ${course.title} with structured modules and intelligent search on Vertex.`,
    openGraph: {
      title: `${course.title} | Vertex`,
      description: course.summary,
      type: "website",
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetSlug = SLUG_ALIASES[slug] || slug;
  const course = await getCourseBySlug(targetSlug);

  if (!course) {
    notFound();
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];
  const totalModulesCount = modules.length;
  const totalDuration = calculateCourseDuration(course.duration, modules);

  // Find the first lesson to direct learner to
  const firstLessonSlug =
    modules[0]?.lessons?.[0]?.slug?.current || null;

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A] pb-24 sm:pb-32">
      {/* Top Header */}
      <SiteHeader activeNav="Courses" />

      {/* Main Course Content Container */}
      <main className="relative z-10 flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-16 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
        <div className="w-full">
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "/" },
              { label: course.title },
            ]}
          />
        </div>

        {/* Hero Section */}
        <CourseHero
          course={course}
          firstLessonSlug={firstLessonSlug}
          totalDuration={totalDuration}
          totalModulesCount={totalModulesCount}
        />

        {/* What You'll Learn Section */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <CourseLearningOutcomes outcomes={course.learningOutcomes} />
        )}

        {/* Course Content Accordion Section */}
        <CourseContentAccordion
          modules={modules}
          totalModulesCount={totalModulesCount}
          totalDuration={totalDuration}
          courseSlug={course.slug.current}
        />
      </main>

      {/* Ambient background glow */}
      <AmbientGlow />

      {/* Sticky Bottom Progress Bar */}
      <CourseProgressBar
        percentage={35}
        firstLessonSlug={firstLessonSlug}
        courseSlug={course.slug.current}
      />
    </div>
  );
}
