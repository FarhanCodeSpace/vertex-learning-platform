# Offline Video Ingestion Pipeline Implementation Prompt

## Goal
Implement a robust, extensible offline ingestion pipeline CLI tooling that processes video URLs (YouTube, Vimeo, Bunny, and custom sources), extracts or parses caption/transcript streams and chapter markers into timestamped chunks and table of contents, and creates/updates `video` intelligence documents in Sanity.

## Skills Read
- `AGENTS.md` (Sections 5, 8, 9, 12, 13)
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `create-agent-with-sanity-context` (`c:\Appzy\vertex\.agents\skills\create-agent-with-sanity-context\SKILL.md`)
- `portable-text-conversion` (`c:\Appzy\vertex\.agents\skills\portable-text-conversion\SKILL.md`)

## Code and Config Inspected
- `studio/schemaTypes/video.ts` & `sanity/schemaTypes/video.ts`: Schema definition with fields `id`, `url`, `title`, `duration`, `chapters: [{ startSeconds, label }]`, and `chunks: [{ startSeconds, text }]`.
- `lib/video.ts`: Provider parsing and embed generation supporting YouTube, Vimeo, Bunny, and generic providers.
- `components/lesson/lesson-player.tsx`: Embed player rendering provider-specific seek parameters (`&start=`, `#t=`, `?t=`).
- `studio/scripts/seed/seed-videos.mjs`: Initial seed script pattern for fetching lessons and generating video intelligence records.
- `sanity/lib/search.ts`: Search resolver utilizing chapters table-of-contents and transcript chunks for grounded timestamp matching.

## Decisions and Assumptions
1. **Tooling & Architecture**:
   - Build a modular offline video ingestion engine in `scripts/ingestion/`:
     - `types.ts`: TypeScript interfaces for raw transcript cues, parsed chapters, chunking options, and pipeline results.
     - `vtt-parser.ts`: Universal WebVTT / SRT / caption parser that turns raw subtitles/timecodes into structured `{ startSeconds, text }` cues.
     - `chunker.ts`: Intelligent chunker that merges short subtitle cues into coherent 15–45 second timestamped thought units without overflowing.
     - `providers/youtube.ts`: YouTube caption and chapter extractor (supporting timedtext captions, video descriptions with timestamps, and fallback authoring).
     - `providers/vimeo.ts`: Vimeo metadata and text track parser.
     - `providers/bunny.ts`: Bunny Stream caption and chapter parser.
     - `providers/fallback.ts`: Intelligent note-guided chunk and chapter synthesizer using lesson notes and key points when remote provider captions are unavailable or offline.
     - `providers/index.ts`: Provider registry and resolver.
     - `pipeline.ts`: Core orchestrator that inspects video URL, selects provider, extracts chapters & chunks, sanitizes Sanity document IDs, and batches updates.
   - Entrypoint CLI script at `scripts/ingest-videos.ts` (runnable via `npm run ingest:videos` or `npx tsx scripts/ingest-videos.ts`):
     - `--all`: Ingest all unique lesson videos from Sanity dataset.
     - `--lesson <slug>`: Ingest a specific lesson's video.
     - `--url <url>`: Ingest a standalone video URL.
     - `--file <path>`: Ingest using a local WebVTT (`.vtt`) or SRT (`.srt`) subtitle file.
     - `--dry-run`: Output parsed chapters and chunks without committing mutations to Sanity.
2. **Data & Schema Grounding**:
   - Sanity Document IDs: Keyed by sanitized video URL identifier (e.g. `video.v_<cleanId>`) stripping any characters the datastore rejects (`[^a-zA-Z0-9_]`).
   - Chapters: Clean table-of-contents array `[{ _key, startSeconds, label }]`.
   - Transcript Chunks: Many short timestamped pieces `[{ _key, startSeconds, text }]`. Never store the monolithic full transcript in any single field.
3. **Execution Boundary**:
   - Runs strictly offline via CLI tooling / npm scripts; never runs within the Next.js HTTP request path.
   - Uses server-side Sanity write tokens from `.env.local` or environment variables.

## Files Expected to Touch
- `prompts/offline-video-ingestion-pipeline.md` (This prompt)
- `scripts/ingestion/types.ts` (Pipeline and provider types)
- `scripts/ingestion/vtt-parser.ts` (WebVTT / SRT parser)
- `scripts/ingestion/chunker.ts` (Timestamped chunking utility)
- `scripts/ingestion/providers/youtube.ts` (YouTube caption & chapter provider)
- `scripts/ingestion/providers/vimeo.ts` (Vimeo caption & chapter provider)
- `scripts/ingestion/providers/bunny.ts` (Bunny Stream provider)
- `scripts/ingestion/providers/fallback.ts` (Lesson-guided fallback provider)
- `scripts/ingestion/providers/index.ts` (Provider registry and resolver)
- `scripts/ingestion/pipeline.ts` (Main ingestion engine and Sanity transactional committer)
- `scripts/ingest-videos.ts` (CLI runner with argument parsing)
- `package.json` (Add `"ingest:videos"` script and dev dependencies like `tsx` if needed)

## Requirements
1. The offline ingestion tooling parses video URLs across YouTube, Vimeo, and Bunny.
2. Captions/transcripts are split into small timestamped chunks (`startSeconds` + `text`).
3. Chapters are extracted or synthesized into structured table-of-contents items (`startSeconds` + `label`).
4. Document IDs are strictly sanitized according to Sanity rules.
5. Ingestion supports both full batch runs across all dataset lessons, single lesson runs, direct URL runs, and local subtitle file ingestion.
6. Dry-run mode allows inspecting chunking and chapter generation without writing to Sanity.
7. The tooling operates strictly offline.

## Security Considerations
- Read and write tokens are read securely from environment variables (`SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`, `SANITY_AUTH_TOKEN`, or `.env.local`).
- No tokens are hardcoded into source code or exposed to client bundles.
- Input validation on files, URLs, and timecode values prevents injection or unhandled exceptions.

## Acceptance Criteria
- [ ] `npm run ingest:videos -- --help` prints usage instructions and supported flags.
- [ ] Ingestion pipeline processes videos, creating valid Sanity `video` documents with `chapters` and `chunks`.
- [ ] `chunks` contains segmented timestamped text entries; no monolithic transcript field is created.
- [ ] Dry-run mode (`--dry-run`) works without mutating dataset.
- [ ] Type check (`tsc --noEmit`) and lint pass with 0 errors.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npx tsx scripts/ingest-videos.ts --help`
- `npx tsx scripts/ingest-videos.ts --dry-run`

## Exact Manual Test Steps
1. Run `npx tsx scripts/ingest-videos.ts --help` to confirm CLI help and options.
2. Run `npx tsx scripts/ingest-videos.ts --dry-run` to test parsing and chunk generation against existing dataset lessons.
3. Run `npx tsx scripts/ingest-videos.ts --url="https://www.youtube.com/watch?v=9602Yzvd7ik" --dry-run` to test single video processing.
4. Run `npm run ingest:videos` to populate or update video documents in Sanity.
5. Verify created video documents in Sanity Studio or via GROQ query `*[_type == "video"]{ _id, id, url, "chapterCount": count(chapters), "chunkCount": count(chunks) }`.
