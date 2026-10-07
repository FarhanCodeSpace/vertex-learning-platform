"use client";

import React, { useState } from "react";
import posthog from "posthog-js";

interface LessonTabsProps {
  contentView: React.ReactNode;
  notesView: React.ReactNode;
  lessonSlug: string;
}

export function LessonTabs({ contentView, notesView, lessonSlug }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  const handleTabChange = (tab: "content" | "notes") => {
    setActiveTab(tab);
    posthog.capture("lesson_tab_switched", {
      lesson_slug: lessonSlug,
      tab,
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Tabs Header */}
      <div className="border-b border-neutral-200/80">
        <div className="flex items-center gap-8 -mb-px">
          <button
            type="button"
            onClick={() => handleTabChange("content")}
            className={`py-3.5 text-base font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === "content"
                ? "border-[#EA580C] text-[#EA580C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Lesson Content
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("notes")}
            className={`py-3.5 text-base font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === "notes"
                ? "border-[#EA580C] text-[#EA580C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "content" ? contentView : notesView}
      </div>
    </div>
  );
}
