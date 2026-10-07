# Implementation Prompt: Two-Stage Timestamp Resolution Search and On-Site Video Playback

## Goal
Upgrade the search engine with strict two-stage timestamp resolution (chapters/table-of-contents first, transcript chunks fallback) and provide seamless on-site timestamped playback where search result cards deep link to the lesson page at the matched second and the embedded player seeks directly to that timestamp.

## Skills Consulted
- `AGENTS.md` (Sections 1, 2, 7, 8, 9, 11, 12, 13)
- `create-agent-with-sanity-context` (`c:\Appzy\vertex\.agents\skills\create-agent-with-sanity-context\SKILL.md`)
- `dial-your-context` (`c:\Appzy\vertex\.agents\skills\dial-your-context\SKILL.md`)
- `shape-your-agent` (`c:\Appzy\vertex\.agents\skills\shape-your-agent\SKILL.md`)
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)

## Code and Config Inspected
- `sanity/lib/search.ts`: Core search engine executing GROQ queries across courses, lessons, and video intelligence documents (`video` schema with `chapters` and `chunks`).
- `lib/video.ts`: Video embed parsing, provider identification (YouTube, Vimeo, Bunny), start seconds parsing, and embed URL constructor with timestamp parameters.
- `components/lesson/lesson-player.tsx`: Lesson video player component handling iframe provider embeds, autoplay on deep-link timestamps, and watch depth analytics.
- `app/lesson/[slug]/page.tsx`: Lesson server page reading URL query parameters (`?start=`, `?t=`, `?startSeconds=`) and passing parsed `startSeconds` to `LessonPlayer`.
- `components/search/video-result-card.tsx`: Video result card rendering thumbnail, duration, course metadata, title, snippet, and `Watch from MM:SS →` link.
- `components/search/search-results-client.tsx`: Search results layout, sort options, empty state, and PostHog analytics tracking.

## Decisions and Assumptions
1. **Two-Stage Timestamp Resolution**:
   - **Stage 1 (Chapters / Table of Contents)**: Evaluate the video document's `chapters` array (`{ startSeconds, label }`). If any chapter label matches query tokens with high confidence, select the highest-scoring chapter match.
   - **Stage 2 (Transcript Chunks Fallback)**: Only when no chapter matches the query, search through the video document's `chunks` array (`{ startSeconds, text }`). Select the best-matching transcript chunk.
   - **Real Grounded Data**: In adherence to Section 7 & 11 ("Never invent a course, lesson, price, duration, or timestamp"), video results are strictly grounded in real video intelligence timestamps (`startSeconds` from chapters or transcript chunks). We will never generate fabricated offsets.
2. **Rank & Specificity**:
   - Rank results by relevance specificity: exact title/chapter phrase matches score highest, token matches weighted next, and broad notes/transcripts weighted as backstops.
   - Merge both lesson cards (topic matches) and video moment cards (timestamped moments).
3. **On-Site Timestamped Playback**:
   - Result card links directly to `/lesson/[slug]?start=[startSeconds]`.
   - `lib/video.ts` will format embed URLs with provider-native start parameters and autoplay enabled:
     - **YouTube**: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${origin}&start=${startSeconds}`
     - **Vimeo**: `https://player.vimeo.com/video/${videoId}?autoplay=1&dnt=1#t=${startSeconds}s`
     - **Bunny**: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&t=${startSeconds}`
     - **Generic**: `${url}?autoplay=1&t=${startSeconds}`
   - `parseStartSeconds` in `lib/video.ts` supports standard formats: integers, `MM:SS`, `HH:MM:SS`, `120s`, `2m30s`, etc.
   - `LessonPlayer` automatically renders and activates the embed iframe when `startSeconds > 0`, firing PostHog `video_played` (with `is_resumed: true`) and `resume_used`.
4. **Security & Data Isolation**:
   - Dataset reads remain server-side. No private tokens are exposed to client components.
   - URL inputs are sanitized and validated with Zod in the search API route.

## Files Expected to Touch / Verify
- `prompts/two-stage-timestamp-search-and-playback.md` (Implementation prompt)
- `sanity/lib/search.ts` (Implement strict 2-stage resolution: chapters first, transcript fallback, grounded timestamps)
- `lib/video.ts` (Provider embed URL builder with autoplay and exact timestamp parameterization)
- `components/lesson/lesson-player.tsx` (Seamless timestamp autoplay, milestone tracking, and embed rendering)
- `components/search/video-result-card.tsx` (Accurate deep-link URL formatting and timestamp display)
- `app/lesson/[slug]/page.tsx` (Query param parsing and passing `startSeconds`)

## Requirements & Acceptance Criteria
- [ ] Two-stage timestamp resolution: When chapters match, chapter timestamps are used; if no chapters match, transcript chunks are searched as fallback.
- [ ] No fabricated timestamps: All video result timestamps come from genuine Sanity video document data.
- [ ] Video result cards display formatted timestamps (`Watch from MM:SS →`) and link to `/lesson/[slug]?start=[seconds]`.
- [ ] Navigating to `/lesson/[slug]?start=[seconds]` loads the lesson page with the embedded player seeking directly to the specified timestamp.
- [ ] YouTube, Vimeo, and Bunny embed URLs are properly constructed with their respective provider-specific time parameters.
- [ ] PostHog analytics events (`search_performed`, `search_result_clicked`, `video_played`, `resume_used`) fire accurately with correct metadata.
- [ ] All checks (`npx tsc --noEmit`, `npm run lint`, `npm run build`) pass with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Exact Manual Test Steps
1. Run `npx tsc --noEmit` and `npm run build` to verify type safety and Next.js compilation.
2. Start the dev server with `npm run dev`.
3. Open `http://localhost:3000/search?q=server+actions`.
4. Verify video result cards display matched chapters or transcript timestamps (e.g. `Watch from 03:15 →`).
5. Click on a video result card ("Watch from 03:15 →").
6. Verify URL updates to `/lesson/[slug]?start=195`.
7. Verify the video player on the lesson page automatically embeds the player initialized at second 195.
8. Test searching for a term only in transcripts (e.g., specific code terms) and verify transcript fallback timestamp resolution.
