"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

export function PostHogIdentity() {
  const { isLoaded, isSignedIn, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      if (identifiedUserId.current && identifiedUserId.current !== user.id) {
        posthog.reset();
      }

      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
      identifiedUserId.current = user.id;
      return;
    }

    if (identifiedUserId.current) {
      posthog.reset();
      identifiedUserId.current = null;
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
