import React from "react";

export interface BadgeProps {
  variant?: "video" | "lesson" | "popular";
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "video", children, className = "" }: BadgeProps) {
  const styles = {
    video: "bg-[#FFEEE5] text-[#F97316] border border-[#FED7AA]/40",
    lesson: "bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]/40",
    popular: "bg-[#FFEEE5] text-[#F97316] border border-[#FED7AA]/40",
  }[variant];

  const defaultText = {
    video: "VIDEO",
    lesson: "LESSON",
    popular: "POPULAR",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase select-none ${styles} ${className}`}
    >
      {children || defaultText}
    </span>
  );
}
