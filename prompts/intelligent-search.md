# Intelligent Search Implementation Prompt

## Goal
Implement the intelligent search feature for Vertex matching the desktop design (`design/vertex-search.png`), connecting the Sanity Context MCP endpoint, a server-side search API route (`/api/search`), and a dedicated search results page (`/search`) displaying grounded, ranked video moment cards (with exact playback seek timestamps) and lesson cards across courses.

## Skills Read
- `AGENTS.md`
- `create-agent-with-sanity-context` (`c:\Appzy\vertex\.agents\skills\create-agent-with-sanity-context\SKILL.md`)
- `dial-your-context` (`c:\Appzy\vertex\.agents\skills\dial-your-context\SKILL.md`)
- `shape-your-agent` (`c:\Appzy\vertex\.agents\skills\shape-your-agent\SKILL.md`)
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)

## Code and Config Inspected
- `design/vertex-search.png`: Source of truth visual layout:
  - Top header (Vertex logo, 'Courses', 'My Learning', bell icon, Clerk profile avatar).
  - Page header:
    - Uppercase badge: `SEARCH RESULTS`
    - Main heading: `Results for “data fetching”` (with query highlighted in orange)
    - Subtitle: `Found 28 results across 8 courses`
    - Full-width search bar input with search icon, search term, and `⌘ K` keyboard shortcut badge.
    - Results count label (e.g., `28 results`) and sort dropdown (`Most Relevant` default, `Duration`, `Course`).
  - Search Cards:
    - **Video Result Card**:
      - Left: 16:9 thumbnail preview with dark gradient overlay, white play button, and duration pill (e.g. `12:45`).
      - Right: Course icon (e.g., Next.js `N`, React atom, Node.js `JS`, JavaScript `JS`) + Course title + `VIDEO` uppercase tag.
      - Bold lesson title (e.g., "Data Fetching in Server Components").
      - Description summary.
      - Footer: Document icon with lesson number + module name ("Lesson 5.1 · Data Fetching & Caching") and right action CTA "Watch from 12:45 →" linking directly to `/lesson/[slug]?start=[seconds]`.
    - **Lesson Result Card**:
      - Left: Key points card with document icon, 3 bullet items (e.g., "• Fetching strategies", "• Caching techniques", "• Revalidation methods"), and completed checkmark circle.
      - Right: Course icon + Course title + `LESSON` uppercase tag (purple).
      - Bold title, description summary, footer "Module 5" and right action CTA "View lesson ↗ →" linking to `/lesson/[slug]`.
  - Empty / Catalog CTA Callout:
    - Search icon in circle, "Can't find what you're looking for? Try different keywords or browse our full course catalog." with "[Browse all courses →]" button linking to `/courses`.
- `sanity/schemaTypes/`: Schema for `course`, `lesson`, `instructor`, `category`, `module`.
- `studio/scripts/seed/seed.ndjson` & `videos.json`: Seeded lessons, modules, and video metadata.
- `.env.local` & `sanity/env.ts`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`.
- `components/home/hero-search.tsx` & `components/ui/site-header.tsx`: Search inputs and navigation links.

## Decisions and Assumptions
1. **Sanity Context MCP Integration & Schema Support**:
   - Create the `video` schema (`sanity/schemaTypes/video.ts` and `studio/schemaTypes/video.ts`) holding `id`, `url`, `chapters` (`[{ startSeconds, label }]`), and `chunks` (`[{ startSeconds, text }]`) per `AGENTS.md` section 8.
   - Seed / populate video documents for video intelligence so transcript chunks and chapters are indexed and queryable.
   - Connect the server-side search route to the Sanity Context MCP HTTP endpoint (`https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}`) using `SANITY_API_READ_TOKEN`.
   - Pre-fetch and cache `/initial-context` on the server for schema injection without initial round-trip latency.
2. **Server-side Search API (`/api/search`)**:
   - Accept `{ query, sort }` in POST or GET request.
   - Execute two-stage grounded search:
     - Match lessons directly on title, key points, and notes (plain text projection via GROQ).
     - Match video documents on chapters first, falling back to transcript chunks for specific timestamps.
     - Join matched video timestamps with their parent lesson and parent course/module metadata.
     - Rank by specificity (exact title/keyword matches rank higher than broad keyword matches).
   - If AI SDK / LLM provider (OpenAI) is configured, invoke the model with MCP tools (`groq_query`, `schema_explorer`) to refine ranking and extract relevant timestamps.
   - Guarantee resilient, fast, grounded fallback via deterministic GROQ search over Sanity so search always returns accurate real results even if external LLM services are slow or rate-limited.
   - Return structured response: `{ query, totalResults, coursesCount, results: [...] }`.
3. **Search Results Page (`/search`)**:
   - Create `app/search/page.tsx` as a Server Component / Client Container reading `searchParams.q` and `searchParams.sort`.
   - Interactive search input with live search, clear button, and `⌘K` keyboard listener.
   - Sort dropdown selector ("Most Relevant", "Duration", "Course").
   - Render `VideoResultCard` and `LessonResultCard` matching `design/vertex-search.png` down to pixels, typography, badges, and colors.
   - Render empty state / "Can't find what you're looking for?" bottom CTA banner.
   - Update `HeroSearch` on homepage to route directly to `/search?q=...`.
4. **PostHog Telemetry**:
   - Track `search_performed` event with `{ query, total_results, courses_count }`.
   - Track `search_result_clicked` event with `{ query, result_type, lesson_slug, start_seconds }`.

## Files Expected to Touch
- `prompts/intelligent-search.md` (This prompt)
- `package.json` (Add `@ai-sdk/openai`, `ai`, `@ai-sdk/mcp`, `zod` dependencies if needed)
- `sanity/schemaTypes/video.ts` (Video document schema definition)
- `sanity/schemaTypes/index.ts` (Register video schema)
- `studio/schemaTypes/video.ts` (Studio video schema definition)
- `studio/schemaTypes/index.ts` (Register Studio video schema)
- `sanity/lib/search.ts` (Search query resolver, GROQ matching, and timestamp resolution)
- `app/api/search/route.ts` (Search API route connecting MCP and LLM / GROQ search)
- `components/search/search-results-client.tsx` (Client component for search results, sorting, and live filter)
- `components/search/video-result-card.tsx` (Video result card component with timestamp seek link)
- `components/search/lesson-result-card.tsx` (Lesson result card component with key points)
- `components/search/search-empty-state.tsx` (Empty state and bottom catalog banner)
- `components/ui/icons.tsx` (Add brand tech logos: React, Node.js, JavaScript, Python if needed)
- `components/home/hero-search.tsx` (Update to route queries to `/search?q=...`)
- `app/search/page.tsx` (Search results page route)

## Requirements
1. Search connects to Sanity Context MCP and executes grounded search over courses, modules, lessons, and video chapters/chunks.
2. Results are displayed as ranked, clickable cards (video moments and lessons), never as a chatbox.
3. Video result cards link to `/lesson/[slug]?start=[seconds]` and automatically seek to that second in the player.
4. Lesson result cards link to `/lesson/[slug]`.
5. Visual layout, typography, colors, badges, and spacing match `design/vertex-search.png` exactly.
6. Responsive across mobile, tablet, and desktop viewports.
7. PostHog analytics track search queries and card clicks.

## Security Considerations
- `SANITY_API_READ_TOKEN` and any AI provider API keys remain strictly server-side in `/api/search` and `sanity/lib/`.
- No client-side token leakage.
- Sanitized query inputs and safe URL parameter encoding.

## Acceptance Criteria
- [ ] Navigating to `/search?q=data+fetching` renders the search results page matching `design/vertex-search.png`.
- [ ] Heading displays `Results for “data fetching”` with orange highlight and correct result/course counts.
- [ ] Video cards show course logo, course title, `VIDEO` badge, lesson title, description, module info, duration, and "Watch from MM:SS →" button.
- [ ] Lesson cards show key points list with checkmarks, course info, `LESSON` badge, and "View lesson ↗ →" button.
- [ ] Clicking a video result opens the lesson page at the exact timestamp.
- [ ] Sort dropdown updates the ordering of results.
- [ ] Empty state renders cleanly when no results match.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass with zero errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Start the dev server `npm run dev`.
2. Open `http://localhost:3000/search?q=data+fetching`.
3. Verify the search bar, heading, result count, and sort dropdown.
4. Verify video result cards and lesson result cards match `design/vertex-search.png`.
5. Click "Watch from 12:45 →" on a video card and verify it navigates to `/lesson/[slug]?start=...` and starts playback at that timestamp.
6. Click "View lesson ↗ →" on a lesson card and verify it opens the lesson page.
7. Test searching from the homepage hero search input and verify it navigates to `/search?q=...`.
8. Test searching for an obscure keyword to verify the empty state and "Browse all courses" CTA.
