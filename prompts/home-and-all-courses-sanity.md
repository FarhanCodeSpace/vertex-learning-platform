# Home Page Real Data Wiring & All Courses Page Implementation

## Goal
1. Wire the Home page (`app/page.tsx`) to fetch and display real course data from the private Sanity dataset via `getCourses()` instead of hardcoded static data.
2. Implement the dedicated All Courses page (`app/courses/page.tsx`) that displays all available courses from Sanity with category filtering, search filtering, and matching Vertex design aesthetics.

## Skills Read
- `AGENTS.md`
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `clerk-nextjs-patterns` (`c:\Appzy\vertex\.agents\skills\clerk-nextjs-patterns\SKILL.md`)

## Code and Config Inspected
- `app/page.tsx`: Currently has a hardcoded array of 3 courses. Needs to be a server-driven page (or hybrid server page with client search/interactive controls) fetching real courses via `getCourses()`.
- `sanity/lib/api.ts` & `sanity/lib/queries.ts`: Has `getCourses()` and `getCategories()` that query the `production` dataset.
- `sanity/types.ts`: `CourseCardSummary` and `Category`.
- `components/ui/cards.tsx`: `CourseCard` component.
- `components/ui/icons.tsx`: Logos and brand icons (NextJsLogo, DockerLogo, TypeScriptLogo, etc.).
- `lib/format.ts`: `formatDuration`, `capitalize`, and duration calculation utilities.
- `design/vertex-course.png`: Source of truth for Vertex design style (warm background texture, ambient glow bars, rounded-2xl cards, typography, badge pills).

## Decisions and Assumptions
1. **Home Page (`app/page.tsx`)**:
   - Refactor `app/page.tsx` as a Server Component fetching real courses from Sanity using `getCourses()`.
   - Use a focused Client Component for interactive elements (such as the Hero Search input with ⌘K keyboard shortcut and client-side filtering/navigation).
   - Display featured/popular courses or the top courses directly from Sanity with real titles, summaries, levels, module counts, and calculated durations.
   - Each course card links to `/courses/${course.slug.current}`.
2. **All Courses Page (`app/courses/page.tsx`)**:
   - Create `app/courses/page.tsx` as a Server Component fetching all courses via `getCourses()` and all categories via `getCategories()`.
   - Render:
     - `SiteHeader` with active nav tab "Courses".
     - Header area with Page Title ("All Courses"), breadcrumb (`All Courses`), and subtitle.
     - Interactive Category tabs ("All", "Web Development", "AI Engineering", "Languages", "Data", "Backend & Infrastructure", "Security").
     - Search & filter bar for instant course discovery within the catalog.
     - Responsive grid of course cards using real Sanity data.
     - Empty state when no courses match a selected filter.
     - Star divider note ("New courses and lessons added every week").
     - Ambient background glow.
3. **Course Visuals / Icons for Cards**:
   - Create a smart icon resolver for courses (Next.js, React, TypeScript, Python, Docker, PostgreSQL, AI/LLMs, RAG, System Design, Security, etc.) so every card renders a distinctive, high-fidelity brand tile.

## Files Expected to Touch
- `prompts/home-and-all-courses-sanity.md` (Implementation prompt)
- `app/page.tsx` (Refactor to server component fetching Sanity courses)
- `components/home/hero-search.tsx` (Interactive search client component)
- `components/course/course-card-item.tsx` (Smart course card item with icon resolver)
- `app/courses/page.tsx` (New All Courses catalog page with category and search filter)
- `components/courses/courses-catalog-client.tsx` (Client component for filtering catalog by category and search query)

## Requirements
1. The Home page must fetch real course data from the Sanity dataset (`getCourses()`) on the server.
2. The All Courses page (`/courses`) must list all courses from Sanity with category and keyword filtering.
3. Clicking on any course card must navigate to its corresponding `/courses/[slug]` detail page.
4. Follow Vertex design system: typography, warm background, ambient glowing pillars, and responsive layout.

## Security Considerations
- Read tokens remain strictly on the server side via `sanityFetch`.
- Authentication continues to use Clerk securely via Next.js middleware and client components.

## Acceptance Criteria
- [ ] Home page renders real course data from Sanity.
- [ ] `/courses` route is accessible, displays all seeded courses, and supports category filtering.
- [ ] Course cards accurately display course title, summary, level, duration, and module count.
- [ ] Clicking any course navigates to `/courses/[slug]`.
- [ ] Type check (`npx tsc --noEmit`), lint (`npm run lint`), and build (`npm run build`) pass cleanly.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000`. Verify that course cards display real courses from Sanity (e.g. Next.js App Router in Depth, TypeScript for Application Developers, etc.).
2. Click "View all courses" or the "Courses" nav link to navigate to `http://localhost:3000/courses`.
3. Verify all 10 seeded courses are displayed in the catalog.
4. Click on category filter pills (e.g. "Web Development", "AI Engineering", "Data") and verify the course list filters accordingly.
5. Click a course card to navigate to its `/courses/[slug]` page.
