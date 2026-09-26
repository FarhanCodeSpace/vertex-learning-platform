"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import posthog from "posthog-js";
import { VertexLogo, BellIcon } from "@/components/ui/icons";

interface SiteHeaderProps {
  activeNav?: string;
  className?: string;
}

export function SiteHeader({
  activeNav = "Courses",
  className = "",
}: SiteHeaderProps) {
  const [currentNav, setCurrentNav] = useState(activeNav);

  return (
    <header className={`relative z-20 w-full border-b border-transparent ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center gap-10 sm:gap-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <VertexLogo className="w-7 h-7 group-hover:scale-105 transition-transform" />
            <span className="font-serif font-bold text-2xl tracking-tight text-neutral-900">
              Vertex
            </span>
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/courses"
              onClick={() => setCurrentNav("Courses")}
              className={`transition-colors cursor-pointer ${
                currentNav === "Courses"
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Courses
            </Link>
            <Link
              href="/my-learning"
              onClick={() => setCurrentNav("My Learning")}
              className={`transition-colors cursor-pointer ${
                currentNav === "My Learning"
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              My Learning
            </Link>
          </nav>
        </div>

        {/* Right: Notifications & Auth Controls */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            aria-label="Notifications"
            className="text-neutral-700 hover:text-neutral-900 hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
          >
            <BellIcon size={20} />
          </button>

          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button
                  onClick={() =>
                    posthog.capture("authentication_started", { method: "sign_in" })
                  }
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 px-3.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() =>
                    posthog.capture("authentication_started", { method: "sign_up" })
                  }
                  className="text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-9 h-9 ring-1 ring-neutral-200/80 hover:ring-[#F97316]/50 transition-all",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}
