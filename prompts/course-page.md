# Course Page Implementation

## Goal
Implement the course detail page (`/courses/[slug]`) according to the provided UI design (`design/vertex-course.png`) and fully wire it with live seeded Sanity content.

## Skills Read
- `AGENTS.md`
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `clerk-nextjs-patterns` (`c:\Appzy\vertex\.agents\skills\clerk-nextjs-patterns\SKILL.md`)

## Code and Config Inspected
- `design/vertex-course.png`: Source-of-truth UI for the Course Page (header navigation, breadcrumb, course hero with icon/cover, popular badge, title, summary, meta info, Continue Learning & Bookmark buttons, What You'll Learn 2x2 grid, Course Content module accordion list, and bottom sticky progress bar).
- `sanity/lib/queries.ts` and `sanity/lib/api.ts`: Contains `courseBySlugQuery`, `getCourseBySlug(slug)`, `allCourseSlugsQuery`, and `getAllCourseSlugs()`.
- `sanity/lib/fetch.ts` and `sanity/lib/client.ts`: Private dataset authenticated fetch with server-side read token.
- `sanity/types.ts`: CourseDetail, Module, Lesson, LearningOutcome, SanityImage types.
- `components/ui/icons.tsx`, `components/ui/cards.tsx`, `components/ui/navigation.tsx`, `components/ui/badge.tsx`, `components/ui/progress-bar.tsx`: Existing design system primitives.
- `app/page.tsx`: Top header navigation structure, ambient gradient glow background, Clerk auth integration.

## Decisions and Assumptions
1. **Routing & Dynamic Pages**:
   - Create `app/courses/[slug]/page.tsx` as an async Next.js Server Component that fetches data via `getCourseBySlug(slug)` and provides metadata (`generateMetadata`).
   - Implement `generateStaticParams()` using `getAllCourseSlugs()` for fast static delivery and ISR.
   - Return `notFound()` if a course slug does not exist in Sanity.
   - If accessed via alias or popular courses, route gracefully.
2. **Visual Fidelity to Design (`design/vertex-course.png`)**:
   - **Header & Breadcrumbs**: Brand logo & nav ('Courses', 'My Learning'), Clerk UserButton/Auth, breadcrumb (`All Courses > [Course Title]`).
   - **Course Hero Section**:
     - Large rounded course cover box / brand logo (e.g. Next.js / Docker / TypeScript / course image).
     - `POPULAR` tag badge (when `course.popular` is true).
     - Title in serif typography (`font-serif font-bold text-4xl sm:text-5xl text-neutral-900`).
     - Course summary/description.
     - Metadata row: Level, Total Duration (formatted e.g. "18h 24m"), Module Count ("12 modules"), Student Count (e.g. "2.1k students" / "18.2k students").
     - Action buttons: "Continue Learning ->" (orange CTA linking to the first lesson) and "Bookmark" button.
   - **"What you'll learn" Section**:
     - Container card with border and subtle backdrop.
     - 2x2 responsive grid of learning outcomes from Sanity `learningOutcomes` array with warm orange outline icons (Layers, Database, Gauge, Cloud, Shield, Code, Rocket, etc.), bold title, and description.
   - **"Course Content" Section**:
     - Header with "Course Content" and total module/time count (`12 modules • 18h 24m`).
     - Module list accordion: numbered badge (1, 2, 3...), module title, summary, module duration, and expand/collapse chevron.
     - Expanding a module reveals its lessons with duration, free preview badge, and links to the lesson player.
     - Bottom "Show all X modules" / collapse toggle button when many modules are present.
   - **Bottom Sticky "Your Progress" Bar**:
     - Floating/sticky bottom card displaying "Your Progress", progress percentage (e.g., "35% complete" or learner's calculated progress), visual progress bar, and "Continue Learning ->" button.
   - **Background**:
     - Diagonal micro-pattern overlay and bottom ambient warm glowing pillars.
3. **Data Formatting & Helpers**:
   - Duration helper to format durations (seconds to hours/minutes like `18h 24m` or `45m`).
   - Student count formatter (e.g. `18240` -> `18.2k students`).
4. **Catalog Linking**:
   - Update `app/page.tsx` course cards to link to `/courses/[slug]`.

## Files Expected to Touch
- `prompts/course-page.md` (Implementation prompt)
- `app/courses/[slug]/page.tsx` (New Course Detail Page)
- `components/course/course-hero.tsx` (or direct component module in `components/course/` or `app/courses/[slug]/`)
- `components/course/course-learning-outcomes.tsx`
- `components/course/course-content-accordion.tsx`
- `components/course/course-progress-bar.tsx`
- `app/page.tsx` (Wire card links to `/courses/[slug]`)
- `sanity/lib/queries.ts` (Ensure all necessary fields including duration/images/lessons are selected)

## Requirements
1. Render course details dynamically using Sanity data from `production` dataset.
2. Match visual layout, colors, typography, spacing, and micro-interactions of `design/vertex-course.png`.
3. Support responsive design down to mobile viewports while preserving desktop pixel precision.
4. Expandable module accordion to inspect lessons.
5. "Continue Learning" navigates to the first lesson of the course.

## Security Considerations
- Read token stays on the server side via `sanityFetch`.
- Clerk authentication and user state are safely handled without exposing secret keys to client bundles.

## Acceptance Criteria
- [ ] `/courses/[slug]` loads successfully for seeded courses (e.g., `nextjs-app-router-in-depth`, `typescript-for-application-developers`, etc.).
- [ ] Visual design matches `design/vertex-course.png` exactly across all sections (Hero, What you'll learn, Course Content accordion, Bottom Progress bar, Background aesthetics).
- [ ] Interactive accordion allows expanding/collapsing modules to view lessons.
- [ ] Responsive across desktop, tablet, and mobile screens.
- [ ] Clicking course cards on the home page navigates to their respective `/courses/[slug]` pages.
- [ ] Type check and Next.js build pass cleanly without errors.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Exact Manual Test Steps
1. Start dev server `npm run dev`.
2. Open `http://localhost:3000/courses/nextjs-app-router-in-depth` in the browser.
3. Verify the Course Hero, "POPULAR" badge, Title, Metadata (level, duration, modules, students), and Action buttons match `design/vertex-course.png`.
4. Verify the "What you'll learn" 2x2 grid renders the 4 learning outcome cards with correct icons.
5. Verify the "Course Content" accordion lists all modules and expands to show lessons.
6. Verify the sticky progress bar appears at the bottom with "Continue Learning" CTA.
7. Open home page `http://localhost:3000` and click the Next.js course card to verify navigation to `/courses/nextjs-app-router-in-depth`.
