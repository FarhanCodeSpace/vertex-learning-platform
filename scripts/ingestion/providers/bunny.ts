import type { IngestionMetadata, TranscriptChunk, VideoChapter } from '../types';
import { parseChaptersFromText } from './youtube';

export function extractBunnyIds(url: string): { libraryId: string; videoId: string } | null {
  if (!url) return null;
  const match = url.match(
    /(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/i
  );
  if (match && match[1] && match[2]) {
    return {
      libraryId: match[1],
      videoId: match[2],
    };
  }
  return null;
}

export async function processBunnyVideo(meta: IngestionMetadata): Promise<{
  id: string;
  chapters: VideoChapter[];
  chunks: TranscriptChunk[];
  duration: number;
}> {
  const parsed = extractBunnyIds(meta.url);
  const videoId = parsed ? `${parsed.libraryId}_${parsed.videoId}` : meta.id || 'bunny_video';
  const duration = meta.duration || 600;

  // Chapters
  let chapters: VideoChapter[] = [];
  if (meta.notesText) {
    chapters = parseChaptersFromText(meta.notesText);
  }

  if (chapters.length === 0) {
    chapters.push({
      _key: 'ch-0',
      startSeconds: 0,
      label: `Intro: ${meta.lessonTitle || meta.title || 'Bunny Stream Lesson'}`,
    });

    const points = meta.keyPoints || [];
    if (points.length > 0) {
      const step = Math.floor((duration * 0.8) / points.length);
      points.forEach((point, idx) => {
        chapters.push({
          _key: `ch-${idx + 1}`,
          startSeconds: Math.floor((idx + 1) * step),
          label: point,
        });
      });
    } else {
      chapters.push(
        { _key: 'ch-1', startSeconds: Math.floor(duration * 0.25), label: 'Setup and Architecture' },
        { _key: 'ch-2', startSeconds: Math.floor(duration * 0.6), label: 'Implementation Steps' },
        { _key: 'ch-3', startSeconds: Math.floor(duration * 0.85), label: 'Summary & Best Practices' }
      );
    }
  }

  // Chunks
  const chunks: TranscriptChunk[] = [];
  const notesSnippets = (meta.notesText || '')
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  const chunkCount = Math.max(4, Math.min(8, Math.floor(duration / 90)));
  const chunkInterval = Math.floor(duration / (chunkCount + 1));
  const points = meta.keyPoints || [];

  for (let i = 0; i < chunkCount; i++) {
    const sec = Math.floor((i + 1) * chunkInterval);
    let text = '';
    if (notesSnippets[i]) {
      text = notesSnippets[i] + '.';
    } else if (points[i % Math.max(1, points.length)]) {
      text = `Detailed look at ${points[i % points.length].toLowerCase()}.`;
    } else {
      text = `Exploring ${meta.lessonTitle || meta.title || 'topic'} in Bunny Stream video.`;
    }

    chunks.push({
      _key: `chunk-${i}`,
      startSeconds: sec,
      text,
    });
  }

  return {
    id: videoId,
    chapters,
    chunks,
    duration,
  };
}
