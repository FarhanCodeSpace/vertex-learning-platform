"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { getEmbedUrl } from "@/lib/video";
import { PlayIcon } from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";
import {
  trackVideoPlayed,
  trackVideoWatchDepth,
  trackResumeUsed,
  trackLessonCompleted,
} from "@/lib/analytics";

interface LessonPlayerProps {
  videoUrl?: string;
  poster?: SanityImage;
  title: string;
  lessonSlug: string;
  courseSlug?: string;
  startSeconds?: number;
  duration?: number | string;
}

const MILESTONES = [25, 50, 75, 90, 100] as const;

export function LessonPlayer({
  videoUrl,
  poster,
  title,
  lessonSlug,
  courseSlug,
  startSeconds = 0,
  duration = 600,
}: LessonPlayerProps) {
  const [userStarted, setUserStarted] = useState(false);
  const isPlaying = userStarted || startSeconds > 0;
  const parsed = getEmbedUrl(videoUrl, startSeconds);

  const firedMilestones = useRef<Set<number>>(new Set());
  const initialPlayFired = useRef(false);
  const watchSecondsRef = useRef(startSeconds || 0);

  // If startSeconds is provided or there is a valid embedUrl, we can either autoplay or show poster overlay
  const posterUrl = poster ? urlFor(poster).width(1280).height(720).url() : null;

  const rawDurationNum =
    typeof duration === "number"
      ? duration
      : typeof duration === "string"
      ? parseInt(duration, 10)
      : 600;
  const totalDuration = !isNaN(rawDurationNum) && rawDurationNum > 0 ? rawDurationNum : 600;

  const checkAndFireMilestones = useCallback((currentSec: number) => {
    const percentage = Math.min(100, Math.floor((currentSec / totalDuration) * 100));

    for (const milestone of MILESTONES) {
      if (percentage >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone);
        trackVideoWatchDepth({
          lesson_slug: lessonSlug,
          course_slug: courseSlug,
          depth_percentage: milestone,
          current_seconds: Math.floor(currentSec),
          duration: totalDuration,
          provider: parsed?.provider,
        });

        // If learner reaches 90% or 100%, track lesson completed
        if (milestone === 90 || milestone === 100) {
          trackLessonCompleted({
            lesson_slug: lessonSlug,
            course_slug: courseSlug,
            completion_trigger: "video_watch_threshold",
          });
        }
      }
    }
  }, [totalDuration, lessonSlug, courseSlug, parsed?.provider]);

  const fireVideoPlay = useCallback(() => {
    if (initialPlayFired.current) return;
    initialPlayFired.current = true;

    trackVideoPlayed({
      lesson_slug: lessonSlug,
      course_slug: courseSlug,
      provider: parsed?.provider,
      start_seconds: startSeconds,
      duration: totalDuration,
      has_video: Boolean(videoUrl),
      is_resumed: startSeconds > 0,
    });

    if (startSeconds > 0) {
      trackResumeUsed({
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        start_seconds: startSeconds,
        source: "video_start_timestamp",
      });
      // Also evaluate starting milestone if resuming deep in video
      checkAndFireMilestones(startSeconds);
    }
  }, [lessonSlug, courseSlug, parsed?.provider, startSeconds, totalDuration, videoUrl, checkAndFireMilestones]);

  // If page loaded with startSeconds > 0, fire play & resume automatically
  useEffect(() => {
    if (startSeconds > 0 && !initialPlayFired.current) {
      fireVideoPlay();
    }
  }, [startSeconds, fireVideoPlay]);

  // Active watch depth tracker (listens for iframe postMessage and runs playback interval timer)
  useEffect(() => {
    if (!isPlaying) return;

    // 1. Listen for iframe postMessage events (YouTube / Vimeo player events)
    const handleMessage = (event: MessageEvent) => {
      try {
        let msg = event.data;
        if (typeof msg === "string") {
          msg = JSON.parse(msg);
        }

        // YouTube IFrame API messages
        if (msg?.event === "infoDelivery" && msg.info) {
          if (typeof msg.info.currentTime === "number") {
            watchSecondsRef.current = msg.info.currentTime;
            checkAndFireMilestones(msg.info.currentTime);
          }
          if (msg.info.playerState === 0) {
            // Video ended (100% completion)
            checkAndFireMilestones(totalDuration);
          }
        }

        // Vimeo Player messages
        if (msg?.event === "timeupdate" && msg.data?.seconds) {
          watchSecondsRef.current = msg.data.seconds;
          checkAndFireMilestones(msg.data.seconds);
        } else if (msg?.event === "ended") {
          checkAndFireMilestones(totalDuration);
        }
      } catch {
        // Non-JSON message from external extensions or scripts
      }
    };

    window.addEventListener("message", handleMessage);

    // 2. Playback progression interval timer as fallback / continuous progression
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        watchSecondsRef.current += 1;
        checkAndFireMilestones(watchSecondsRef.current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [isPlaying, totalDuration, checkAndFireMilestones]);

  const handleStartPlay = () => {
    setUserStarted(true);
    fireVideoPlay();
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl flex items-center justify-center group">
      {parsed?.embedUrl && isPlaying ? (
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Poster image or dark gradient placeholder */}
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-neutral-900 via-neutral-950 to-black flex items-center justify-center">
              {/* Minimal brand monogram background */}
              <span className="font-serif font-black text-8xl sm:text-9xl text-white/5 select-none pointer-events-none">
                V
              </span>
            </div>
          )}

          {/* Dark scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Central Play Button */}
          <button
            type="button"
            onClick={handleStartPlay}
            aria-label={`Play ${title}`}
            className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-neutral-900 hover:bg-[#F97316] hover:text-white flex items-center justify-center shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
          >
            <PlayIcon size={26} className="ml-1 text-neutral-900 group-hover/btn:text-white transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
