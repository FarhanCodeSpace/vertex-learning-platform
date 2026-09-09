import React from "react";
import { SearchIcon } from "./icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  className?: string;
}

export function Input({
  icon = <SearchIcon size={18} className="text-neutral-500" />,
  shortcut = "⌘ K",
  className = "",
  placeholder = "Search anything...",
  ...props
}: InputProps) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {icon && (
        <div className="absolute left-4.5 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full h-11 ${
          icon ? "pl-11" : "pl-4"
        } ${
          shortcut ? "pr-14" : "pr-4"
        } bg-white text-sm text-neutral-900 placeholder:text-neutral-500 border border-neutral-200 rounded-xl outline-none transition-all duration-150 focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C]/20`}
        {...props}
      />
      {shortcut && (
        <div className="absolute right-4 flex items-center pointer-events-none">
          <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
}
