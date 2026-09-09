import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "md" | "lg" | "sm";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  isHoveredState?: boolean; // for design system demonstration
}

export function Button({
  variant = "primary",
  size = "lg",
  children,
  icon,
  iconPosition = "right",
  disabled = false,
  className = "",
  isHoveredState = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 focus:outline-none select-none";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs rounded-md gap-1.5",
    md: "h-11 px-3.5 text-sm rounded-xl gap-2",
    lg: "h-11 px-4 text-sm font-medium rounded-xl gap-2",
  }[size];

  // Specific state styling
  let variantStyles = "";

  if (variant === "primary") {
    if (disabled) {
      variantStyles = "bg-[#FFEEE5] text-[#FDBA74] cursor-not-allowed border-transparent";
    } else if (isHoveredState) {
      variantStyles = "bg-[#EA580C] text-white shadow-sm border-transparent";
    } else {
      variantStyles =
        "bg-[#F97316] text-white hover:bg-[#EA580C] active:bg-[#C2410C] shadow-sm border-transparent cursor-pointer";
    }
  } else if (variant === "secondary") {
    if (disabled) {
      variantStyles = "bg-[#FAFAFC] text-[#FED7AA] border border-[#FED7AA]/50 cursor-not-allowed";
    } else if (isHoveredState) {
      variantStyles = "bg-[#FFEEE5] text-[#F97316] border border-[#FB923C] shadow-sm";
    } else {
      variantStyles =
        "bg-white text-[#F97316] border border-[#FED7AA] hover:bg-[#FFEEE5] hover:border-[#FB923C] active:bg-[#FFEEE5]/80 shadow-sm cursor-pointer";
    }
  } else if (variant === "tertiary") {
    if (disabled) {
      variantStyles = "bg-[#FAFAFC] text-[#CBD5E1] border border-[#E2E8F0] cursor-not-allowed";
    } else if (isHoveredState) {
      variantStyles = "bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] shadow-sm";
    } else {
      variantStyles =
        "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:bg-[#E2E8F0] shadow-sm cursor-pointer";
    }
  } else if (variant === "text") {
    if (disabled) {
      variantStyles = "bg-transparent text-[#FED7AA] cursor-not-allowed";
    } else if (isHoveredState) {
      variantStyles = "bg-transparent text-[#EA580C]";
    } else {
      variantStyles =
        "bg-transparent text-[#F97316] hover:text-[#EA580C] active:text-[#C2410C] cursor-pointer";
    }
  }

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
