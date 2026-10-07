# Lesson Page Implementation

## Goal
Implement the interactive Lesson Page (`/lesson/[slug]`) matching the provided desktop UI design (`design/vertex-lesson.png`) down to layout, spacing, typography, colors, and states, fully wired to live seeded Sanity content with responsive video playback, module navigation sidebar, lesson overview/notes tabs, resources, and previous/next lesson controls.

## Skills Read
- `AGENTS.md`
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `portable-text-serialization` (`c:\Appzy\vertex\.agents\skills\portable-text-serialization\SKILL.md`)
- `clerk-nextjs-patterns` (`c:\Appzy\vertex\.agents\skills\clerk-nextjs-patterns\SKILL.md`)

## Code and Config Inspected
- `design/vertex-lesson.png`: Source of truth UI for the Lesson Page.
  - Top global header (Vertex logo, 'Courses', 'My Learning', notifications bell, Clerk user avatar).
  - Left navigation sidebar:
    - Back to course link (`← Back to course`)
    - Course banner with course logo/icon, course title, and completion progress
    - Module status indicator ("Module X of Y")
    - Collapsible module accordion list with numbered badges, checkmarks for completed lessons, active lesson marker with "Now playing" badge and play indicator, and lesson titles + durations.
  - Right main content panel:
    - Breadcrumb navigation (`All Courses > [Course Title] > [Module Title] > [Lesson Title]`)
    - Lesson number badge (`LESSON 5.1`)
    - Lesson Title and Bookmark action button
    - Lesson summary / overview description
    - Metadata pills row (duration, difficulty level, student count)
    - 16:9 embedded video player for YouTube/Vimeo/Bunny supporting timestamp query parameters (`?t=` or `?start=`)
    - Tab navigation (`Lesson Content` and `Notes`)
    - `Lesson Content` tab: Overview section, "In this lesson you will:" bullet points with orange checkmarks, "Pro Tip" callout box with lightbulb icon, and "Resources" card grid with external link arrows.
    - `Notes` tab: Rich Portable Text renderer with code snippets, headings, paragraphs, and list items.
    - Bottom lesson footer navigation: "← Previous Lesson" outline button with previous lesson info, and "Next Lesson →" solid orange CTA button with next lesson info.
- `sanity/lib/queries.ts` & `sanity/lib/api.ts`: Contains `lessonBySlugQuery`, `getLessonBySlug(slug)`, `allLessonSlugsQuery`, and `getAllLessonSlugs()`.
- `sanity/schemaTypes/lesson.ts`: Fields for `title`, `slug`, `videoUrl`, `poster`, `duration`, `freePreview`, `studentCount`, `keyPoints`, `proTip`, `notes` (blockContent), and `resources`.
- `lib/format.ts`: Utilities for duration, student count, and module duration calculations.
- `components/ui/`: Existing primitives (`site-header.tsx`, `navigation.tsx`, `badge.tsx`, `icons.tsx`, `cards.tsx`, `ambient-glow.tsx`).

## Decisions and Assumptions
1. **Routing & Dynamic Page Structure**:
   - Create `app/lesson/[slug]/page.tsx` as a Next.js Server Component that fetches data via `getLessonBySlug(slug)` and provides metadata via `generateMetadata()`.
   - Implement `generateStaticParams()` using `getAllLessonSlugs()` for static generation and fast delivery.
   - Return `notFound()` if a lesson slug does not exist in Sanity.
   - Support `searchParams` for start timestamp seek (e.g., `?t=120` or `?start=120` or `?startSeconds=120`).
2. **Component Architecture**:
   - `components/lesson/lesson-sidebar.tsx`: Sticky/scrollable course & module sidebar displaying current progress, all modules with accordion collapse/expand, checkmark indicators, and active lesson styling ("Now playing", orange dot, play icon). Responsive on mobile via collapsible drawer / toggle.
   - `components/lesson/lesson-player.tsx`: Responsive 16:9 video embed component supporting YouTube, Vimeo, and Bunny URLs with start parameter handling, fallback poster when no video URL is provided, and PostHog video engagement tracking.
   - `components/lesson/lesson-header.tsx`: Breadcrumb, lesson number tag badge (`LESSON [module].[lesson]`), serif title, bookmark button, lesson summary, and meta icons (duration, level, student count).
   - `components/lesson/lesson-tabs.tsx`: Interactive client tabs for switching between "Lesson Content" and "Notes".
   - `components/lesson/lesson-content-tab.tsx`: Overview paragraph, "In this lesson you will:" bullet points with checkmark icons, "Pro Tip" card, and "Resources" grid with link icons and external navigation.
   - `components/lesson/lesson-notes-tab.tsx`: Portable Text serializer using `@portabletext/react` with custom styled components for typography, code blocks, lists, and callouts.
   - `components/lesson/lesson-footer-nav.tsx`: Bottom navigation bar with "Previous Lesson" and "Next Lesson" links, displaying their respective titles and durations.
3. **Video Provider Embed Parser**:
   - Create a clean helper `lib/video.ts` to parse YouTube (standard, short, embed, youtu.be), Vimeo, and Bunny embed URLs and generate clean `<iframe>` src URLs with the correct seek / start time parameters (`start`, `t`).
4. **PostHog Analytics Integration**:
   - Track `lesson_viewed` on page mount.
   - Track `lesson_tab_switched` when toggling between Content and Notes.
   - Track `lesson_resource_clicked` when a resource link is opened.
   - Track `lesson_completed` and navigation transitions.

## Files Expected to Touch
- `prompts/lesson-page.md` (Implementation prompt)
- `lib/video.ts` (Video embed URL parser and start-time query resolver)
- `components/lesson/lesson-player.tsx` (Provider video embed player)
- `components/lesson/lesson-sidebar.tsx` (Module & lesson course sidebar)
- `components/lesson/lesson-header.tsx` (Breadcrumb, title, meta pills, bookmark)
- `components/lesson/lesson-tabs.tsx` (Lesson Content / Notes tab switcher)
- `components/lesson/lesson-content-tab.tsx` (Overview, key points, pro tip, resources)
- `components/lesson/lesson-notes-tab.tsx` (Portable Text notes renderer)
- `components/lesson/lesson-footer-nav.tsx` (Previous & Next lesson pagination)
- `app/lesson/[slug]/page.tsx` (Lesson Page route)
- `sanity/lib/queries.ts` (Ensure lesson query retrieves all needed fields including instructor, level, notes, keyPoints, proTip, resources)

## Requirements
1. Render lesson data dynamically from the Sanity dataset matching `design/vertex-lesson.png`.
2. Responsive two-column desktop layout that cleanly collapses / stacks on smaller viewports.
3. Interactive video embed that plays directly on the site with start timestamp parameter support.
4. Expandable/collapsible module accordion in the sidebar highlighting the active lesson and module.
5. Interactive tabs for "Lesson Content" and "Notes" with rich Portable Text rendering.
6. Responsive "Resources" card grid and "Pro Tip" callout box.
7. Bottom navigation allowing smooth traversal to previous and next lessons in the course sequence.

## Security Considerations
- Sanity read tokens stay strictly server-side through `sanityFetch`.
- Embed iframes use `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"` and `allowFullScreen` without exposing sensitive tokens.
- External resource links use `rel="noopener noreferrer"`.

## Acceptance Criteria
- [ ] `/lesson/[slug]` loads successfully for seeded lessons (e.g., `/lesson/nextjs-app-router-in-depth-file-system-routing`, `/lesson/nextjs-app-router-in-depth-caching-and-revalidation`, etc.).
- [ ] Visual layout, colors, typography, and spacing match `design/vertex-lesson.png` exactly.
- [ ] Video player embeds and plays the lesson video directly on the page.
- [ ] Sidebar highlights current lesson as "Now playing" with module numbering and previous completed lessons.
- [ ] Tabs allow switching between "Lesson Content" (Overview, Key points, Pro Tip, Resources) and "Notes" (Portable Text).
- [ ] Bottom pagination links correctly to previous and next lessons in the course sequence.
- [ ] Responsive across mobile, tablet, and desktop screens.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass with zero errors.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Exact Manual Test Steps
1. Start the dev server `npm run dev`.
2. Open `http://localhost:3000/lesson/nextjs-app-router-in-depth-file-system-routing` in the browser.
3. Verify the header, sidebar, breadcrumb, lesson tag `LESSON 1.1`, title, summary, meta info, video player, tabs, Pro Tip, Resources, and bottom navigation.
4. Click play on the video embed to confirm it plays on the page.
5. Click on the "Notes" tab to verify rich Portable Text notes rendering.
6. Click "Next Lesson →" in the footer to navigate to the next lesson and verify state updates smoothly.
7. Test on mobile screen size to verify responsiveness of sidebar and content.
