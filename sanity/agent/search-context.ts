/**
 * Sanity Context MCP & Agent Configuration for Vertex Intelligent Search.
 * Formulated per dial-your-context and shape-your-agent skills, and AGENTS.md guidelines.
 */

export const SANITY_CONTEXT_SLUG = 'vertex-search'

/**
 * Content Scope Filter (groqFilter)
 * Scopes accessible documents strictly to content types, excluding drafts and internal app state.
 */
export const SANITY_CONTEXT_GROQ_FILTER = `_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))`

/**
 * Sanity Context Instructions (Pure Deltas)
 * Injected as ## Custom instructions into the MCP instructions blob.
 * Contains only non-obvious schema nuances, reference chains, and query patterns.
 */
export const SANITY_CONTEXT_INSTRUCTIONS = `
### Rules
- Always filter drafts: \`!(_id in path("drafts.**"))\`.
- Never return an entire video transcript or full \`chunks\` array wholesale; project only filtered matching chunks to avoid token context overflow.
- All search results must be strictly grounded in authentic dataset documents. Never invent courses, lessons, durations, prices, or timestamps.

### Schema & Structural Notes
- **Course & Module Structure**: \`course.modules\` is an embedded array of objects (not standalone documents). Each module contains \`title\`, \`summary\`, and an array of lesson references \`lessons[]->\`. Module numbers (e.g., Module 1) and lesson numbers (e.g., Lesson 1.2) are derived from array ordering, not stored.
- **Reverse Lesson Lookup**: \`lesson\` documents do not store their parent course. To find the course and module for a lesson, use a reverse reference query: \`*[_type == "course" && references($lessonId)][0]\`.
- **Portable Text Fields**: \`lesson.notes\` and \`instructor.bio\` are Portable Text blocks. Use \`pt::text(notes)\` or \`pt::text(bio)\` for plain text matching and summary extraction.
- **Video Intelligence Lookup**: \`video\` documents are internal intelligence lookups keyed by \`url\` matching \`lesson.videoUrl\`. Never return raw \`video\` documents as standalone search results; always associate them with the parent \`lesson\`.
- **Two-Stage Timestamp Resolution**:
  1. Match \`video.chapters\` (Table of Contents \`{ startSeconds, label }\`) first for clean topic timestamps.
  2. Fall back to \`video.chunks\` (Spoken transcript \`{ startSeconds, text }\`) only if no chapter matches.
  3. Video playback seek links must target \`/lesson/[slug]?start=[seconds]\`.

### Query Patterns
- **Lesson Topic Match**:
  \`*[_type == "lesson" && !(_id in path("drafts.**")) && (title match $keyword || pt::text(notes) match $keyword || keyPoints[] match $keyword)]\`
- **Two-Stage Video Moment Match**:
  \`*[_type == "video" && !(_id in path("drafts.**")) && (chapters[].label match $keyword || chunks[].text match $keyword)]{ _id, url, duration, "matchedChapters": chapters[label match $keyword], "matchedChunks": chunks[text match $keyword][0..3] }\`
- **Course with Resolved Modules and Lessons**:
  \`*[_type == "course" && !(_id in path("drafts.**"))]{ _id, title, slug, icon, modules[]{ title, summary, lessons[]->{ _id, title, slug, videoUrl, duration, keyPoints, "notesText": pt::text(notes) } } }\`
`.trim()

/**
 * Search Agent System Prompt
 * Defines role, voice, guardrails, and query ranking policy for the search agent.
 */
export const SEARCH_AGENT_SYSTEM_PROMPT = `
You are the search and discovery intelligence engine for Vertex, a modern AI-powered video learning platform for software engineers.

## Voice & Style
- Grounded, structured, and precise.
- Return structured search result cards (video moments and lessons), never conversational prose, chat greetings, or narrative chatter.
- Prioritize high-specificity matches (exact concept/title matches outrank broad keyword mentions).

## Output Structure
Return search results containing:
1. **Video Results**: Lesson video moments matching a specific topic. Must include course title, course icon, lesson title, lesson slug, module label (e.g. "Lesson 5.1 · Data Fetching"), exact start timestamp in seconds, formatted start time (MM:SS), and clip summary.
2. **Lesson Results**: Comprehensive lessons matching the topic. Must include course title, lesson title, lesson slug, module label, summary, and key points list.

## Boundaries & Grounding Rules
- Ground every result in verified Sanity dataset content. Never hallucinate or invent courses, lessons, timestamps, or URLs.
- Two-Stage Timestamp Resolution: Always match authored video chapters first. Only fall back to transcript chunks if no chapter matches.
- Never expose internal video documents as standalone results. A video match must always resolve to its parent lesson.
- When no relevant results exist, return an empty result list with a count of 0 so the UI displays the full catalog fallback.
`.trim()
