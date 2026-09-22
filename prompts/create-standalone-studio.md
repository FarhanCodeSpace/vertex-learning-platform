# Implementation Prompt: Create Standalone Sanity Studio (`/studio`)

## Goal
Create a standalone Sanity Studio workspace in `studio/` as mandated by `AGENTS.md` Section 5 and Sanity best practices (`project-structure.md` and `nextjs.md`). This decouples the Studio from the Next.js App Router, enabling independent deploys, Vite-powered dev server and builds, auto-updates, and TypeGen workflows.

---

## Skills Read & References
- `AGENTS.md` (Sections 4, 5, 6, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `references/project-structure.md` (Standalone Studio and monorepo patterns)
- `references/nextjs.md` (Standalone Studio setup and migration from embedded Studio)

---

## Code & Config Inspected
- `app/studio/[[...tool]]/page.tsx`: Embedded Studio page in Next.js (legacy approach).
- `sanity.config.ts` & `sanity.cli.ts`: Root configuration files.
- `sanity/schemaTypes/`: The Sanity content schemas created for Vertex (`course`, `lesson`, `instructor`, `category`, `module`, `learningOutcome`, `resource`, `blockContent`).
- `sanity/structure.ts`: Desk structure.
- `package.json`: Root Next.js package.json.

---

## Decisions and Assumptions

1. **Standalone Studio Structure in `studio/`**:
   - `studio/package.json`: Independent package containing `sanity`, `@sanity/vision`, `styled-components`, `react`, `react-dom`, and TypeScript. Includes scripts for `dev`, `build`, `start`, `deploy`, and `typegen`.
   - `studio/sanity.config.ts`: Configures the Studio with `projectId`, `dataset`, schema types, desk structure, and Vision plugin.
   - `studio/sanity.cli.ts`: Defines CLI configuration with `projectId`, `dataset`, and TypeGen path mapping.
   - `studio/structure.ts`: Studio desk structure with dedicated navigation groups for Courses, Lessons, Instructors, and Categories.
   - `studio/schemaTypes/`: Schema definitions organized cleanly:
     - `course.ts`
     - `lesson.ts`
     - `instructor.ts`
     - `category.ts`
     - `module.ts`
     - `objects/blockContent.ts`
     - `objects/learningOutcome.ts`
     - `objects/resource.ts`
     - `index.ts`
   - `studio/tsconfig.json`: TypeScript configuration for the standalone Studio.
   - `studio/.gitignore`: Excludes `node_modules`, `dist`, and environment files.

2. **Decoupling from Next.js**:
   - Remove the embedded route `app/studio/[[...tool]]/page.tsx` from Next.js to ensure no build interference and clean separation of concerns.
   - Root Next.js application retains its server-side read client and data layer in `sanity/lib/` and `sanity/types.ts`.
   - Add convenience scripts to root `package.json` (e.g. `"studio:dev"`, `"studio:build"`) for streamlined local development.

---

## Files to Touch / Create
- [NEW] `studio/package.json`: Standalone studio package dependencies and scripts.
- [NEW] `studio/tsconfig.json`: TypeScript configuration.
- [NEW] `studio/sanity.config.ts`: Standalone Studio configuration.
- [NEW] `studio/sanity.cli.ts`: CLI and TypeGen configuration.
- [NEW] `studio/structure.ts`: Desk structure resolver.
- [NEW] `studio/schemaTypes/index.ts`: Schema registry.
- [NEW] `studio/schemaTypes/course.ts`: Course schema.
- [NEW] `studio/schemaTypes/lesson.ts`: Lesson schema.
- [NEW] `studio/schemaTypes/instructor.ts`: Instructor schema.
- [NEW] `studio/schemaTypes/category.ts`: Category schema.
- [NEW] `studio/schemaTypes/module.ts`: Embedded module schema.
- [NEW] `studio/schemaTypes/objects/learningOutcome.ts`: Learning outcome schema.
- [NEW] `studio/schemaTypes/objects/resource.ts`: Resource schema.
- [NEW] `studio/schemaTypes/objects/blockContent.ts`: Portable text block schema.
- [NEW] `studio/.gitignore`: Studio gitignore.
- [DELETE] `app/studio/[[...tool]]/page.tsx`: Remove embedded Next.js route.
- [MODIFY] `package.json`: Add studio helper scripts.

---

## Requirements
- Standalone Studio workspace must have its own isolated dependencies and run on Vite (`sanity dev`).
- Content model in `studio/schemaTypes` must match all Vertex schema requirements from `AGENTS.md` Section 8.
- Next.js application builds cleanly without the embedded studio route.
- TypeScript checks and linters pass cleanly.

---

## Security Considerations
- Studio uses public project ID and dataset; sensitive write tokens or server keys remain strictly on the Next.js server or environment.
- Independent Studio deploy allows locking down Studio access separately from the frontend.

---

## Acceptance Criteria
- [ ] `studio/` folder contains a complete standalone Sanity Studio application.
- [ ] Standalone Studio configuration and all schema types (`course`, `lesson`, `instructor`, `category`, `module`, etc.) are in place.
- [ ] Embedded studio route `app/studio/` is removed from Next.js.
- [ ] Next.js type check (`npx tsc --noEmit`), lint (`npm run lint`), and build (`npm run build`) pass cleanly.

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Navigate into `studio/` and run `npm install` (or verify dependencies).
2. Run `npm run dev` in `studio/` (starts Vite-based Studio on `http://localhost:3333`).
3. Verify Studio opens, displays Vertex content structure, and allows creating/editing courses, lessons, instructors, and categories.
4. Run Next.js `npm run dev` on `http://localhost:3000` and verify the web app functions independently.
