import posthog from "posthog-js";

/**
 * Type definitions for PostHog event properties across Vertex
 */

export interface SearchPerformedEvent {
  query: string;
  total_results: number;
  courses_count: number;
  sort?: string;
  search_source?: "search_page" | "hero_search" | "global_search";
}

export interface SearchResultClickedEvent {
  query: string;
  result_type: "video" | "lesson";
  lesson_slug: string;
  course_title: string;
  start_seconds?: number;
  position_index?: number;
}

export interface VideoPlayedEvent {
  lesson_slug: string;
  course_slug?: string;
  provider?: "youtube" | "vimeo" | "bunny" | "generic";
  start_seconds: number;
  duration?: number;
  has_video: boolean;
  is_resumed?: boolean;
}

export interface VideoWatchDepthEvent {
  lesson_slug: string;
  course_slug?: string;
  depth_percentage: 25 | 50 | 75 | 90 | 100;
  current_seconds: number;
  duration?: number;
  provider?: string;
}

export interface ResumeUsedEvent {
  course_slug?: string;
  lesson_slug?: string;
  start_seconds?: number;
  source: "course_hero" | "course_progress_bar" | "search_result" | "video_start_timestamp" | "lesson_url";
}

export interface LessonCompletedEvent {
  lesson_slug: string;
  course_slug?: string;
  module_index?: number;
  lesson_index?: number;
  completion_trigger: "video_watch_threshold" | "next_lesson_button" | "manual_mark";
}

/**
 * Client-side typed helper functions for capturing PostHog events
 */

export function trackSearchPerformed(props: SearchPerformedEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("search_performed", props);
}

export function trackSearchResultClicked(props: SearchResultClickedEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("search_result_clicked", props);
}

export function trackVideoPlayed(props: VideoPlayedEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("video_played", props);
}

export function trackVideoWatchDepth(props: VideoWatchDepthEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("video_watch_depth_reached", props);
}

export function trackResumeUsed(props: ResumeUsedEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("resume_used", props);
}

export function trackLessonCompleted(props: LessonCompletedEvent) {
  if (typeof window === "undefined") return;
  posthog.capture("lesson_completed", props);
}
