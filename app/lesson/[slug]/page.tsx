import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonBySlug, getAllLessonSlugs } from "@/sanity/lib/api";
import { parseStartSeconds } from "@/lib/video";
import { SiteHeader } from "@/components/ui/site-header";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { LessonContentTab } from "@/components/lesson/lesson-content-tab";
import { LessonNotesTab } from "@/components/lesson/lesson-notes-tab";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { LessonFooterNav } from "@/components/lesson/lesson-footer-nav";
import type { PortableTextBlock } from "@portabletext/react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ t?: string; start?: string; startSeconds?: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllLessonSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("Failed to fetch lesson slugs for generateStaticParams:", err);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLessonBySlug(slug);

  if (!data || !data.lesson) {
    return {
      title: "Lesson Not Found | Vertex",
      description: "The requested lesson could not be found on Vertex.",
    };
  }

  const { lesson, course } = data;
  const courseTitle = course?.title ? ` - ${course.title}` : "";

  return {
    title: `${lesson.title}${courseTitle} | Vertex`,
    description: `Watch ${lesson.title} on Vertex. Learn with structured chapters, notes, and AI-powered video search.`,
    openGraph: {
      title: `${lesson.title} | Vertex`,
      description: `Watch ${lesson.title} on Vertex.`,
      type: "video.other",
    },
  };
}

/**
 * Helper to extract overview summary text from Portable Text notes
 */
function extractOverviewText(notes?: PortableTextBlock[]): string {
  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return "";
  }

  // Look for the first normal paragraph block
  for (const block of notes) {
    if (block._type === "block" && (!block.style || block.style === "normal")) {
      const text = Array.isArray(block.children)
        ? (block.children as Array<{ text?: string }>).map((c) => c.text || "").join("")
        : "";
      if (text.trim().length > 0) {
        return text.trim();
      }
    }
  }

  return "";
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const data = await getLessonBySlug(slug);

  if (!data || !data.lesson) {
    notFound();
  }

  const { lesson, course, currentModule, previousLesson, nextLesson } = data;

  const startSeconds = parseStartSeconds(
    resolvedSearchParams.t || resolvedSearchParams.start || resolvedSearchParams.startSeconds
  );

  const overviewText = extractOverviewText(lesson.notes);
  const courseSlug = course.slug?.current || "nextjs-app-router-in-depth";
  const courseTitle = course.title || "Next.js for Production";
  const moduleTitle = currentModule.title || "Course Module";
  const modules = Array.isArray(course.modules) ? course.modules : [];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#0F172A] pb-24 sm:pb-32">
      {/* Top Header */}
      <SiteHeader activeNav="Courses" />

      {/* Main Layout Container */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column: Course Sidebar */}
          <LessonSidebar
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            courseIcon={course.icon}
            modules={modules}
            currentModuleIndex={currentModule.moduleIndex}
            currentLessonSlug={lesson.slug.current}
            progressPercentage={35}
          />

          {/* Right Column: Lesson Player and Content */}
          <div className="flex-1 w-full min-w-0 space-y-8 sm:space-y-10">
            {/* Lesson Header (Breadcrumb, Title, Meta, Bookmark) */}
            <LessonHeader
              courseTitle={courseTitle}
              courseSlug={courseSlug}
              moduleTitle={moduleTitle}
              moduleIndex={currentModule.moduleIndex}
              lessonIndex={currentModule.lessonIndex}
              lessonTitle={lesson.title}
              lessonSlug={lesson.slug.current}
              summary={overviewText}
              duration={lesson.duration}
              level={course.level || "Intermediate"}
              studentCount={lesson.studentCount}
            />

            {/* Video Player */}
            <LessonPlayer
              videoUrl={lesson.videoUrl}
              poster={lesson.poster}
              title={lesson.title}
              lessonSlug={lesson.slug.current}
              courseSlug={courseSlug}
              startSeconds={startSeconds}
            />

            {/* Content & Notes Tabs */}
            <LessonTabs
              lessonSlug={lesson.slug.current}
              contentView={
                <LessonContentTab
                  overview={overviewText}
                  keyPoints={lesson.keyPoints}
                  proTip={lesson.proTip}
                  resources={lesson.resources}
                  lessonSlug={lesson.slug.current}
                />
              }
              notesView={<LessonNotesTab notes={lesson.notes} />}
            />

            {/* Bottom Lesson Navigation */}
            <LessonFooterNav
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              courseSlug={courseSlug}
            />
          </div>
        </div>
      </main>

      {/* Ambient background glow */}
      <AmbientGlow />
    </div>
  );
}
