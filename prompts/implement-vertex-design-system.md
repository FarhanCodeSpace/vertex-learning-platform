# Implementation Prompt: Vertex Design System

## Goal
Implement the comprehensive Vertex Design System in the Next.js workspace as specified in `design/vertex-designsystem.png`. This includes configuring Tailwind CSS v4 design tokens (colors, typography with Google Fonts `Playfair Display` and `Inter`, spacing, radii, shadows), building reusable, accessible UI components (buttons, inputs, select, badges, status indicators, progress bars, cards, navigation, breadcrumbs, pagination, icons), and creating an interactive showcase page on `/` (or `/design-system`) demonstrating all design system elements in high fidelity.

---

## Skills Read & References
- `AGENTS.md` (Project rules, Tech stack, Server/Client boundaries, UI fidelity rules)
- `design/vertex-designsystem.png` (Source of truth for design tokens, typography, spacing, radius, shadows, icons, buttons, inputs, badges, status indicators, progress bar, cards, navigation, and principles)
- Next.js App Router and Tailwind CSS v4 documentation

---

## Code & Config Inspected
- `package.json`: Next.js 16.3.4, React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss`). `lucide-react` or SVG icon primitives.
- `app/globals.css`: Tailwind v4 setup with `@import "tailwindcss";` and `@theme inline`.
- `app/layout.tsx`: Root layout currently loading `Geist` fonts; will update to load `Inter` and `Playfair_Display` via `next/font/google`.
- `app/page.tsx`: Boilerplate Next.js starter page to be replaced with the Design System showcase.

---

## Decisions and Assumptions
1. **Design Tokens via Tailwind CSS v4 `@theme`**:
   - **Primary Palette**:
     - `primary-500`: `#F97316` (Base brand orange)
     - `primary-400`: `#FB923C`
     - `primary-300`: `#FDBA74`
     - `primary-200`: `#FED7AA`
     - `primary-100`: `#FFEEE5`
   - **Neutral Palette**:
     - `neutral-900`: `#0F172A`
     - `neutral-700`: `#334155`
     - `neutral-500`: `#64748B`
     - `neutral-300`: `#CBD5E1`
     - `neutral-200`: `#E2E8F0`
     - `neutral-100`: `#F1F5F9`
     - `neutral-50`: `#FAFAFC`
     - `white`: `#FFFFFF`
   - **Custom Shadows**:
     - `sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
     - `md`: `0 4px 12px -2px rgba(15, 23, 42, 0.08)`
     - `lg`: `0 12px 24px -4px rgba(15, 23, 42, 0.10)`
     - `xl`: `0 20px 40px -8px rgba(15, 23, 42, 0.12)`
   - **Border Radius**:
     - `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px), `full` (9999px)
   - **Typography**:
     - Serif: `Playfair Display` (Display 1: 48/56 Bold, Display 2: 36/44 Bold)
     - Sans: `Inter` (Heading 1: 28/36 SemiBold, Heading 2: 22/30 SemiBold, Heading 3: 18/26 Medium, Body Large: 16/24 Regular, Body: 14/20 Regular, Small: 12/16 Regular)

2. **Component Architecture**:
   Create modular, reusable UI components in `components/ui/` with TypeScript types:
   - `Button`: Primary, Secondary, Tertiary, Text variants with Default, Hover, and Disabled states.
   - `Input`: Search / text field with prefix icon, keyboard shortcut badge (`⌘K`), focus ring in `#FB923C`.
   - `Select`: Dropdown field with chevron indicator and border styling.
   - `Badge`: Video, Lesson, Popular tags with pill styling.
   - `StatusIndicator`: In Progress (orange ring), Completed (green checkmark), Now Playing (orange play), Locked (slate lock).
   - `ProgressBar`: 8px height, rounded full, neutral background with animated/static primary fill and percentage label.
   - `Cards`:
     - `CourseCard`: Icon mark, title, description, metadata badges (difficulty, duration, module count).
     - `LessonVideoCard`: Video badge, title, description, lesson index, duration, "Watch from [time]" action.
     - `LessonCard`: Lesson badge, title, description, module indicator, "View lesson ↗" action.
     - `ResourceCard`: Document icon, title, description, file type & size, external link icon.
   - `Navigation & Breadcrumbs`: Vertex logo mark + typography, navigation links, breadcrumbs with chevron separators.
   - `Pagination`: Page numbering, active state pill with orange border, prev/next arrows.
   - `Icons`: Consistent 24x24 outline & filled SVG icon library matching the design specs.

3. **Showcase Page (`app/page.tsx`)**:
   - Provide a faithful, pixel-precise recreation of the `vertex-designsystem.png` layout and components, rendering all 14 sections (Colors, Typography, Type Scale, Spacing, Radius & Shadows, Icons, Buttons, Inputs, Badges, Status Indicators, Progress Bar, Cards, Navigation, Principles).
   - Add responsive container wrapping to ensure it scales down smoothly on smaller viewports.

---

## Files to Touch / Create
- `package.json`: Install `lucide-react` (if needed for supplemental icon helpers) or provide native crisp SVG icons.
- `app/layout.tsx`: Configure `Inter` and `Playfair_Display` Google fonts with CSS variable classes.
- `app/globals.css`: Define Tailwind CSS v4 design tokens, color variables, typography variables, utility classes, and custom shadows.
- `components/ui/button.tsx`: Button component variants and states.
- `components/ui/input.tsx`: Search / Text input with icon and shortcut support.
- `components/ui/select.tsx`: Custom select input matching design specifications.
- `components/ui/badge.tsx`: Video, Lesson, Popular badge components.
- `components/ui/status-indicator.tsx`: Status indicator badges/icons.
- `components/ui/progress-bar.tsx`: Progress bar component.
- `components/ui/cards.tsx`: CourseCard, LessonVideoCard, LessonCard, ResourceCard components.
- `components/ui/navigation.tsx`: Header navigation, Breadcrumbs, Pagination components.
- `components/ui/icons.tsx`: Vertex logomark and UI icons (outline and filled).
- `app/page.tsx`: Interactive, high-fidelity Design System showcase rendering all 14 sections.

---

## Security Considerations
- Client/Server separation: All presentational components are pure React components without sensitive keys or private access tokens.
- No direct exposure of tokens or client-side secrets.

---

## Acceptance Criteria
- [ ] Tailwind CSS v4 theme accurately represents all colors (Primary 100–500, Neutral 50–900), shadows (sm, md, lg, xl), radius (xs to xl, full), and font families.
- [ ] Google Fonts (`Playfair Display` and `Inter`) load cleanly with zero layout shift.
- [ ] All 14 sections from `design/vertex-designsystem.png` are represented faithfully with correct styles, spacing, typography, colors, and states:
  - 01 Colors swatch grid with hex codes and names
  - 02 Typography & 03 Type Scale with live rendered examples and spec table
  - 04 Spacing System visual scale
  - 05 Radius & Shadows cards
  - 06 Icons (Outline and Filled) with 24x24px 2px stroke specs
  - 07 Buttons (Primary, Secondary, Tertiary, Text in Default, Hover, Disabled states)
  - 08 Inputs (Search input with ⌘K, Select dropdown)
  - 09 Badges / Tags (Video, Lesson, Popular)
  - 10 Status / Indicators (In Progress, Completed, Now Playing, Locked)
  - 11 Progress Bar (with 35% complete status)
  - 12 Cards (Course Card, Lesson Video Card, Lesson Card, Resource Card)
  - 13 Navigation, Breadcrumbs & Pagination
  - 14 Principles cards with icons
- [ ] Zero TypeScript errors (`npm run build` or `npx tsc --noEmit`).
- [ ] ESLint passes cleanly (`npm run lint`).
- [ ] Responsive design functions down to mobile viewport widths while keeping the desktop presentation exact.

---

## Checks to Run
- `npm run lint` (ESLint)
- `npx tsc --noEmit` (TypeScript type check)
- `npm run build` (Next.js production build)

---

## Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Verify visual fidelity against `design/vertex-designsystem.png`:
   - Inspect color swatches and verify exact hex codes match.
   - Verify font weights and styles for Playfair Display and Inter.
   - Test button hover states and disabled states.
   - Test input focus ring styling (`#FB923C`).
   - Verify all 4 card styles (Course, Lesson Video, Lesson, Resource) match typography, icons, borders, and actions.
   - Test navigation, breadcrumbs, and pagination controls.
3. Test responsive layout by resizing browser window to tablet and mobile widths.
