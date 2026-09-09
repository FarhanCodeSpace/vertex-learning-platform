import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value = 35,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      <div className="relative flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F97316] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-neutral-900 shrink-0">
          {clampedValue}% <span className="text-neutral-500 font-normal">complete</span>
        </span>
      )}
    </div>
  );
}
