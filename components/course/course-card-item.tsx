import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChartIcon,
  ClockIcon,
  DocumentIcon,
  NextJsLogo,
  DockerLogo,
  TypeScriptLogo,
  OutcomeDatabaseIcon,
  OutcomeShieldIcon,
  OutcomeLayersIcon,
  OutcomeSparklesIcon,
} from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import { capitalize, formatDuration } from "@/lib/format";
import type { CourseCardSummary } from "@/sanity/types";

interface CourseCardItemProps {
  course: CourseCardSummary;
  className?: string;
}

export function renderCourseIcon(course: CourseCardSummary) {
  const iconStr = (course.icon || "").toLowerCase();
  const titleStr = course.title.toLowerCase();

  if (iconStr.includes("next") || titleStr.includes("next.js") || titleStr.includes("app router")) {
    return <NextJsLogo className="w-14 h-14" />;
  }

  if (iconStr.includes("docker") || titleStr.includes("docker") || titleStr.includes("devops") || titleStr.includes("kubernetes")) {
    return <DockerLogo className="w-14 h-14" />;
  }

  if (iconStr.includes("typescript") || titleStr.includes("typescript")) {
    return <TypeScriptLogo className="w-14 h-14" />;
  }

  if (iconStr.includes("react") || titleStr.includes("react")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center p-2.5 shadow-xs">
        <svg viewBox="0 0 115 102" fill="none" className="w-full h-full text-[#61DAFB]">
          <ellipse cx="57.5" cy="51" rx="55" ry="20" stroke="currentColor" strokeWidth="6" />
          <ellipse cx="57.5" cy="51" rx="55" ry="20" transform="rotate(60 57.5 51)" stroke="currentColor" strokeWidth="6" />
          <ellipse cx="57.5" cy="51" rx="55" ry="20" transform="rotate(120 57.5 51)" stroke="currentColor" strokeWidth="6" />
          <circle cx="57.5" cy="51" r="9" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (iconStr.includes("python") || titleStr.includes("python") || titleStr.includes("data work")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-[#1E293B] flex items-center justify-center p-2.5 shadow-xs">
        <svg viewBox="0 0 110 110" fill="none" className="w-full h-full">
          <path
            d="M54.2 8C30.2 8 31.7 18.4 31.7 18.4L31.8 29.1H54.6V32.4H22.7C13.4 32.4 8 37.8 8 51.5C8 65.2 16.1 66.2 16.1 66.2H24.3V54.7C24.3 41.5 35.5 41.8 35.5 41.8H58.1C68.3 41.8 69.4 32.8 69.4 32.8V18.8C69.4 8.7 54.2 8 54.2 8ZM41.4 15.6C44 15.6 46.1 17.7 46.1 20.3C46.1 22.9 44 25 41.4 25C38.8 25 36.7 22.9 36.7 20.3C36.7 17.7 38.8 15.6 41.4 15.6Z"
            fill="#387EB8"
          />
          <path
            d="M55.8 102C79.8 102 78.3 91.6 78.3 91.6L78.2 80.9H55.4V77.6H87.3C96.6 77.6 102 72.2 102 58.5C102 44.8 93.9 43.8 93.9 43.8H85.7V55.3C85.7 68.5 74.5 68.2 74.5 68.2H51.9C41.7 68.2 40.6 77.2 40.6 77.2V91.2C40.6 101.3 55.8 102 55.8 102ZM68.6 94.4C66 94.4 63.9 92.3 63.9 89.7C63.9 87.1 66 85 68.6 85C71.2 85 73.3 87.1 73.3 89.7C73.3 92.3 71.2 94.4 68.6 94.4Z"
            fill="#FFE873"
          />
        </svg>
      </div>
    );
  }

  if (iconStr.includes("postgres") || titleStr.includes("postgres") || titleStr.includes("sql")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-[#336791] text-white flex items-center justify-center p-2.5 shadow-xs">
        <OutcomeDatabaseIcon size={32} className="text-white" />
      </div>
    );
  }

  if (iconStr.includes("ai") || iconStr.includes("llm") || titleStr.includes("ai") || titleStr.includes("llm") || titleStr.includes("rag")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] text-white flex items-center justify-center p-2.5 shadow-xs">
        <OutcomeSparklesIcon size={30} className="text-white" />
      </div>
    );
  }

  if (iconStr.includes("security") || titleStr.includes("security")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-neutral-700 text-[#F97316] flex items-center justify-center p-2.5 shadow-xs">
        <OutcomeShieldIcon size={30} className="text-[#F97316]" />
      </div>
    );
  }

  if (iconStr.includes("system") || titleStr.includes("system design") || titleStr.includes("architecture")) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-[#1E293B] text-[#FB923C] flex items-center justify-center p-2.5 shadow-xs">
        <OutcomeLayersIcon size={30} className="text-[#FB923C]" />
      </div>
    );
  }

  if (course.coverImage?.asset?._ref) {
    return (
      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs border border-neutral-200">
        <Image
          src={urlFor(course.coverImage).width(120).height(120).url()}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  // Fallback initial brand icon
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex items-center justify-center font-serif font-bold text-2xl shadow-xs">
      {course.title.charAt(0)}
    </div>
  );
}

export function CourseCardItem({ course, className = "" }: CourseCardItemProps) {
  const durationText = formatDuration(course.duration) || "18h 24m";
  const modulesCount = course.moduleCount || 0;
  const levelText = capitalize(course.level || "Intermediate");

  return (
    <Link
      href={`/courses/${course.slug.current}`}
      className={`group relative flex flex-col justify-between p-8 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-200 cursor-pointer ${className}`}
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>{renderCourseIcon(course)}</div>
          {course.popular && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFF5F0] border border-[#FED7AA]/60 text-[#C2410C] font-semibold text-[10px] tracking-[0.14em] uppercase">
              POPULAR
            </span>
          )}
        </div>

        <h3 className="font-serif font-bold text-xl text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
          {course.title}
        </h3>

        <p className="mt-3 text-sm text-neutral-600 leading-relaxed line-clamp-2">
          {course.summary}
        </p>
      </div>

      <div className="mt-10 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <ChartIcon size={14} className="text-neutral-400" />
          <span>{levelText}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={14} className="text-neutral-400" />
          <span>{durationText}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DocumentIcon size={14} className="text-neutral-400" />
          <span>{modulesCount} modules</span>
        </div>
      </div>
    </Link>
  );
}
