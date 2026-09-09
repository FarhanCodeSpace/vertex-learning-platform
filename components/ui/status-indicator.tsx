import React from "react";

export interface StatusIndicatorProps {
  status: "in-progress" | "completed" | "now-playing" | "locked";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  showLabel = true,
  label,
  className = "",
}: StatusIndicatorProps) {
  const getIconAndDefaultLabel = () => {
    switch (status) {
      case "in-progress":
        return {
          icon: (
            <div className="w-5 h-5 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin-slow flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            </div>
          ),
          defaultLabel: "In Progress",
          textColor: "text-neutral-900 font-medium",
        };
      case "completed":
        return {
          icon: (
            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ),
          defaultLabel: "Completed",
          textColor: "text-neutral-900 font-medium",
        };
      case "now-playing":
        return {
          icon: (
            <div className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-2.5 h-2.5 translate-x-0.25" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          ),
          defaultLabel: "Now Playing",
          textColor: "text-neutral-900 font-medium",
        };
      case "locked":
        return {
          icon: (
            <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          ),
          defaultLabel: "Locked",
          textColor: "text-neutral-900 font-medium",
        };
    }
  };

  const { icon, defaultLabel, textColor } = getIconAndDefaultLabel();

  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      {icon}
      {showLabel && (
        <span className={`text-sm ${textColor}`}>
          {label || defaultLabel}
        </span>
      )}
    </div>
  );
}
