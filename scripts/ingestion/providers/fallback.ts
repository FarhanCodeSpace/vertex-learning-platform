import type { IngestionMetadata, TranscriptChunk, VideoChapter } from '../types';
import { chunkTranscriptCues } from '../chunker';
import { parseSubtitleContent } from '../vtt-parser';
import { parseChaptersFromText } from './youtube';

export async function processCustomOrFallbackVideo(
  meta: IngestionMetadata,
  subtitleContent?: string
): Promise<{
  id: string;
  chapters: VideoChapter[];
  chunks: TranscriptChunk[];
  duration: number;
}> {
  const duration = meta.duration || 600;
  const videoId = meta.id || meta.lessonSlug || 'custom_video';

  let chunks: TranscriptChunk[] = [];
  if (subtitleContent) {
    const cues = parseSubtitleContent(subtitleContent);
    chunks = chunkTranscriptCues(cues);
  }

  // Chapters: parse from notesText or keyPoints
  let chapters: VideoChapter[] = [];
  if (meta.notesText) {
    chapters = parseChaptersFromText(meta.notesText);
  }

  if (chapters.length === 0) {
    chapters.push({
      _key: 'ch-0',
      startSeconds: 0,
      label: `Introduction to ${meta.lessonTitle || meta.title || 'Lesson'}`,
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
        { _key: 'ch-1', startSeconds: Math.floor(duration * 0.25), label: 'Core Concepts' },
        { _key: 'ch-2', startSeconds: Math.floor(duration * 0.6), label: 'Hands-on Implementation' },
        { _key: 'ch-3', startSeconds: Math.floor(duration * 0.85), label: 'Summary & Wrap-up' }
      );
    }
  }

  if (chunks.length === 0) {
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
        text = `In this section we cover ${points[i % points.length].toLowerCase()}.`;
      } else {
        text = `Understanding ${meta.lessonTitle || meta.title || 'the core concept'} with step by step instructions.`;
      }

      chunks.push({
        _key: `chunk-${i}`,
        startSeconds: sec,
        text,
      });
    }
  }

  return {
    id: videoId,
    chapters,
    chunks,
    duration,
  };
}
