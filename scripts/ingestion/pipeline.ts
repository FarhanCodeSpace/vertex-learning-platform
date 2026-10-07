import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';
import type { IngestionMetadata, IngestionOptions, IngestionResult } from './types';
import { processVideoByProvider } from './providers';

function getSanityClient() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID ||
    '89pwd9pn';
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    'production';
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_AUTH_TOKEN ||
    process.env.SANITY_API_READ_TOKEN ||
    'skHKQCsqHaCkBWPpniKW88XIYnDOiacOhhuciniIB98muBx97Oox6YVN8slf9cyI1GuNksLrQT0qAemAFO2zctc3mvKc0i0Ui45w4tvKwYnS3GYufCnSYbJyEu3WQicVocYYCy243kALEG6sUfUrbkqvgrNAUYKZl9KKcRyF7VNzLez9inat';

  return createClient({
    projectId,
    dataset,
    apiVersion: '2026-09-22',
    token,
    useCdn: false,
  });
}

export async function commitVideoDocuments(
  results: IngestionResult[],
  options: IngestionOptions = {}
): Promise<{ committedCount: number }> {
  if (options.dryRun) {
    console.log(`\n[DRY RUN] Would commit ${results.length} video document(s) to Sanity.`);
    return { committedCount: results.length };
  }

  const client = getSanityClient();
  const batchSize = 25;
  let committedCount = 0;

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const res of batch) {
      const doc = {
        _id: res.docId,
        _type: 'video',
        id: res.id,
        url: res.url,
        title: res.title,
        duration: res.duration,
        chapters: res.chapters,
        chunks: res.chunks,
      };
      transaction.createOrReplace(doc);
    }

    await transaction.commit();
    committedCount += batch.length;
    console.log(
      `✓ Committed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(results.length / batchSize)} (${committedCount}/${results.length} documents)`
    );
  }

  return { committedCount };
}

export async function ingestAllLessonVideos(
  options: IngestionOptions = {}
): Promise<IngestionResult[]> {
  const client = getSanityClient();
  console.log('Fetching all lessons from Sanity dataset...');

  const lessons = await client.fetch<
    Array<{
      _id: string;
      title: string;
      slug?: string;
      videoUrl?: string;
      duration?: number;
      keyPoints?: string[];
      notesText?: string;
    }>
  >(`*[_type == "lesson"]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    duration,
    keyPoints,
    "notesText": pt::text(notes)
  }`);

  console.log(`Found ${lessons.length} lessons in dataset.`);

  const videoMap = new Map<string, IngestionResult>();

  for (const lesson of lessons) {
    if (!lesson.videoUrl) continue;

    const meta: IngestionMetadata = {
      url: lesson.videoUrl,
      title: lesson.title,
      lessonTitle: lesson.title,
      lessonSlug: lesson.slug,
      duration: lesson.duration || 600,
      keyPoints: lesson.keyPoints || [],
      notesText: lesson.notesText || '',
    };

    const result = await processVideoByProvider(meta);
    if (!videoMap.has(result.docId)) {
      videoMap.set(result.docId, result);
      if (options.verbose) {
        console.log(
          `  • Processed [${result.provider}] ${result.title} -> ${result.chapters.length} chapters, ${result.chunks.length} chunks`
        );
      }
    }
  }

  const results = Array.from(videoMap.values());
  console.log(`Successfully built ${results.length} unique video intelligence document(s).`);

  await commitVideoDocuments(results, options);
  return results;
}

export async function ingestLessonBySlug(
  slug: string,
  options: IngestionOptions = {}
): Promise<IngestionResult | null> {
  const client = getSanityClient();
  console.log(`Fetching lesson with slug: "${slug}"...`);

  const lesson = await client.fetch<{
    _id: string;
    title: string;
    slug?: string;
    videoUrl?: string;
    duration?: number;
    keyPoints?: string[];
    notesText?: string;
  } | null>(
    `*[_type == "lesson" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      videoUrl,
      duration,
      keyPoints,
      "notesText": pt::text(notes)
    }`,
    { slug }
  );

  if (!lesson || !lesson.videoUrl) {
    console.error(`Error: Lesson "${slug}" not found or has no videoUrl.`);
    return null;
  }

  const meta: IngestionMetadata = {
    url: lesson.videoUrl,
    title: lesson.title,
    lessonTitle: lesson.title,
    lessonSlug: lesson.slug,
    duration: lesson.duration || 600,
    keyPoints: lesson.keyPoints || [],
    notesText: lesson.notesText || '',
  };

  let subtitleContent: string | undefined;
  if (options.subtitleFile && fs.existsSync(options.subtitleFile)) {
    subtitleContent = fs.readFileSync(options.subtitleFile, 'utf-8');
  }

  const result = await processVideoByProvider(meta, subtitleContent);
  console.log(`\nProcessed Video Document:`);
  console.log(`  Document ID : ${result.docId}`);
  console.log(`  Provider    : ${result.provider}`);
  console.log(`  Chapters    : ${result.chapters.length} items`);
  console.log(`  Chunks      : ${result.chunks.length} items`);

  await commitVideoDocuments([result], options);
  return result;
}

export async function ingestStandaloneVideo(
  url: string,
  meta: Partial<IngestionMetadata> = {},
  options: IngestionOptions = {}
): Promise<IngestionResult> {
  const fullMeta: IngestionMetadata = {
    url,
    title: meta.title || 'Standalone Video',
    duration: meta.duration || 600,
    lessonTitle: meta.lessonTitle,
    lessonSlug: meta.lessonSlug,
    keyPoints: meta.keyPoints || [],
    notesText: meta.notesText || '',
  };

  let subtitleContent: string | undefined;
  if (options.subtitleFile && fs.existsSync(options.subtitleFile)) {
    subtitleContent = fs.readFileSync(path.resolve(options.subtitleFile), 'utf-8');
  }

  const result = await processVideoByProvider(fullMeta, subtitleContent);
  console.log(`\nProcessed Standalone Video:`);
  console.log(`  Document ID : ${result.docId}`);
  console.log(`  Provider    : ${result.provider}`);
  console.log(`  Chapters    : ${result.chapters.length} items`);
  console.log(`  Chunks      : ${result.chunks.length} items`);

  await commitVideoDocuments([result], options);
  return result;
}
