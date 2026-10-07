# Tune Search Context Document and System Prompt

## Goal
Configure and tune the intelligent search experience for Vertex by writing the Sanity Context document's content scope filter (`groqFilter`) and instructions (`instructions`) following `dial-your-context`, and shaping the search system prompt following `shape-your-agent` and `AGENTS.md` guidelines.

## Skills Read
- `AGENTS.md` (Sections 7, 8, 10, 11, 12)
- `dial-your-context` (`c:\Appzy\vertex\.agents\skills\dial-your-context\SKILL.md`)
- `shape-your-agent` (`c:\Appzy\vertex\.agents\skills\shape-your-agent\SKILL.md`)
- `create-agent-with-sanity-context` (`c:\Appzy\vertex\.agents\skills\create-agent-with-sanity-context\SKILL.md`)
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)

## Code and Config Inspected
- `sanity/schemaTypes/`: Schema models for `course`, `lesson`, `video`, `instructor`, `category`, and `module`.
- `sanity/lib/search.ts`: Current search resolver, two-stage timestamp resolution (chapters -> transcript chunks), and scoring logic.
- `app/api/search/route.ts`: API route handling search requests, validation, and PostHog telemetry.
- `studio/sanity.config.ts`: Sanity Studio configuration.
- `sanity/env.ts` & `.env.local`: Project ID, dataset, tokens, and endpoints.

## Decisions and Assumptions
1. **Sanity Context Document (`sanity.agentContext`) Scope Filter (`groqFilter`)**:
   - Scope only relevant published content documents to eliminate internal noise, drafts, and system documents:
     ```groq
     _type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))
     ```
   - Exclude draft objects, user progress, and system metadata.

2. **Sanity Context Document Instructions (`instructions`)**:
   - Focus strictly on pure deltas that the schema does not reveal:
     - **Structure & Relationships**: `course` contains embedded `modules[]` objects which contain references `lessons[]->`. `lesson` does not contain a reverse reference to course, so query courses referencing the lesson `*[_type == "course" && references($lessonId)]`.
     - **Portable Text**: `lesson.notes` and `instructor.bio` are Portable Text arrays; must use `pt::text(notes)` for text matching and projections.
     - **Internal Video Intelligence**: `video` documents are internal lookup indices keyed by `url` matching `lesson.videoUrl`. Never return `video` documents directly as standalone search results; tie them to their parent lesson.
     - **Two-Stage Timestamp Resolution**: Match `video.chapters` (table of contents) first for clean chapter timestamps. Only if no chapter matches, fall back to matching `video.chunks` (spoken transcript text).
     - **Context Window Protection**: Never project or return the entire `chunks` array in GROQ results. Return only filtered, matched chunks (e.g. `chunks[text match $keyword][0..2]`).
     - **Grounding Rule**: Never invent courses, lessons, prices, durations, or timestamps. Every result must resolve to an authentic lesson with a valid slug and timestamp.

3. **Search System Prompt (`systemPrompt`)**:
   - Formulate a concise, high-adherence system prompt following `shape-your-agent` and `AGENTS.md` (Sections 10-12):
     - **Role**: Search and discovery intelligence engine for Vertex learning platform.
     - **Voice**: Grounded, structured, concise. Surface ranked video moment cards and lesson cards, not conversational chatbot prose.
     - **Boundaries**: Strictly adhere to real Sanity data. If no matching content is found, return empty results with count 0 so UI displays catalog fallback.
     - **Redundancy & Reliability**: Per `AGENTS.md` section 11 & 12, embed the critical query, two-stage timestamp resolution, and ranking rules in both the inline system prompt and the Sanity Context document because the model adheres to the system prompt most reliably.

4. **Integration & Persistence**:
   - Create a dedicated agent context configuration module `sanity/agent/search-context.ts` exporting:
     - The `GROQ_FILTER`
     - The `INSTRUCTIONS`
     - The `SYSTEM_PROMPT`
     - The Sanity Context document definition and seed script to create/update the `sanity.agentContext` document in Sanity via client mutation or API.
   - Connect the system prompt and instructions into the search pipeline and API route.

## Files Expected to Touch
- `prompts/tune-search-context-and-system-prompt.md` (This implementation prompt)
- `sanity/agent/search-context.ts` (Context document definitions, instructions, and system prompt)
- `sanity/agent/index.ts` (Agent configuration and client exports)
- `scripts/seed-context-doc.ts` (Script to deploy/seed the Sanity Context document)
- `sanity/lib/search.ts` (Integrate context prompt rules and validation)
- `app/api/search/route.ts` (Search route integration)

## Requirements
1. The Context document content scope filter strictly allows only `course`, `lesson`, `video`, `instructor`, and `category` (excluding drafts).
2. The Instructions provide clean, high-leverage deltas without repeating schema basics or GROQ tutorials.
3. The System Prompt enforces grounded results, two-stage timestamp resolution (chapters first, transcript fallback), structured card output, and zero hallucination.
4. Critical rules are mirrored across the inline system prompt and Sanity Context document.
5. All TypeScript compilation, linting, and builds pass.

## Security Considerations
- `SANITY_API_READ_TOKEN` and any AI provider API keys remain server-side only.
- Content scope filter prevents access to unreleased drafts and internal documents.
- Prompt injection protection by enforcing strict output schema validation.

## Acceptance Criteria
- [ ] `sanity/agent/search-context.ts` defines `GROQ_FILTER`, `INSTRUCTIONS`, and `SYSTEM_PROMPT` meeting all requirements.
- [ ] Script to seed/deploy the Context document `sanity.agentContext` to the Sanity dataset is provided.
- [ ] Search API and query layer adhere to the tuned instructions and system prompt.
- [ ] Type check `npx tsc --noEmit` passes with zero errors.
- [ ] Lint `npm run lint` passes with zero errors.
- [ ] Build `npm run build` succeeds.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Run the context document seed script: `npx tsx scripts/seed-context-doc.ts`.
2. Inspect the created/updated Sanity Context document in Sanity Studio or via GROQ: `*[_type == "sanity.agentContext"]`.
3. Start the dev server: `npm run dev`.
4. Test queries on `/search?q=data+fetching` and `/search?q=server+components` to verify video moments and lesson matches are grounded with precise timestamps.
5. Verify an ungrounded/unknown query returns empty results without inventing false lessons.
