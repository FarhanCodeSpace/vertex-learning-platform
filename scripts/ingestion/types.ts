export interface TranscriptCue {
  startSeconds: number;
  durationSeconds?: number;
  text: string;
}

export interface TranscriptChunk {
  _key: string;
  startSeconds: number;
  text: string;
}

export interface VideoChapter {
  _key: string;
  startSeconds: number;
  label: string;
}

export interface IngestionMetadata {
  id?: string;
  title?: string;
  url: string;
  duration?: number;
  lessonTitle?: string;
  lessonSlug?: string;
  keyPoints?: string[];
  notesText?: string;
}

export interface IngestionResult {
  docId: string;
  id: string;
  url: string;
  title: string;
  duration: number;
  chapters: VideoChapter[];
  chunks: TranscriptChunk[];
  provider: 'youtube' | 'vimeo' | 'bunny' | 'custom' | 'fallback';
}

export interface IngestionOptions {
  dryRun?: boolean;
  minChunkDuration?: number;
  maxChunkDuration?: number;
  verbose?: boolean;
  subtitleFile?: string;
}
