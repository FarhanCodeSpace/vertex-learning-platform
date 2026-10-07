# Implementation Prompt: PostHog Tracking for Vertex Features

## 1. Goal
Implement comprehensive PostHog product analytics tracking across Vertex learning platform features created since initial setup. This includes search queries, search result interactions with result types, video playback, video watch depth milestones (25%, 50%, 75%, 90%, 100%), resume usage ("Continue Learning" & timestamp jumps), lesson completions, course and lesson interactions, and server-side telemetry. The implementation adheres to PostHog's Next.js best practices and privacy guidelines, strictly avoiding any personally identifiable information (PII) beyond the Clerk user ID.

---

## 2. Skills & References Read
- `AGENTS.md` (Product rules, PostHog guidelines, server vs client boundaries, zero client token leakage)
- `instrumentation.ts` & `instrumentation-client.ts` (PostHog telemetry and client initialization)
- `lib/posthog-logger.ts` (Server-side OTLP / PostHog logging)
- `lib/video.ts` (Video provider parsing and start timestamps)
- `components/posthog-identity.tsx` (User identification via Clerk user ID)

---

## 3. Code Inspected
- `components/posthog-identity.tsx`: Currently passes email and name to PostHog. Must be sanitized to only pass `user.id` (no PII).
- `components/search/search-results-client.tsx`: Tracks `search_performed`. Enhance with search query, result counts, sort option, and zero-results state.
- `components/search/video-result-card.tsx` & `components/search/lesson-result-card.tsx`: Track `search_result_clicked` with `result_type` ("video" | "lesson"), position index, start seconds, course title, and lesson slug.
- `components/home/hero-search.tsx`: Tracks `course_search_submitted`.
- `components/lesson/lesson-player.tsx`: Plays YouTube, Vimeo, Bunny, or generic embeds. Currently only fires initial play on click. Needs robust video player tracking: playback start, provider identification, watch depth milestone tracking (25%, 50%, 75%, 90%, 100%), and completion.
- `components/lesson/lesson-footer-nav.tsx`: Navigates previous/next lessons. Add `lesson_completed` event when navigating to the next lesson or reaching completion.
- `components/lesson/lesson-header.tsx`: Tracks `lesson_bookmarked`.
- `components/lesson/lesson-sidebar.tsx`: Tracks `lesson_nav_clicked`.
- `components/lesson/lesson-tabs.tsx` & `components/lesson/lesson-content-tab.tsx`: Track tab switches and resource downloads.
- `components/course/course-hero.tsx` & `components/course/course-progress-bar.tsx`: Track `resume_used` and `learning_continued`.
- `components/course/course-content-accordion.tsx` & `components/course/course-card-item.tsx`: Track module expansion and course selection.
- `app/api/search/route.ts`: Server-side search API. Enhance with server-side query logging via `emitPostHogLog`.

---

## 4. Decisions & Assumptions
1. **Event Naming Convention**: Standardize on clean snake_case following PostHog conventions (e.g., `search_performed`, `search_result_clicked`, `video_played`, `video_watch_depth_reached`, `resume_used`, `lesson_completed`, `course_viewed`, `lesson_viewed`).
2. **Strict Privacy / Non-PII**: Refactor `PostHogIdentity` so `posthog.identify(user.id)` passes only the Clerk user ID without email, name, or profile URLs.
3. **Video Watch Depth & Milestones**:
   - For embedded players (YouTube iframe API message bridge and time-interval tracker), listen for message events / playback state changes, or track active watch duration against lesson duration.
   - Fire `video_watch_depth_reached` at milestones: 25%, 50%, 75%, 90%, 100%.
   - Fire `lesson_completed` once 90% or 100% watch depth is reached or when learner clicks Next Lesson from the active lesson.
4. **Resume Tracking**:
   - Fire `resume_used` when a learner clicks "Continue Learning" from `CourseHero` or `CourseProgressBar`, or enters a lesson page with a resume `startSeconds > 0` query parameter.
5. **Server-Side Tracking**:
   - Use `lib/posthog-logger.ts` in `/api/search/route.ts` to log server-side query execution latency and result counts without logging PII.

---

## 5. Files to Create / Modify
- `lib/analytics.ts` (New typed analytics helper for PostHog event definitions and helper dispatchers)
- `components/posthog-identity.tsx` (Sanitize identity to omit PII)
- `components/lesson/lesson-player.tsx` (Add video playback lifecycle, watch depth milestones, and completion tracking)
- `components/lesson/lesson-footer-nav.tsx` (Add lesson completion tracking)
- `components/lesson/lesson-sidebar.tsx` (Audit and polish event payload properties)
- `components/search/search-results-client.tsx` (Enhance search performed tracking)
- `components/search/video-result-card.tsx` (Enhance search result opened tracking with result type "video")
- `components/search/lesson-result-card.tsx` (Enhance search result opened tracking with result type "lesson")
- `components/course/course-hero.tsx` (Track `resume_used`)
- `components/course/course-progress-bar.tsx` (Track `resume_used`)
- `app/api/search/route.ts` (Add server-side telemetry log for search execution)
- `app/lesson/[slug]/page.tsx` (Pass `duration` to `LessonPlayer` and track `lesson_viewed`)

---

## 6. Requirements
1. **Search Tracking**:
   - `search_performed`: `query`, `total_results`, `courses_count`, `sort`, `search_source`.
   - `search_result_clicked`: `query`, `result_type` ("video" | "lesson"), `lesson_slug`, `course_title`, `start_seconds` (if video), `position_index`.
2. **Video Play & Watch Depth**:
   - `video_played`: `lesson_slug`, `course_slug`, `provider`, `start_seconds`, `duration`, `is_resumed`.
   - `video_watch_depth_reached`: `lesson_slug`, `course_slug`, `depth_percentage` (25, 50, 75, 90, 100), `current_seconds`, `duration`.
3. **Resume Used**:
   - `resume_used`: `course_slug`, `lesson_slug`, `start_seconds`, `source` ("course_hero" | "course_progress_bar" | "search_result" | "lesson_url").
4. **Lesson Completed**:
   - `lesson_completed`: `lesson_slug`, `course_slug`, `completion_trigger` ("video_milestone" | "next_navigation").
5. **No PII**: No email, name, or phone numbers in event payloads or identity calls.

---

## 7. Security & Privacy Considerations
- Only public client keys are exposed in the browser (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`).
- Sensitive data and PII (learner emails, full names) are completely omitted from client capture and identity mapping.
- Server-side logging only uses OTLP / server PostHog token and logs operational attributes.

---

## 8. Acceptance Criteria
- [x] All 6 requested event categories (search performed, search result opened with result type, video play, watch depth, resume used, lessons completed) are implemented with standardized schemas.
- [x] PostHog identity tracking is PII-free.
- [x] Server-side search telemetry is emitted on the search API route.
- [x] TypeScript compiles without errors (`npm run build` / `npm run lint`).
- [x] All existing course, lesson, and search functionality continues to render and operate smoothly.

---

## 9. Checks to Run
- `npm run lint` (ESLint verification)
- `npm run build` (Next.js production build and TypeScript check)

---

## 10. Exact Manual Test Steps
1. Navigate to `/search?q=rendering` and verify `search_performed` event captures query and result counts.
2. Click on a video search result card and verify `search_result_clicked` event captures `result_type: "video"` and `start_seconds`.
3. Click on a lesson search result card and verify `search_result_clicked` captures `result_type: "lesson"`.
4. Open a lesson page (`/lesson/<slug>`), click play, and verify `video_played` is captured.
5. Watch the video through 25%, 50%, 75%, 90% milestones and verify `video_watch_depth_reached` and `lesson_completed` events fire.
6. On a course page (`/courses/<slug>`), click "Continue Learning" on the hero and sticky bottom bar, and verify `resume_used` is captured.
7. Click "Next Lesson" in the lesson footer and verify `lesson_completed` and `lesson_navigation_clicked` fire.
8. Inspect PostHog identity in browser dev tools to ensure no user emails or names are being transmitted.
