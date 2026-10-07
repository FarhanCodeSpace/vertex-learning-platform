"use client";

import React from "react";
import posthog from "posthog-js";
import {
  CheckCircleIcon,
  LightbulbIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  CodeIcon,
} from "@/components/ui/icons";
import type { Resource } from "@/sanity/types";

interface LessonContentTabProps {
  overview?: string;
  keyPoints?: string[];
  proTip?: string;
  resources?: Resource[];
  lessonSlug: string;
}

export function LessonContentTab({
  overview,
  keyPoints = [],
  proTip,
  resources = [],
  lessonSlug,
}: LessonContentTabProps) {
  const getResourceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("github") || t.includes("repo")) {
      return <GithubIcon size={18} className="text-neutral-800" />;
    }
    if (t.includes("code")) {
      return <CodeIcon size={18} className="text-[#EA580C]" />;
    }
    return <FileTextIcon size={18} className="text-[#EA580C]" />;
  };

  const handleResourceClick = (res: Resource, index: number) => {
    posthog.capture("lesson_resource_clicked", {
      lesson_slug: lessonSlug,
      resource_title: res.title,
      resource_url: res.url,
      resource_type: res.type,
      resource_index: index,
    });
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Overview Section */}
      {overview && (
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Overview
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-4xl">
            {overview}
          </p>
        </section>
      )}

      {/* In this lesson you will Section */}
      {keyPoints.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-sans font-bold text-base sm:text-lg text-neutral-900">
            In this lesson you will:
          </h3>
          <ul className="space-y-3.5 max-w-3xl">
            {keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-neutral-700 leading-relaxed text-sm sm:text-base">
                <span className="shrink-0 mt-0.5 text-[#EA580C]">
                  <CheckCircleIcon size={19} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pro Tip Callout Card */}
      {proTip && (
        <div className="bg-[#FFF8F5] border border-[#FED7AA]/60 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
            <LightbulbIcon size={22} />
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="font-sans font-bold text-sm sm:text-base text-neutral-900">
              Pro Tip
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {proTip}
            </p>
          </div>
        </div>
      )}

      {/* Resources Section */}
      {resources.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="font-serif font-bold text-2xl text-neutral-900 tracking-tight">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((res, idx) => (
              <a
                key={res._key || idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleResourceClick(res, idx)}
                className="group relative bg-[#FFFDFB] border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEDD5]/80 flex items-center justify-center shrink-0">
                    {getResourceIcon(res.type || "link")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-neutral-900 leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-2">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="mt-1 text-[11px] sm:text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="text-neutral-400 group-hover:text-[#EA580C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ExternalLinkIcon size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
