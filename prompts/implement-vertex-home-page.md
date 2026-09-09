# Implementation Prompt: Vertex Home Page

## Goal
Implement the Vertex Home Page (`/`) matching the reference design in `design/vertex-home.png`. The page serves as the entry point to the Vertex AI-powered learning platform, featuring the main navigation, hero banner with plain English search entry point, featured courses grid, and brand aesthetic elements.

---

## Skills Read & References
- `AGENTS.md` (Project overview, UI fidelity requirements, design tokens, server/client boundaries)
- `design/vertex-home.png` (Source of truth for desktop UI layout, typography, colors, components, and spacing)
- `sanity-best-practices` (.agents/skills/sanity-best-practices/SKILL.md)
- `clerk-nextjs-patterns` (.agents/skills/clerk-nextjs-patterns/SKILL.md)
- `seo-aeo-best-practices` (.agents/skills/seo-aeo-best-practices/SKILL.md)

---

## Code & Config Inspected
- `app/layout.tsx`: Configures `Inter` (sans) and `Playfair_Display` (serif) Google fonts.
- `app/globals.css`: Tailwind CSS v4 design tokens (`--color-primary-*`, `--color-neutral-*`, typography, radius, shadows).
- `components/ui/navigation.tsx`: Header navigation components.
- `components/ui/cards.tsx`: `CourseCard` component with metadata icons (level, duration, modules count).
- `components/ui/icons.tsx`: Vertex logo, search icon, bell icon, clock, chart, layers.
- `components/ui/button.tsx`: Button variants (Primary, Secondary, Tertiary, Text).

---

## Decisions and Assumptions

1. **Header / Navbar Component**:
   - Left: `VertexWordmark` (Orange geometric V logo + "Vertex" in serif typography).
   - Center/Left: Navigation links (`Courses`, `My Learning`) with clean typography and hover transitions.
   - Right: Notification bell icon with hover state, and a circular user profile avatar with border matching the reference screenshot.
   - Header is integrated cleanly at the top with responsive padding and alignment.

2. **Hero Section**:
   - **Badge**: `INTELLIGENT LEARNING` in small bold uppercase tracking with warm orange background (`bg-[#FFEEE5] text-[#C2410C] border border-[#FED7AA]/60`).
   - **Headline**: `Search your learning in plain English.` using `Playfair Display` serif font, bold weight, centered, with high typographic fidelity.
   - **Subtitle**: `Vertex understands what you want to learn and finds the exact lessons across all your courses.` in `text-neutral-500`.
   - **CTA Button**: `Explore Courses →` with orange gradient/solid fill (`#F97316` / `#EA580C`), subtle shadow, and arrow indicator.
   - **Search Bar Input**:
     - Large rounded container (`rounded-2xl`, white background, subtle border `#E2E8F0`, shadow-sm, focus ring `#FB923C`).
     - Search icon (`SearchIcon`) on the left in neutral-500.
     - Placeholder text: `Ask anything about your learning...`.
     - Right keyboard shortcut pill: `⌘ K` in subtle border and muted typography.
     - Interactive form that navigates or triggers search experience.

3. **All Courses Section**:
   - **Section Header**:
     - Left: `All Courses` in serif heading (`Playfair Display`, text-neutral-900, semibold).
     - Right: `View all courses →` text link in brand orange (`#F97316`) with right arrow icon.
   - **Course Cards Grid** (3 columns on desktop, responsive stack on mobile/tablet):
     1. **Next.js for Production**:
        - Icon: Next.js 'N' logo (dark rounded square with crisp N mark).
        - Description: "Build scalable, high-performance web applications with Next.js."
        - Metadata: Intermediate • 18h 24m • 12 modules.
     2. **Docker Essentials**:
        - Icon: Docker whale logo (cyan/blue whale with container blocks SVG).
        - Description: "Containerize applications and streamline your development workflow."
        - Metadata: Beginner • 10h 12m • 8 modules.
     3. **TypeScript Deep Dive**:
        - Icon: TypeScript 'TS' logo (blue rounded square with white TS mark).
        - Description: "Go beyond the basics and write safer, more expressive code."
        - Metadata: Intermediate • 14h 36m • 10 modules.
   - Each card has smooth hover elevation, border highlight, and metadata icons (Chart, Clock, Layers).

4. **Weekly Updates Note**:
   - Centered banner with horizontal rule dividers:
   - Outline star icon (`StarIcon` in orange `#F97316`) + `New courses and lessons added every week.` in `text-neutral-500`.

5. **Atmospheric Bottom Visual Graphic**:
   - Render the rising multi-column orange gradient bar illustration along the bottom edge matching `vertex-home.png` using modern SVG/CSS gradient columns with smooth opacity fading.

6. **Responsiveness**:
   - Desktop matches `vertex-home.png` pixel-for-pixel.
   - Adapts cleanly to tablet and mobile screens (cards grid becomes single/double column, header collapses gracefully, hero search bar remains accessible).

---

## Files to Touch / Create
- `components/ui/icons.tsx`: Add `DockerLogo`, `TypeScriptLogo`, `NextJsLogo`, `StarIcon`, and refine icon strokes if needed.
- `components/ui/cards.tsx`: Enhance `CourseCard` to support custom brand logos and exact spacing from the home page design.
- `app/page.tsx`: Implement the full Vertex home page matching `design/vertex-home.png`.
- `app/layout.tsx`: Ensure metadata and font variables are properly configured.

---

## Security Considerations
- Pure presentation and client routing; no private tokens or API keys exposed on the client.
- Input sanitation and safe URL routing.

---

## Acceptance Criteria
- [ ] Desktop layout reproduces `design/vertex-home.png` exactly: header, hero, search bar, courses grid, star banner, and bottom graphic.
- [ ] Typography uses Google Fonts `Playfair Display` for serif headings and `Inter` for body/ui elements.
- [ ] Brand colors (`#F97316`, `#FFEEE5`, `#FED7AA`, `#0F172A`, `#64748B`, `#E2E8F0`, `#FAFAFC`) match the design system specs.
- [ ] Course cards have correct icons (Next.js, Docker, TypeScript), text, and metadata badges.
- [ ] Search input renders with search icon and `⌘ K` keyboard shortcut badge.
- [ ] Layout is responsive across mobile, tablet, and desktop viewports.
- [ ] TypeScript check passes with zero errors (`npx tsc --noEmit`).
- [ ] ESLint passes cleanly (`npm run lint`).
- [ ] Next.js build passes (`npm run build`).

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Compare the rendered page with `design/vertex-home.png`:
   - Check header alignment, logo, nav links, bell icon, and avatar.
   - Check hero badge "INTELLIGENT LEARNING", display title, subtitle, and "Explore Courses →" button.
   - Test search bar focus state and verify `⌘ K` badge appearance.
   - Verify the 3 course cards match the titles, descriptions, icons, and metadata tags.
   - Verify the "New courses and lessons added every week." star divider banner.
   - Verify the bottom ambient gradient graphic.
3. Test responsiveness on mobile and tablet viewport widths.
