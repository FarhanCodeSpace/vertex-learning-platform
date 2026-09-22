# Implementation Prompt: Sanity Content Model, Studio, and Server-Side Data Layer

## Goal
Implement the comprehensive Sanity content model, Studio configuration, and server-side read client and data access layer for Vertex (Courses, Modules, Lessons, Instructors, and Categories) following `AGENTS.md` specifications and Sanity best practices.

---

## Skills Read & References
- `AGENTS.md` (Sections 5, 6, 7, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md` and reference guides)
- `content-modeling-best-practices` (`.agents/skills/content-modeling-best-practices/SKILL.md`)
- Next.js App Router and server/client boundary guidelines

---

## Code & Config Inspected
- `sanity.config.ts`: Current Studio configuration mounted at `/app/studio/[[...tool]]/page.tsx`.
- `sanity.cli.ts`: Sanity CLI configuration with project ID and dataset.
- `sanity/env.ts`: Public dataset and project ID accessors.
- `sanity/lib/client.ts`: Current default Sanity client.
- `sanity/schemaTypes/index.ts`: Empty schema definition.
- `sanity/structure.ts`: Basic desk structure.
- `.env.local`: Environment keys for dataset and project ID.

---

## Decisions and Assumptions

1. **Schema Design & Field Architecture**:
   - **`course` (Document)**:
     - `title` (string, required)
     - `slug` (slug with auto-generate from title, required)
     - `summary` (text, short marketing summary)
     - `coverImage` (image with hotspot)
     - `icon` (string or image for brand mark, e.g. Next.js, Docker, TypeScript)
     - `level` (string with options: `Beginner`, `Intermediate`, `Advanced`, `All Levels`)
     - `price` (number, default 0 for free or specific price)
     - `duration` (string, formatted e.g. "18h 24m")
     - `popular` (boolean flag for featured/popular badge)
     - `studentCount` (number for social proof display)
     - `learningOutcomes` (array of `learningOutcome` objects: `{ icon, title, description }`)
     - `instructor` (reference to `instructor`, required)
     - `category` (reference to `category`, required)
     - `modules` (ordered array of embedded `module` objects)
   - **`module` (Embedded Object)**:
     - `title` (string, required)
     - `summary` (text)
     - `lessons` (ordered array of references to `lesson`)
     - *Note*: Module and lesson numbering (e.g. "Module 5", "Lesson 5.1") is derived from order, not stored.
   - **`lesson` (Document)**:
     - `title` (string, required)
     - `slug` (slug with auto-generate from title, required)
     - `videoUrl` (url/string for YouTube, Vimeo, or Bunny video player embed)
     - `poster` (image with hotspot for lesson thumbnail)
     - `duration` (string or number for lesson duration display)
     - `freePreview` (boolean flag for free preview badge)
     - `studentCount` (number for display)
     - `notes` (portable text `blockContent` for rich lesson notes, callouts, and code)
     - `keyPoints` (array of strings for "In this lesson you will" checklist)
     - `proTip` (text for highlighted tip callout)
     - `resources` (array of `resource` objects: `{ type, title, description, url }`)
     - *Note*: Reverse reference to course will be resolved dynamically via GROQ query.
   - **`instructor` (Document)**:
     - `name` (string, required)
     - `slug` (slug with auto-generate from name, required)
     - `photo` (image with hotspot)
     - `expertise` (string, e.g., "Senior Software Architect")
     - `bio` (portable text or text for full biography)
   - **`category` (Document)**:
     - `title` (string, required)
     - `slug` (slug with auto-generate from title, required)
     - `description` (text)
   - **Supporting Objects**:
     - `blockContent` (rich text definition with headings, lists, bold/italic/links, and code blocks)
     - `learningOutcome` (icon, title, description)
     - `resource` (type enum e.g. 'github' | 'docs' | 'download' | 'link', title, description, url)

2. **Studio Structure (`sanity/structure.ts`)**:
   - Create an organized desk structure with dedicated navigation groups for Courses, Lessons, Instructors, and Categories.
   - Add preview configurations and sorting by title or creation date.

3. **Server-Side Read Client & Data Access Layer (`sanity/lib/`)**:
   - `sanity/env.ts`: Include support for `SANITY_API_READ_TOKEN` (server-side only, non-public).
   - `sanity/lib/client.ts`: Expose a safe Sanity client and a server-side client utilizing `SANITY_API_READ_TOKEN` when available to support private datasets as mandated in `AGENTS.md` Section 5 & 12.
   - `sanity/lib/fetch.ts`: Server fetch helper `sanityFetch<T>` with Next.js cache revalidation, tags, and private dataset authorization.
   - `sanity/lib/queries.ts`: High-performance GROQ queries with precise projection:
     - `coursesQuery`: Get all courses with populated instructor and category summaries.
     - `courseBySlugQuery`: Get a full course by slug with resolved instructor, category, and modules with full lesson references.
     - `lessonBySlugQuery`: Get a lesson by slug, including reverse-resolved parent course and module position, previous and next lesson links.
     - `instructorsQuery` & `instructorBySlugQuery`: Instructors list and instructor profile with their authored courses.
     - `categoriesQuery` & `categoryBySlugQuery`: Categories list and category with filtered courses.
     - `allCourseSlugsQuery` & `allLessonSlugsQuery`: For Next.js route parameter generation.
   - `sanity/types.ts`: Comprehensive TypeScript interfaces matching the GROQ query projections and content schemas.
   - `sanity/lib/api.ts`: Typed data access functions (`getCourses`, `getCourseBySlug`, `getLessonBySlug`, `getInstructors`, `getInstructorBySlug`, `getCategories`, etc.).

4. **Environment & Security**:
   - Create `.env.example` documenting all Sanity public and server-only variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`).
   - Ensure `SANITY_API_READ_TOKEN` is never prefixed with `NEXT_PUBLIC_` and remains server-only.

---

## Files to Touch / Create
- [NEW] `sanity/schemaTypes/category.ts`: Category schema definition.
- [NEW] `sanity/schemaTypes/instructor.ts`: Instructor schema definition.
- [NEW] `sanity/schemaTypes/lesson.ts`: Lesson schema definition.
- [NEW] `sanity/schemaTypes/module.ts`: Embedded module schema definition.
- [NEW] `sanity/schemaTypes/course.ts`: Course schema definition.
- [NEW] `sanity/schemaTypes/objects/learningOutcome.ts`: Learning outcome object.
- [NEW] `sanity/schemaTypes/objects/resource.ts`: Lesson resource object.
- [NEW] `sanity/schemaTypes/objects/blockContent.ts`: Portable text definition.
- [MODIFY] `sanity/schemaTypes/index.ts`: Register all schema types.
- [MODIFY] `sanity/structure.ts`: Structured desk navigation.
- [MODIFY] `sanity/env.ts`: Add read token and configuration helpers.
- [MODIFY] `sanity/lib/client.ts`: Configure server client with token support.
- [NEW] `sanity/lib/fetch.ts`: Server fetch helper with caching/tag options.
- [NEW] `sanity/lib/queries.ts`: Canonical GROQ queries.
- [NEW] `sanity/types.ts`: Complete TypeScript types for schemas and queries.
- [NEW] `sanity/lib/api.ts`: Typed data access layer functions.
- [NEW] `.env.example`: Canonical environment variable list.

---

## Requirements
- Clean, modular Sanity schema definitions using `defineType` and `defineField`.
- Adhere strictly to the data model described in `AGENTS.md` Section 8.
- Ensure reverse course lookups for lessons work smoothly via GROQ.
- Separate server-only tokens and client-safe values cleanly.
- Strict TypeScript typings for all queries and data functions.

---

## Security Considerations
- Private dataset read token (`SANITY_API_READ_TOKEN`) is strictly server-only.
- No write permissions or client-side tokens are exposed to the browser.
- Input validation on parameters passed to GROQ queries.

---

## Acceptance Criteria
- [ ] Schema types for `course`, `module`, `lesson`, `instructor`, `category`, and supporting objects are defined and exported.
- [ ] Studio desk structure (`sanity/structure.ts`) organizes content clearly.
- [ ] `sanity/schemaTypes/index.ts` loads all types with zero validation errors in Studio.
- [ ] Server fetch helper and client properly handle private datasets with `SANITY_API_READ_TOKEN`.
- [ ] Canonical GROQ queries provide clean projections for courses, course detail, lesson detail with reverse course lookup, instructors, and categories.
- [ ] TypeScript types in `sanity/types.ts` accurately model the Sanity schemas and GROQ query results.
- [ ] `.env.example` documents all required environment variables.
- [ ] TypeScript compilation (`npx tsc --noEmit`) passes with zero errors.
- [ ] Next.js lint (`npm run lint`) and build (`npm run build`) pass cleanly.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `/studio` in dev server and verify Studio loads without schema warnings or errors.
2. Inspect the Studio desk sidebar: verify Courses, Lessons, Instructors, and Categories are displayed with custom grouping.
3. Test creating mock entries in Studio or verify schema field validation.
4. Verify server data access functions and GROQ queries by executing typecheck and verifying data fetching module compilation.
