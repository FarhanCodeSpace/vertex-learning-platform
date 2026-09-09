import React from "react";
import { Badge } from "./badge";
import {
  ChartIcon,
  ClockIcon,
  DocumentIcon,
  ExternalLinkIcon,
} from "./icons";

// Course Card
export interface CourseCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  level?: string;
  duration?: string;
  modulesCount?: number | string;
  className?: string;
}

export function CourseCard({
  icon = (
    <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
      N
    </div>
  ),
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  modulesCount = "12 modules",
  className = "",
}: CourseCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-7 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-200 ${className}`}
    >
      <div>
        <div className="mb-5">{icon}</div>
        <h3 className="font-serif font-bold text-xl text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>
        <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <ChartIcon size={14} className="text-neutral-400" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={14} className="text-neutral-400" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DocumentIcon size={14} className="text-neutral-400" />
          <span>{typeof modulesCount === "number" ? `${modulesCount} modules` : modulesCount}</span>
        </div>
      </div>
    </div>
  );
}

// Lesson Card (Video)
export interface LessonVideoCardProps {
  title: string;
  description: string;
  lessonLabel?: string;
  timestamp?: string;
  onWatchClick?: () => void;
  className?: string;
}

export function LessonVideoCard({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonLabel = "Lesson 5.1",
  timestamp = "12:45",
  onWatchClick,
  className = "",
}: LessonVideoCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        <div className="mb-3">
          <Badge variant="video">VIDEO</Badge>
        </div>
        <h3 className="font-sans font-semibold text-lg text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="font-medium">
          {lessonLabel} • {timestamp}
        </span>
        <button
          onClick={onWatchClick}
          className="inline-flex items-center gap-1.5 font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <span className="text-[10px]">▶</span>
          <span>Watch from {timestamp}</span>
        </button>
      </div>
    </div>
  );
}

// Lesson Card (Lesson)
export interface LessonCardProps {
  title: string;
  description: string;
  moduleLabel?: string;
  onViewClick?: () => void;
  className?: string;
}

export function LessonCard({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  onViewClick,
  className = "",
}: LessonCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        <div className="mb-3">
          <Badge variant="lesson">LESSON</Badge>
        </div>
        <h3 className="font-sans font-semibold text-lg text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="font-medium">{moduleLabel}</span>
        <button
          onClick={onViewClick}
          className="inline-flex items-center gap-1 font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <span>View lesson</span>
          <span className="text-xs">↗</span>
        </button>
      </div>
    </div>
  );
}

// Resource Card
export interface ResourceCardProps {
  title: string;
  description: string;
  fileType?: string;
  fileSize?: string;
  onDownloadClick?: () => void;
  className?: string;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  description = "Deep dive into Next.js caching strategies.",
  fileType = "PDF",
  fileSize = "1.2 MB",
  onDownloadClick,
  className = "",
}: ResourceCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center mb-4">
          <DocumentIcon size={20} />
        </div>
        <h3 className="font-sans font-semibold text-lg text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="font-medium">
          {fileType} • {fileSize}
        </span>
        <button
          onClick={onDownloadClick}
          className="text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
          aria-label="Download or open resource"
        >
          <ExternalLinkIcon size={16} />
        </button>
      </div>
    </div>
  );
}
