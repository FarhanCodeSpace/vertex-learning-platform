import React from "react";
import { VertexWordmark, ChevronRightIcon, ChevronLeftIcon } from "./icons";

// Header Navigation
export interface NavigationBarProps {
  activeTab?: string;
  onTabClick?: (tab: string) => void;
  className?: string;
}

export function NavigationBar({
  activeTab = "Courses",
  onTabClick,
  className = "",
}: NavigationBarProps) {
  const tabs = ["Courses", "My Learning"];

  return (
    <div
      className={`flex items-center justify-between px-6 py-4 bg-white border border-neutral-200 rounded-2xl shadow-sm ${className}`}
    >
      <VertexWordmark />
      <div className="flex items-center gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabClick?.(tab)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-[#F97316] font-semibold"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({
  items = [
    { label: "All Courses", href: "/" },
    { label: "Next.js for Production" },
    { label: "Data Fetching & Caching" },
  ],
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-2 text-sm text-neutral-500 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRightIcon size={14} className="text-neutral-400 shrink-0" />
            )}
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="hover:text-neutral-800 transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={`transition-colors ${
                  isLast
                    ? "text-neutral-900 font-medium cursor-default"
                    : "hover:text-neutral-800 cursor-pointer"
                }`}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Pagination
export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  onPageChange,
  className = "",
}: PaginationProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
      >
        <ChevronLeftIcon size={16} />
      </button>

      <button
        onClick={() => onPageChange?.(1)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          currentPage === 1
            ? "border border-[#F97316] text-[#F97316] bg-white shadow-xs"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        1
      </button>

      <button
        onClick={() => onPageChange?.(2)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer ${
          currentPage === 2
            ? "border border-[#F97316] text-[#F97316] bg-white shadow-xs"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        2
      </button>

      <button
        onClick={() => onPageChange?.(3)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer ${
          currentPage === 3
            ? "border border-[#F97316] text-[#F97316] bg-white shadow-xs"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        3
      </button>

      <span className="w-6 text-center text-sm text-neutral-400">...</span>

      <button
        onClick={() => onPageChange?.(8)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer ${
          currentPage === 8
            ? "border border-[#F97316] text-[#F97316] bg-white shadow-xs"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        8
      </button>

      <button
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
      >
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
}
