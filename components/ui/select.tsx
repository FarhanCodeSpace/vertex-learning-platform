import React from "react";
import { ChevronDownIcon } from "./icons";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  options?: { value: string; label: string }[];
}

export function Select({
  className = "",
  options = [
    { value: "relevant", label: "Most Relevant" },
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
  ],
  defaultValue = "relevant",
  ...props
}: SelectProps) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <select
        defaultValue={defaultValue}
        className="w-full h-11 pl-4 pr-10 appearance-none bg-white text-sm font-medium text-neutral-900 border border-neutral-200 rounded-xl outline-none transition-all duration-150 cursor-pointer focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C]/20"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 flex items-center pointer-events-none text-neutral-500">
        <ChevronDownIcon size={18} />
      </div>
    </div>
  );
}
