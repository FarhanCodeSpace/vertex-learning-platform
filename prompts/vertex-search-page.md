# Implementation Prompt: Vertex Search Page

## Goal
Implement and polish the Vertex Search Page (`/search`) to reproduce the exact UI wireframe from `design/vertex-search.png`, wired with live Sanity content, video intelligence documents (transcripts and chapters), lesson results with key points, dynamic sorting, keyboard shortcuts (`⌘K`), and PostHog analytics tracking.

## Skills Consulted
- `AGENTS.md` (Project instructions, search architecture, and guidelines)
- `create-agent-with-sanity-context` (`c:\Appzy\vertex\.agents\skills\create-agent-with-sanity-context\SKILL.md`)
- `dial-your-context` (`c:\Appzy\vertex\.agents\skills\dial-your-context\SKILL.md`)
- `shape-your-agent` (`c:\Appzy\vertex\.agents\skills\shape-your-agent\SKILL.md`)
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)

## Code and Config Inspected
- `design/vertex-search.png`: Source-of-truth layout, typography, colors, tags, and result cards:
  - Top header (`SiteHeader`) with active state and user controls.
  - Page header: `SEARCH RESULTS` badge, `Results for “<query>”` with query highlighted in orange, subtitle `Found X results across Y courses`.
  - Search input box with search icon, input value, and `⌘ K` keyboard shortcut badge.
  - Results count label (e.g. `28 results`) and `Most Relevant` dropdown.
  - Video cards with 16:9 thumbnail previews, brand watermarks, play icon overlay, duration badge, course logo/title, `VIDEO` badge, lesson title, description, module metadata, and `Watch from MM:SS →` action linking to `/lesson/[slug]?start=[seconds]`.
  - Lesson cards with left key points panel (document / course icon, bullet points, completed checkmark badge), `LESSON` badge, module label, and `View lesson ↗ →` action linking to `/lesson/[slug]`.
  - Bottom callout banner: "Can't find what you're looking for?" with "Browse all courses →" CTA button.
- `sanity/lib/search.ts`: Search query resolver querying courses, modules, lessons, and video intelligence documents (chapters and transcript chunks) with relevance scoring and timestamp matching.
- `app/search/page.tsx`: Server component rendering the search page.
- `components/search/search-results-client.tsx`, `video-result-card.tsx`, `lesson-result-card.tsx`, `search-empty-state.tsx`.
- `components/ui/icons.tsx`: Brand logos (Next.js, React, Node.js, JavaScript, Python, TypeScript, Docker) and UI icons.

## Decisions and Assumptions
1. **Visual Fidelity**:
   - Ensure the search page matches `design/vertex-search.png` exactly in spacing, font sizing, color palette (Vertex orange `#EA580C`/`#F97316`, neutral text shades, card borders, and shadows).
   - Ensure brand icons for courses render accurately with their respective color schemes (Next.js `N`, React cyan atom, Node.js green hexagon `JS`, JavaScript yellow square `JS`, TypeScript blue `TS`).
   - Style the `VIDEO` tag (`#FFF5F0` bg, `#EA580C` text/border) and `LESSON` tag (`#F3E8FF` bg, `#7C3AED` text/border) to match the reference.
   - For lesson cards, render the left key points panel with bullet points and the dark circular checkmark icon in the bottom right corner.
2. **Data & Sanity Integration**:
   - `searchContent` executes multi-stage grounded search across Sanity courses, modules, lessons, and video intelligence documents.
   - Video result cards resolve exact timestamps from matched chapters and transcript chunks, defaulting to sensible chapter offsets when matching broad lesson topics.
   - Results support sorting by `relevant`, `duration`, and `course`.
3. **Interactivity & UX**:
   - Global `⌘K` listener focuses the search input.
   - Live query typing with form submission and URL synchronization (`/search?q=...&sort=...`).
   - Seamless navigation from homepage hero search bar directly into the search page.
   - Video card CTA navigates to `/lesson/[slug]?start=[seconds]` where the embedded video player starts at the matching second.
4. **Analytics**:
   - PostHog captures `search_performed` and `search_result_clicked` events.

## Files Expected to Touch / Verify
- `prompts/vertex-search-page.md` (Implementation prompt)
- `app/search/page.tsx` (Search page metadata and container)
- `components/search/search-results-client.tsx` (Search state, keyboard shortcuts, sort controls, layout)
- `components/search/video-result-card.tsx` (Video result card styling, thumbnail overlay, CTA)
- `components/search/lesson-result-card.tsx` (Lesson result card styling, key points list, checkmark badge, CTA)
- `components/search/search-empty-state.tsx` (Empty state and bottom catalog banner)
- `sanity/lib/search.ts` (GROQ search queries, video chapter/chunk resolution, scoring)
- `components/ui/icons.tsx` (Verify icon styles and brand logos)

## Requirements & Acceptance Criteria
- [ ] Navigating to `/search?q=data+fetching` renders the page matching `design/vertex-search.png`.
- [ ] Title shows `Results for “data fetching”` with orange query highlight and results/course count.
- [ ] Video cards display 16:9 thumbnail preview, duration timestamp, course brand icon, `VIDEO` tag, title, description, module line, and `Watch from MM:SS →` action button.
- [ ] Lesson cards display key points preview with bullets and checkmark badge, course brand icon, `LESSON` tag, title, description, module label, and `View lesson ↗ →` action button.
- [ ] Clicking video result CTA navigates to `/lesson/[slug]?start=[seconds]`.
- [ ] Clicking lesson result CTA navigates to `/lesson/[slug]`.
- [ ] Search input supports live typing, search submission, and `⌘K` keyboard focus.
- [ ] Sort dropdown re-orders results by relevance, duration, or course title.
- [ ] Bottom callout banner links to `/courses`.
- [ ] Type check (`npx tsc --noEmit`), lint (`npm run lint`), and build (`npm run build`) pass cleanly.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Run `npm run build` to verify Next.js build passes.
2. Start dev server `npm run dev`.
3. Open `http://localhost:3000/search?q=data+fetching`.
4. Inspect visual layout against `design/vertex-search.png`:
   - Header badge, title, subtitle, search input with `⌘K`.
   - Results count and sort dropdown.
   - Video result cards with thumbnail, duration badge, play button, and "Watch from MM:SS →".
   - Lesson result cards with key points list and "View lesson ↗ →".
   - Bottom "Can't find what you're looking for?" banner.
5. Click a video card "Watch from 12:45 →" and confirm navigation to `/lesson/[slug]?start=765`.
6. Click a lesson card "View lesson ↗ →" and confirm navigation to `/lesson/[slug]`.
7. Change the sort selector to "Duration" and "Course" and confirm re-sorting.
8. Type a new search query (e.g. `caching`) and submit to confirm real-time search update.
