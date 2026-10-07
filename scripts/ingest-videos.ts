import {
  ingestAllLessonVideos,
  ingestLessonBySlug,
  ingestStandaloneVideo,
} from './ingestion/pipeline';
import type { IngestionOptions } from './ingestion/types';

function printHelp() {
  console.log(`
Vertex Offline Video Ingestion Pipeline CLI

Usage:
  npx tsx scripts/ingest-videos.ts [options]
  npm run ingest:videos -- [options]

Options:
  --all, -a              Ingest and build video documents for all lessons in the Sanity dataset
  --lesson, -l <slug>    Ingest video intelligence for a specific lesson by slug
  --url, -u <url>        Ingest a standalone video URL (YouTube, Vimeo, Bunny, or direct stream)
  --file, -f <path>      Path to local WebVTT (.vtt) or SubRip (.srt) subtitle file to ingest
  --title, -t <title>    Optional title for standalone video ingestion
  --duration <seconds>   Optional duration in seconds
  --dry-run, -d          Run extraction and chunking without committing changes to Sanity
  --verbose, -v          Show detailed processing logs for every video
  --help, -h             Show this help message

Examples:
  # Ingest all dataset lessons:
  npx tsx scripts/ingest-videos.ts --all

  # Test ingestion for all videos without writing to Sanity:
  npx tsx scripts/ingest-videos.ts --all --dry-run

  # Ingest a single lesson:
  npx tsx scripts/ingest-videos.ts --lesson server-components

  # Ingest a standalone YouTube URL with a subtitle file:
  npx tsx scripts/ingest-videos.ts --url "https://www.youtube.com/watch?v=9602Yzvd7ik" --file ./subtitles.vtt
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const isAll = args.includes('--all') || args.includes('-a');

  const getArgValue = (flags: string[]): string | undefined => {
    for (let i = 0; i < args.length; i++) {
      if (flags.includes(args[i]) && i + 1 < args.length) {
        return args[i + 1];
      }
      for (const flag of flags) {
        if (args[i].startsWith(`${flag}=`)) {
          return args[i].substring(flag.length + 1);
        }
      }
    }
    return undefined;
  };

  const lessonSlug = getArgValue(['--lesson', '-l']);
  const videoUrl = getArgValue(['--url', '-u']);
  const subtitleFile = getArgValue(['--file', '-f']);
  const title = getArgValue(['--title', '-t']);
  const durationStr = getArgValue(['--duration']);
  const duration = durationStr ? parseInt(durationStr, 10) : undefined;

  const options: IngestionOptions = {
    dryRun,
    verbose,
    subtitleFile,
  };

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         VERTEX OFFLINE VIDEO INGESTION PIPELINE               ');
  console.log('═══════════════════════════════════════════════════════════════');
  if (dryRun) console.log(' MODE: DRY RUN (No mutations will be written to Sanity)');
  console.log('');

  const startTime = Date.now();

  try {
    if (isAll) {
      await ingestAllLessonVideos(options);
    } else if (lessonSlug) {
      await ingestLessonBySlug(lessonSlug, options);
    } else if (videoUrl) {
      await ingestStandaloneVideo(videoUrl, { title, duration }, options);
    } else {
      console.error('Error: You must specify --all, --lesson <slug>, or --url <videoUrl>.');
      printHelp();
      process.exit(1);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✓ Ingestion pipeline completed in ${elapsed}s.`);
  } catch (error) {
    console.error('\n✗ Ingestion pipeline failed with error:', error);
    process.exit(1);
  }
}

main();
