# Lesson Page UI Polish & Sidebar Alignment Implementation Prompt

## Goal
Refine and adjust the Lesson Page (`/lesson/[slug]`) to match the desktop UI design reference (`design/vertex-lesson.png`) with pixel-precision, specifically:
1. **Sidebar alignment**: Streamline the left course navigation sidebar without bulky outer box borders, clean border division separating the sidebar and content columns, exact numbering badges, completed checkmarks on previous modules, active module expanded state with vertical timeline connecting lessons, "Now playing" active lesson indicator with solid orange circle play button, and clean durations.
2. **Bottom page layout & Footer Navigation**: Polish the bottom section including the Resources cards (3-column layout with proper icons and hover interactions) and the bottom pagination bar (`[ ← Previous Lesson ]` with title/duration to the right, and title/duration to the left of `[ Next Lesson → ]`).
3. **Container & Layout Framing**: Ensure the full container framing, diagonal background texture styling, and divider borders faithfully reproduce `design/vertex-lesson.png`.

## Skills Read
- `AGENTS.md`
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `portable-text-serialization` (`c:\Appzy\vertex\.agents\skills\portable-text-serialization\SKILL.md`)

## Code and Config Inspected
- `design/vertex-lesson.png`: Source-of-truth visual design.
- `app/lesson/[slug]/page.tsx`: Main lesson page layout container.
- `components/lesson/lesson-sidebar.tsx`: Course module & lesson sidebar.
- `components/lesson/lesson-footer-nav.tsx`: Bottom navigation bar with previous/next lesson buttons.
- `components/lesson/lesson-content-tab.tsx`: Overview, key points, Pro Tip, and Resources cards.
- `components/lesson/lesson-header.tsx` & `components/lesson/lesson-tabs.tsx`.

## Decisions and Assumptions
1. **Sidebar Layout & Visual Hierarchy**:
   - Remove the heavy rounded card wrapper around the sidebar on desktop; instead, place the sidebar flush inside the left column with a clean right border (`border-r border-neutral-200/80`) separating it from the main content.
   - Style completed modules (prior to active module) with a neutral numbered pill and an orange/rust checkmark outline icon on the right.
   - Style the active module (e.g. Module 5) with a solid orange numbered circle `5`, bold module title, duration, and an upward chevron `⌃`.
   - In the active module's lesson list:
     - Render a sleek vertical timeline line.
     - Active lesson: Orange dot on timeline, lesson title, orange "Now playing" label, and a solid orange circle play button icon on the right.
     - Inactive lessons in the active module: Gray hollow circle dot on timeline, lesson title, and duration directly beneath the title.
   - Future modules: Numbered pill with border, title, duration, and downward chevron `⌵`.
2. **Bottom Footer Navigation**:
   - Layout:
     - Left: Outlined button `[ ← Previous Lesson ]` with the previous lesson's title and duration placed to the right of the button.
     - Right: Next lesson's title and duration placed to the left of the solid orange button `[ Next Lesson → ]`.
   - Maintain top border divider (`border-t border-neutral-200/80`) spanning across the content section.
3. **Bottom Resources Grid**:
   - 3-column responsive card grid (`grid-cols-1 md:grid-cols-3`).
   - Cards display document/repo icons, bold titles, descriptive subtitles, and subtle external link arrows (`↗`).

## Files Expected to Touch
- `prompts/lesson-page-ui-polish.md`
- `app/lesson/[slug]/page.tsx`
- `components/lesson/lesson-sidebar.tsx`
- `components/lesson/lesson-footer-nav.tsx`
- `components/lesson/lesson-content-tab.tsx`

## Requirements
1. Left navigation sidebar strictly mirrors `design/vertex-lesson.png` in spacing, typography, colors, active lesson state, and timeline connector.
2. Bottom footer navigation strictly mirrors `design/vertex-lesson.png` with previous lesson button + meta on the left and next lesson meta + orange button on the right.
3. Resources cards at the bottom render 3 columns on desktop matching the design.
4. Maintain full responsiveness down to mobile viewports (collapsible drawer on mobile).

## Security Considerations
- Read tokens remain strictly server-side.
- Resource external links continue to use `rel="noopener noreferrer"`.

## Acceptance Criteria
- [ ] Sidebar matches `design/vertex-lesson.png` (flush column layout, timeline connector, active "Now playing" pill with play icon, checkmarks for completed modules).
- [ ] Bottom footer nav matches `design/vertex-lesson.png` layout and styling.
- [ ] Resources section renders clean 3-card layout matching the reference.
- [ ] Type check, lint, and build pass with zero errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000/lesson/nextjs-app-router-in-depth-caching-and-revalidation` (or any lesson in Module 5 / Lesson 5.1).
2. Inspect sidebar: verify "Back to course" link, course banner, Module 5 active state with timeline and orange play button, and checkmarks on previous modules.
3. Inspect bottom of the page: verify Pro Tip, 3-column Resources cards, and bottom footer navigation with Previous/Next buttons.
4. Verify responsive mobile layout.
