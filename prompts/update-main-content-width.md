# Implementation Prompt: Update Main Content Width to 1440px

## Goal
Adjust the main container and layout sections across the Vertex Home Page (`app/page.tsx`) so that the main content max-width takes about 1440px (`max-w-[1440px]`), providing a spacious, well-aligned desktop layout matching 1440px viewport specifications.

---

## Skills Read & References
- `AGENTS.md` (Workflow loop, UI reproduction rules, responsive adaptability)
- `design/vertex-home.png` (Desktop layout reference)

---

## Code & Config Inspected
- `app/page.tsx`: Contains `<header>`, `<main>`, `<section id="all-courses-section">`, and bottom glow bars container. Currently using `max-w-[1280px]` and `max-w-[1240px]`.

---

## Decisions and Assumptions
1. **Container Widths**:
   - Update the top navigation header container from `max-w-[1280px]` to `max-w-[1440px]`.
   - Update the "All Courses" section container from `max-w-[1240px]` to `max-w-[1440px]`.
   - Ensure the bottom ambient glow bars graphic container is aligned with `max-w-[1440px]`.
   - Keep responsive padding (`px-6 sm:px-8 lg:px-12`) so content scales smoothly on all viewport sizes down to mobile.
2. **Hero Centering & Proportions**:
   - Maintain the centered hero layout with optimal line wrapping and maximum readability while allowing the parent canvas to expand up to 1440px.

---

## Files to Touch / Create
- `app/page.tsx`: Update container max-width utility classes to `max-w-[1440px]`.

---

## Security Considerations
- Pure presentational and styling adjustments; no security or data access impact.

---

## Acceptance Criteria
- [ ] Header container max-width is set to `max-w-[1440px]`.
- [ ] All Courses section container max-width is set to `max-w-[1440px]`.
- [ ] Bottom ambient graphic max-width is set to `max-w-[1440px]`.
- [ ] Responsive behavior remains intact across tablet and mobile viewports.
- [ ] Type check and lint pass with 0 errors.
- [ ] Next.js build succeeds.

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Run `npm run dev` and open `http://localhost:3000`.
2. Inspect the page on a 1440px+ viewport and verify header and course grid span smoothly up to 1440px.
3. Verify cards grid spacing and padding adapt cleanly.
