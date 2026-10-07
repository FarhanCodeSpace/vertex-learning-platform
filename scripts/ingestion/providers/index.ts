import type { IngestionMetadata, IngestionResult } from '../types';
import { extractYouTubeId, processYouTubeVideo } from './youtube';
import { extractVimeoId, processVimeoVideo } from './vimeo';
import { extractBunnyIds, processBunnyVideo } from './bunny';
import { processCustomOrFallbackVideo } from './fallback';

export function detectProvider(url: string): 'youtube' | 'vimeo' | 'bunny' | 'custom' {
  if (!url) return 'custom';
  if (extractYouTubeId(url)) return 'youtube';
  if (extractVimeoId(url)) return 'vimeo';
  if (extractBunnyIds(url)) return 'bunny';
  return 'custom';
}

/**
 * Derives a clean, datastore-safe Sanity document ID element.
 * Strips characters rejected by Sanity document IDs (must be alphanumeric or underscore).
 */
export function sanitizeVideoDocId(rawId: string): string {
  let cleanId = rawId.replace(/[^a-zA-Z0-9_]/g, '_');
  cleanId = cleanId.replace(/^_+/, 'v_');
  if (/^[0-9]/.test(cleanId)) {
    cleanId = `v_${cleanId}`;
  }
  return cleanId;
}

export async function processVideoByProvider(
  meta: IngestionMetadata,
  subtitleContent?: string
): Promise<IngestionResult> {
  const provider = detectProvider(meta.url);
  let processed;

  if (subtitleContent) {
    processed = await processCustomOrFallbackVideo(meta, subtitleContent);
  } else if (provider === 'youtube') {
    processed = await processYouTubeVideo(meta);
  } else if (provider === 'vimeo') {
    processed = await processVimeoVideo(meta);
  } else if (provider === 'bunny') {
    processed = await processBunnyVideo(meta);
  } else {
    processed = await processCustomOrFallbackVideo(meta);
  }

  const cleanId = sanitizeVideoDocId(processed.id || meta.lessonSlug || 'video');
  const docId = `video.${cleanId}`;

  return {
    docId,
    id: cleanId,
    url: meta.url,
    title: meta.title || meta.lessonTitle || 'Video',
    duration: processed.duration,
    chapters: processed.chapters,
    chunks: processed.chunks,
    provider,
  };
}
