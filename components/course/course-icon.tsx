import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";
import { DockerLogo, TypeScriptLogo } from "@/components/ui/icons";

interface CourseVisualProps {
  icon?: string | null;
  coverImage?: SanityImage | null;
  title: string;
  className?: string;
}

export function CourseVisual({
  icon,
  coverImage,
  title,
  className = "w-full max-w-[280px] sm:max-w-[320px] aspect-square",
}: CourseVisualProps) {
  // If explicitly Next.js or title starts with Next.js
  const isNextJs =
    icon?.toLowerCase().includes("next") ||
    title.toLowerCase().includes("next.js") ||
    title.toLowerCase().includes("app router");

  const isDocker =
    icon?.toLowerCase().includes("docker") ||
    title.toLowerCase().includes("docker") ||
    title.toLowerCase().includes("devops");

  const isTypeScript =
    icon?.toLowerCase().includes("typescript") ||
    title.toLowerCase().includes("typescript");

  if (isNextJs) {
    return (
      <div
        className={`relative rounded-3xl bg-[#090A0F] border border-neutral-800 shadow-xl overflow-hidden flex items-center justify-center p-8 shrink-0 ${className}`}
      >
        {/* Subtle radial sheen on the black background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#111319] to-[#1A1C24] opacity-90" />
        
        {/* Stylized Large 'N' Metallic Logo */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 180 180"
            fill="none"
            className="w-4/5 h-4/5 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            <mask
              id="next-hero-mask"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
              x="0"
              y="0"
              width="180"
              height="180"
            >
              <circle cx="90" cy="90" r="90" fill="black" />
            </mask>
            <g mask="url(#next-hero-mask)">
              <path
                d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                fill="url(#paint0_hero_linear)"
              />
              <rect
                x="115"
                y="54"
                width="12"
                height="72"
                fill="url(#paint1_hero_linear)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_hero_linear"
                x1="109"
                y1="116.5"
                x2="144.5"
                y2="160.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_hero_linear"
                x1="121"
                y1="54"
                x2="120.799"
                y2="106.875"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  if (isDocker) {
    return (
      <div
        className={`relative rounded-3xl bg-[#0B1528] border border-[#1E3A5F] shadow-xl overflow-hidden flex items-center justify-center p-8 shrink-0 ${className}`}
      >
        <DockerLogo className="w-3/4 h-3/4" />
      </div>
    );
  }

  if (isTypeScript) {
    return (
      <div
        className={`relative rounded-3xl bg-[#1E3A8A] border border-[#3B82F6]/40 shadow-xl overflow-hidden flex items-center justify-center p-8 shrink-0 ${className}`}
      >
        <TypeScriptLogo className="w-3/4 h-3/4 text-4xl" />
      </div>
    );
  }

  if (coverImage?.asset?._ref) {
    return (
      <div
        className={`relative rounded-3xl bg-neutral-900 border border-neutral-200 overflow-hidden shadow-xl shrink-0 ${className}`}
      >
        <Image
          src={urlFor(coverImage).width(600).height(600).url()}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
          priority
        />
      </div>
    );
  }

  // Fallback initial brand tile
  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 shadow-xl flex items-center justify-center text-white font-serif font-bold text-6xl shrink-0 ${className}`}
    >
      {title.charAt(0)}
    </div>
  );
}
