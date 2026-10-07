import type { TranscriptChunk, TranscriptCue } from './types';

interface ChunkerOptions {
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  maxWordsPerChunk?: number;
}

/**
 * Combines raw fine-grained subtitle cues (e.g. 2-3 sec snippets) into coherent,
 * queryable timestamped chunks (~15-45 seconds or complete sentences).
 */
export function chunkTranscriptCues(
  cues: TranscriptCue[],
  options: ChunkerOptions = {}
): TranscriptChunk[] {
  const minDuration = options.minDurationSeconds ?? 15;
  const maxDuration = options.maxDurationSeconds ?? 45;
  const maxWords = options.maxWordsPerChunk ?? 65;

  if (!cues || cues.length === 0) return [];

  const chunks: TranscriptChunk[] = [];
  let currentStart = cues[0].startSeconds;
  let currentWords: string[] = [];
  let chunkIndex = 0;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    const text = cue.text.trim();
    if (!text) continue;

    const cueWords = text.split(/\s+/);
    currentWords.push(...cueWords);

    const elapsed = (cue.startSeconds + (cue.durationSeconds || 2)) - currentStart;
    const isSentenceEnd = /[.!?]$/.test(text);
    const reachedWordLimit = currentWords.length >= maxWords;
    const reachedDuration = elapsed >= minDuration && (isSentenceEnd || elapsed >= maxDuration);

    if (reachedDuration || reachedWordLimit || i === cues.length - 1) {
      const chunkText = currentWords.join(' ').trim();
      if (chunkText) {
        chunks.push({
          _key: `chunk-${chunkIndex++}`,
          startSeconds: Math.floor(currentStart),
          text: chunkText,
        });
      }

      if (i < cues.length - 1) {
        currentStart = cues[i + 1].startSeconds;
        currentWords = [];
      }
    }
  }

  return chunks;
}
