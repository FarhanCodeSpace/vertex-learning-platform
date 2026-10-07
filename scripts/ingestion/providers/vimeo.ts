import type { IngestionMetadata, TranscriptChunk, VideoChapter } from '../types';
import { parseChaptersFromText } from './youtube';

export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  return match ? match[1] : null;
}

export async function processVimeoVideo(meta: IngestionMetadata): Promise<{
  id: string;
  chapters: VideoChapter[];
  chunks: TranscriptChunk[];
  duration: number;
}> {
  const videoId = extractVimeoId(meta.url) || meta.id || 'vimeo_video';
  const duration = meta.duration || 600;

  // Chapters: parse from notesText or synthesize from key points
  let chapters: VideoChapter[] = [];
  if (meta.notesText) {
    chapters = parseChaptersFromText(meta.notesText);
  }

  if (chapters.length === 0) {
    chapters.push({
      _key: 'ch-0',
      startSeconds: 0,
      label: `Overview: ${meta.lessonTitle || meta.title || 'Vimeo Lesson'}`,
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
        { _key: 'ch-1', startSeconds: Math.floor(duration * 0.3), label: 'Core Principles' },
        { _key: 'ch-2', startSeconds: Math.floor(duration * 0.65), label: 'Deep Dive and Walkthrough' },
        { _key: 'ch-3', startSeconds: Math.floor(duration * 0.9), label: 'Key Takeaways' }
      );
    }
  }

  // Chunks from notes or synthesis
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
      text = `In this segment we review ${points[i % points.length].toLowerCase()}.`;
    } else {
      text = `Key explanations for ${meta.lessonTitle || meta.title || 'the lesson'} and production recommendations.`;
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
