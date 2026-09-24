# Seed Sanity Dataset from Provided Seed Files

## Goal
Seed the Sanity dataset using the existing `studio/scripts/seed/seed.ndjson` and `studio/scripts/seed/videos.json` files without generating new content or modifying the source files, using the Sanity CLI dataset import command, and verifying document counts post-import.

## Skills Read
- `AGENTS.md`
- `sanity-best-practices` (`c:\Appzy\vertex\.agents\skills\sanity-best-practices\SKILL.md`)
- `sanity-migration` (`c:\Appzy\vertex\.agents\skills\sanity-migration\SKILL.md`)

## Code and Config Inspected
- `studio/scripts/seed/seed.ndjson`: 141 documents (6 categories, 5 instructors, 10 courses, 120 lessons) containing structured Portable Text notes, learning outcomes, modules, key points, proTips, and resources.
- `studio/scripts/seed/videos.json`: Video lookup mapping metadata for 120 lessons across YouTube videos.
- `studio/sanity.cli.ts`: Configured with project ID `89pwd9pn` and dataset `production`.
- `studio/.env.local`: Environment config with project ID and dataset.
- `studio/schemaTypes/`: Schemas for `category`, `course`, `instructor`, `lesson`, and embedded objects (`module`, `learningOutcome`, `resource`).

## Decisions and Assumptions
- Source seed files `studio/scripts/seed/seed.ndjson` and `studio/scripts/seed/videos.json` will remain completely untouched.
- The import will be executed via Sanity CLI (`npx sanity dataset import scripts/seed/seed.ndjson production --replace`) in the `studio` workspace. The `--replace` flag ensures deterministic and idempotent imports for stable document IDs.
- Asset URLs specified via `_sanityAsset` (such as avatar images and YouTube thumbnails) will be processed and imported by the Sanity CLI asset pipeline.
- Verification will be conducted via Sanity GROQ query to ensure all 141 documents (6 categories, 5 instructors, 10 courses, 120 lessons) are present and correctly structured.

## Files Expected to Touch
- `prompts/seed-sanity-dataset.md` (Implementation prompt)
- No code or seed files will be modified.

## Requirements
1. Use Sanity CLI import to load `studio/scripts/seed/seed.ndjson` into the `production` dataset.
2. Do not modify or alter `seed.ndjson` or `videos.json`.
3. Verify document counts and types in Sanity after import.

## Security Considerations
- Sanity dataset operations run server-side / via CLI without exposing private tokens or secret keys to client bundles.

## Acceptance Criteria
- [ ] `seed.ndjson` successfully imported into the `production` dataset.
- [ ] Total document count in dataset matches the seed file:
  - 6 `category` documents
  - 5 `instructor` documents
  - 10 `course` documents
  - 120 `lesson` documents
  - Total: 141 domain documents
- [ ] No changes made to `studio/scripts/seed/seed.ndjson` or `studio/scripts/seed/videos.json`.

## Checks to Run
- `npx sanity dataset import scripts/seed/seed.ndjson production --replace` in `studio/`
- Sanity GROQ document count query:
  - `*[_type in ["category", "instructor", "course", "lesson"]]`
  - Grouped counts by `_type`.

## Exact Manual Test Steps
1. Navigate to `studio/` directory.
2. Run `npx sanity documents query "*[_type in ['category', 'instructor', 'course', 'lesson']]{_type, _id}"` to inspect imported documents.
3. Launch Sanity Studio with `npm run dev` in `studio/` or open the deployed Studio to inspect Course, Lesson, Instructor, and Category documents in the Studio desk structure.
