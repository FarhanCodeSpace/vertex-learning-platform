"use client";

import React, { useState } from "react";
import {
  VertexLogo,
  BellIcon,
  SearchIcon,
  PlayIcon,
  DocumentIcon,
  BookmarkIcon,
  ChartIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  BellFilledIcon,
  SearchFilledIcon,
  PlayFilledIcon,
  DocumentFilledIcon,
  BookmarkFilledIcon,
  ChartFilledIcon,
  ClockFilledIcon,
  UserFilledIcon,
  EyeIcon,
  GridIcon,
  TargetIcon,
  AccessibilityIcon,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  CourseCard,
  LessonVideoCard,
  LessonCard,
  ResourceCard,
} from "@/components/ui/cards";
import {
  NavigationBar,
  Breadcrumbs,
  Pagination,
} from "@/components/ui/navigation";

export default function DesignSystemPage() {
  const [activeNavTab, setActiveNavTab] = useState("Courses");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 py-12 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1400px] mx-auto space-y-16">
        {/* =========================================================================
            HEADER & 01 COLORS
           ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Brand & Introduction */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <VertexLogo className="w-8 h-8" />
              <span className="font-serif font-bold text-3xl tracking-tight text-neutral-900">
                Vertex
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif font-bold text-5xl tracking-tight text-neutral-900 leading-[1.15]">
                Design System
              </h1>
              <p className="font-sans text-base text-neutral-500 leading-relaxed max-w-sm">
                A unified design language for Vertex learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                VERSION 1.0 &bull; MAY 2025
              </span>
            </div>
          </div>

          {/* 01 COLORS */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">01</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                COLORS
              </h2>
            </div>

            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-700">Primary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Primary 500 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#F97316] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Primary 500</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#F97316</p>
                  </div>
                </div>
                {/* Primary 400 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FB923C] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Primary 400</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FB923C</p>
                  </div>
                </div>
                {/* Primary 300 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FDBA74] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Primary 300</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FDBA74</p>
                  </div>
                </div>
                {/* Primary 200 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FED7AA] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Primary 200</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FED7AA</p>
                  </div>
                </div>
                {/* Primary 100 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FFEEE5] border border-[#FED7AA]/40 shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Primary 100</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FFEEE5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-700">Neutral</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* Neutral 900 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#0F172A] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 900</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#0F172A</p>
                  </div>
                </div>
                {/* Neutral 700 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#334155] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 700</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#334155</p>
                  </div>
                </div>
                {/* Neutral 500 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#64748B] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 500</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#64748B</p>
                  </div>
                </div>
                {/* Neutral 300 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#CBD5E1] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 300</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#CBD5E1</p>
                  </div>
                </div>
                {/* Neutral 200 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#E2E8F0] shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 200</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#E2E8F0</p>
                  </div>
                </div>
                {/* Neutral 100 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#F1F5F9] border border-neutral-200 shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 100</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#F1F5F9</p>
                  </div>
                </div>
                {/* Neutral 50 */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FAFAFC] border border-neutral-200 shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Neutral 50</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FAFAFC</p>
                  </div>
                </div>
                {/* White */}
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FFFFFF] border border-neutral-200 shadow-xs" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">White</p>
                    <p className="text-[11px] text-neutral-500 font-mono">#FFFFFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            02 TYPOGRAPHY & 03 TYPE SCALE
           ========================================================================= */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 02 TYPOGRAPHY */}
            <div className="lg:col-span-4 space-y-8 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-neutral-100 pb-8 lg:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">02</span>
                <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                  TYPOGRAPHY
                </h2>
              </div>

              {/* Playfair Display */}
              <div className="flex items-start gap-6">
                <span className="font-serif text-6xl text-neutral-900 leading-none select-none">
                  Ag
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-xl text-neutral-900">
                    Playfair Display
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Elegant &bull; Readable &bull; Timeless
                  </p>
                </div>
              </div>

              {/* Inter */}
              <div className="flex items-start gap-6 pt-4">
                <span className="font-sans font-bold text-6xl text-neutral-900 leading-none select-none">
                  Ag
                </span>
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-xl text-neutral-900">
                    Inter
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Clean &bull; Modern &bull; Highly legible
                  </p>
                </div>
              </div>
            </div>

            {/* 03 TYPE SCALE */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">03</span>
                <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                  TYPE SCALE
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pr-4">Style</th>
                      <th className="pb-3 px-4">Font</th>
                      <th className="pb-3 px-4">Size / Line Height</th>
                      <th className="pb-3 px-4">Weight</th>
                      <th className="pb-3 pl-4">Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    <tr>
                      <td className="py-3.5 pr-4 font-serif font-bold text-2xl text-neutral-900">Display 1</td>
                      <td className="py-3.5 px-4 text-xs">Playfair Display</td>
                      <td className="py-3.5 px-4 text-xs font-mono">48 / 56</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Bold</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Page titles</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-serif font-bold text-xl text-neutral-900">Display 2</td>
                      <td className="py-3.5 px-4 text-xs">Playfair Display</td>
                      <td className="py-3.5 px-4 text-xs font-mono">36 / 44</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Bold</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Section titles</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans font-semibold text-lg text-neutral-900">Heading 1</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">28 / 36</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Semi Bold</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Card titles</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans font-semibold text-base text-neutral-900">Heading 2</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">22 / 30</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Semi Bold</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Sub section</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans font-medium text-sm text-neutral-900">Heading 3</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">18 / 26</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Medium</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Small titles</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans text-sm text-neutral-900">Body Large</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">16 / 24</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Regular</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Body copy</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans text-xs text-neutral-900">Body</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">14 / 20</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Regular</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Supporting text</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-sans text-[11px] text-neutral-900">Small</td>
                      <td className="py-3.5 px-4 text-xs">Inter</td>
                      <td className="py-3.5 px-4 text-xs font-mono">12 / 16</td>
                      <td className="py-3.5 px-4 text-xs font-medium">Regular</td>
                      <td className="py-3.5 pl-4 text-xs text-neutral-500">Captions, meta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            04 SPACING SYSTEM & 05 RADIUS & SHADOWS
           ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 04 SPACING SYSTEM */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">04</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                SPACING SYSTEM
              </h2>
            </div>
            <p className="text-xs text-neutral-500">Base unit: 4px</p>

            <div className="flex items-end justify-between gap-2 pt-4">
              {[
                { px: 4, rem: "0.25rem", h: 8 },
                { px: 8, rem: "0.5rem", h: 12 },
                { px: 12, rem: "0.75rem", h: 16 },
                { px: 16, rem: "1rem", h: 20 },
                { px: 24, rem: "1.5rem", h: 28 },
                { px: 32, rem: "2rem", h: 36 },
                { px: 40, rem: "2.5rem", h: 44 },
                { px: 48, rem: "3rem", h: 52 },
                { px: 64, rem: "4rem", h: 64 },
              ].map((space) => (
                <div key={space.px} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full min-w-[20px] bg-[#FED7AA] rounded-xs"
                    style={{ height: `${space.h}px` }}
                  />
                  <span className="text-xs font-semibold text-neutral-900">{space.px}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">({space.rem})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 05 RADIUS & SHADOWS */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">05</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                RADIUS & SHADOWS
              </h2>
            </div>

            {/* Radius */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-neutral-700">Radius</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: "4px", name: "(xs)", radiusClass: "rounded-[4px]" },
                  { label: "8px", name: "(sm)", radiusClass: "rounded-[8px]" },
                  { label: "12px", name: "(md)", radiusClass: "rounded-[12px]" },
                  { label: "16px", name: "(lg)", radiusClass: "rounded-[16px]" },
                  { label: "24px", name: "(xl)", radiusClass: "rounded-[24px]" },
                  { label: "Full", name: "(circle)", radiusClass: "rounded-full" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                    <div
                      className={`w-14 h-14 bg-white border border-neutral-300 shadow-2xs ${item.radiusClass}`}
                    />
                    <span className="text-xs font-semibold text-neutral-900">{item.label}</span>
                    <span className="text-[10px] text-neutral-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shadows */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-neutral-700">Shadows</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    name: "Sm",
                    val: "0 1px 2px 0",
                    rgba: "rgba(15, 23, 42, 0.05)",
                    shadowStyle: { boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.05)" },
                  },
                  {
                    name: "Md",
                    val: "0 4px 12px -2px",
                    rgba: "rgba(15, 23, 42, 0.08)",
                    shadowStyle: { boxShadow: "0 4px 12px -2px rgba(15, 23, 42, 0.08)" },
                  },
                  {
                    name: "Lg",
                    val: "0 12px 24px -4px",
                    rgba: "rgba(15, 23, 42, 0.10)",
                    shadowStyle: { boxShadow: "0 12px 24px -4px rgba(15, 23, 42, 0.10)" },
                  },
                  {
                    name: "Xl",
                    val: "0 20px 40px -8px",
                    rgba: "rgba(15, 23, 42, 0.12)",
                    shadowStyle: { boxShadow: "0 20px 40px -8px rgba(15, 23, 42, 0.12)" },
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={item.shadowStyle}
                    className="p-4 bg-white border border-neutral-100 rounded-2xl space-y-1.5"
                  >
                    <p className="text-xs font-bold text-neutral-900">{item.name}</p>
                    <p className="text-[10px] font-mono text-neutral-500">{item.val}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{item.rgba}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            06 ICONS, 07 BUTTONS, 08 INPUTS
           ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 06 ICONS */}
          <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">06</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                ICONS
              </h2>
            </div>

            {/* Outline Style */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-500">Outline Style</h3>
              <div className="flex items-center flex-wrap gap-2.5 text-neutral-700">
                <BellIcon size={20} />
                <SearchIcon size={20} />
                <PlayIcon size={20} />
                <DocumentIcon size={20} />
                <BookmarkIcon size={20} />
                <ChartIcon size={20} />
                <ClockIcon size={20} />
                <UserIcon size={20} />
                <ChevronRightIcon size={20} />
              </div>
            </div>

            {/* Filled Style */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-500">Filled Style</h3>
              <div className="flex items-center flex-wrap gap-2.5 text-neutral-900">
                <BellFilledIcon size={20} />
                <SearchFilledIcon size={20} />
                <PlayFilledIcon size={20} />
                <DocumentFilledIcon size={20} />
                <BookmarkFilledIcon size={20} />
                <ChartFilledIcon size={20} />
                <ClockFilledIcon size={20} />
                <UserFilledIcon size={20} />
                <ChevronRightIcon size={20} />
              </div>
            </div>

            {/* Icon Specs */}
            <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-700 mb-1">Icon Specs</p>
              <p>&bull; 24x24px grid</p>
              <p>&bull; 2px stroke width (outline)</p>
              <p>&bull; Rounded line caps</p>
              <p>&bull; Consistent optical balance</p>
            </div>
          </div>

          {/* 07 BUTTONS */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">07</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                BUTTONS
              </h2>
            </div>

            <div className="space-y-4">
              {/* Columns Header */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-neutral-500 pb-1 border-b border-neutral-100">
                <span>Primary</span>
                <span>Secondary</span>
                <span>Tertiary</span>
                <span>Text</span>
              </div>

              {/* Default Row */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400 font-mono w-14 shrink-0">Default</span>
                <div className="grid grid-cols-4 gap-2 flex-1 items-center">
                  <Button variant="primary" size="sm">Get Started</Button>
                  <Button variant="secondary" size="sm">Explore Courses</Button>
                  <Button variant="tertiary" size="sm" icon={<ExternalLinkIcon size={12} />}>View Lesson</Button>
                  <Button variant="text" size="sm" icon={<PlayFilledIcon size={10} />}>Watch Video</Button>
                </div>
              </div>

              {/* Hover Row */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400 font-mono w-14 shrink-0">Hover</span>
                <div className="grid grid-cols-4 gap-2 flex-1 items-center">
                  <Button variant="primary" size="sm" isHoveredState>Get Started</Button>
                  <Button variant="secondary" size="sm" isHoveredState>Explore Courses</Button>
                  <Button variant="tertiary" size="sm" isHoveredState icon={<ExternalLinkIcon size={12} />}>View Lesson</Button>
                  <Button variant="text" size="sm" isHoveredState icon={<PlayFilledIcon size={10} />}>Watch Video</Button>
                </div>
              </div>

              {/* Disabled Row */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400 font-mono w-14 shrink-0">Disabled</span>
                <div className="grid grid-cols-4 gap-2 flex-1 items-center">
                  <Button variant="primary" size="sm" disabled>Get Started</Button>
                  <Button variant="secondary" size="sm" disabled>Explore Courses</Button>
                  <Button variant="tertiary" size="sm" disabled icon={<ExternalLinkIcon size={12} />}>View Lesson</Button>
                  <Button variant="text" size="sm" disabled icon={<PlayFilledIcon size={10} />}>Watch Video</Button>
                </div>
              </div>
            </div>

            {/* Button Specs */}
            <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-700 mb-1">Button Specs</p>
              <p>&bull; Height: 44px (default)</p>
              <p>&bull; Padding: 0 16px (lg), 0 12px (md)</p>
              <p>&bull; Radius: 12px</p>
              <p>&bull; Font: Inter Medium (14–16px)</p>
            </div>
          </div>

          {/* 08 INPUTS */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">08</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                INPUTS
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Search / Text Input</label>
                <Input placeholder="Search anything..." shortcut="⌘ K" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Select</label>
                <Select
                  options={[
                    { value: "relevant", label: "Most Relevant" },
                    { value: "newest", label: "Newest First" },
                  ]}
                />
              </div>
            </div>

            {/* Field Specs */}
            <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-700 mb-1">Field Specs</p>
              <p>&bull; Height: 44px</p>
              <p>&bull; Radius: 12px</p>
              <p>&bull; Border: 1px solid #E2E8F0</p>
              <p>&bull; Padding: 0 16px</p>
              <p>&bull; Focus: Border color #FB923C</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            09 BADGES, 10 STATUS / INDICATORS, 11 PROGRESS BAR
           ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
          {/* 09 BADGES / TAGS */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">09</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                BADGES / TAGS
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <p className="text-[11px] text-neutral-400">Video</p>
                <Badge variant="video">VIDEO</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-neutral-400">Lesson</p>
                <Badge variant="lesson">LESSON</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-neutral-400">Popular</p>
                <Badge variant="popular">POPULAR</Badge>
              </div>
            </div>
          </div>

          {/* 10 STATUS / INDICATORS */}
          <div className="md:col-span-4 space-y-4 border-t md:border-t-0 md:border-l border-neutral-100 pt-6 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">10</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                STATUS / INDICATORS
              </h2>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <StatusIndicator status="in-progress" label="In Progress" />
              <StatusIndicator status="completed" label="Completed" />
              <StatusIndicator status="now-playing" label="Now Playing" />
              <StatusIndicator status="locked" label="Locked" />
            </div>
          </div>

          {/* 11 PROGRESS BAR */}
          <div className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-neutral-100 pt-6 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">11</span>
              <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                PROGRESS BAR
              </h2>
            </div>
            <ProgressBar value={35} />
          </div>
        </section>

        {/* =========================================================================
            12 CARDS
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">12</span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
              CARDS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Course Card */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400">Course Card</span>
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                modulesCount="12 modules"
              />
            </div>

            {/* Lesson Card (Video) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400">Lesson Card (Video)</span>
              <LessonVideoCard
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonLabel="Lesson 5.1"
                timestamp="12:45"
              />
            </div>

            {/* Lesson Card (Lesson) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400">Lesson Card (Lesson)</span>
              <LessonCard
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>

            {/* Resource Card */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400">Resource Card</span>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                fileType="PDF"
                fileSize="1.2 MB"
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            13 NAVIGATION, BREADCRUMBS & PAGINATION
           ========================================================================= */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">13</span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
              NAVIGATION
            </h2>
          </div>

          <div className="space-y-6">
            {/* Nav Header */}
            <NavigationBar
              activeTab={activeNavTab}
              onTabClick={(tab) => setActiveNavTab(tab)}
            />

            {/* Breadcrumbs & Pagination Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Breadcrumbs</span>
                <Breadcrumbs
                  items={[
                    { label: "All Courses" },
                    { label: "Next.js for Production" },
                    { label: "Data Fetching & Caching" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Pagination</span>
                <div>
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            14 PRINCIPLES
           ========================================================================= */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">14</span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
              PRINCIPLES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clarity First */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 shadow-2xs shrink-0">
                <EyeIcon size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">Clarity First</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>

            {/* Consistency */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 shadow-2xs shrink-0">
                <GridIcon size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">Consistency</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Use components and patterns consistently across the platform.
                </p>
              </div>
            </div>

            {/* Focus & Calm */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 shadow-2xs shrink-0">
                <TargetIcon size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">Focus & Calm</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>

            {/* Accessible */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 shadow-2xs shrink-0">
                <AccessibilityIcon size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">Accessible</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
