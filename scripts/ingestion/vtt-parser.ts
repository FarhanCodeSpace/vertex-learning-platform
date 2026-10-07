import type { TranscriptCue } from './types';

/**
 * Parses timestamp string (HH:MM:SS.mmm, MM:SS.mmm, or seconds) to seconds.
 */
export function parseTimestampToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().replace(',', '.');

  const parts = clean.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseFloat(clean) || 0;
}

/**
 * Strips HTML / VTT tags (e.g., <v Speaker>, <c>, <b>, etc.) and unescapes HTML entities.
 */
export function cleanSubtitleText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Universal parser for WebVTT and SRT subtitle text.
 */
export function parseSubtitleContent(content: string): TranscriptCue[] {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const cues: TranscriptCue[] = [];

  let currentStart = -1;
  let currentEnd = -1;
  let currentTextLines: string[] = [];

  const timecodeRegex = /(?:(\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}|\d{1,2}:\d{2}[.,]\d{3})\s*-->\s*(?:(\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}|\d{1,2}:\d{2}[.,]\d{3})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip WEBVTT header, NOTE comments, or numeric index lines
    if (line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
      continue;
    }

    if (timecodeRegex.test(line)) {
      // If we already had a cue being constructed, save it
      if (currentStart >= 0 && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: Math.floor(currentStart),
            durationSeconds: Math.max(1, Math.floor(currentEnd - currentStart)),
            text,
          });
        }
      }

      // Parse new timecodes
      const [startStr, endStr] = line.split('-->').map((s) => s.trim().split(' ')[0]);
      currentStart = parseTimestampToSeconds(startStr);
      currentEnd = parseTimestampToSeconds(endStr);
      currentTextLines = [];
    } else if (line === '') {
      if (currentStart >= 0 && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: Math.floor(currentStart),
            durationSeconds: Math.max(1, Math.floor(currentEnd - currentStart)),
            text,
          });
        }
        currentStart = -1;
        currentEnd = -1;
        currentTextLines = [];
      }
    } else {
      // Could be cue identifier number or subtitle text
      if (/^\d+$/.test(line) && currentTextLines.length === 0 && currentStart < 0) {
        // Just cue index, skip
        continue;
      }
      if (currentStart >= 0) {
        currentTextLines.push(line);
      }
    }
  }

  // Final flush
  if (currentStart >= 0 && currentTextLines.length > 0) {
    const text = cleanSubtitleText(currentTextLines.join(' '));
    if (text) {
      cues.push({
        startSeconds: Math.floor(currentStart),
        durationSeconds: Math.max(1, Math.floor(currentEnd - currentStart)),
        text,
      });
    }
  }

  return cues;
}
