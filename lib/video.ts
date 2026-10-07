/**
 * Video embed URL parser and provider utilities
 * Supports YouTube, Vimeo, and Bunny video providers
 */

export interface ParsedVideoEmbed {
  provider: 'youtube' | 'vimeo' | 'bunny' | 'generic';
  embedUrl: string;
  videoId?: string;
}

/**
 * Extracts start seconds from raw query parameter strings or numbers.
 * Supports numbers, pure seconds, "MM:SS", "HH:MM:SS", "120s", "2m30s", "1h20m10s".
 */
export function parseStartSeconds(
  param?: string | string[] | number | null
): number {
  if (param === undefined || param === null) return 0;
  if (typeof param === 'number') return Math.max(0, Math.floor(param));

  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw || typeof raw !== 'string') return 0;
  const str = raw.trim();

  // Handle format like "120"
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  // Handle format like "02:30" or "01:15:30"
  if (/^\d+(?::\d+)+$/.test(str)) {
    const parts = str.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  // Handle format like "120s", "2m30s", "1h20m10s"
  let totalSeconds = 0;
  const hoursMatch = str.match(/(\d+)\s*h/i);
  const minsMatch = str.match(/(\d+)\s*m/i);
  const secsMatch = str.match(/(\d+)\s*s/i);

  if (hoursMatch) totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
  if (minsMatch) totalSeconds += parseInt(minsMatch[1], 10) * 60;
  if (secsMatch) totalSeconds += parseInt(secsMatch[1], 10);

  if (totalSeconds > 0) return totalSeconds;

  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Parses videoUrl and generates a provider-compliant iframe embed URL with start timestamp and seek parameters.
 */
export function getEmbedUrl(
  videoUrl?: string | null,
  startSeconds: number = 0
): ParsedVideoEmbed | null {
  if (!videoUrl || typeof videoUrl !== 'string' || !videoUrl.trim()) {
    return null;
  }

  const cleanUrl = videoUrl.trim();
  const safeStart = Math.max(0, Math.floor(startSeconds));
  const autoplayParam = safeStart > 0 ? '1' : '0';

  // 1. YouTube
  // Matches: youtube.com/watch?v=XXX, youtu.be/XXX, youtube.com/embed/XXX, youtube.com/v/XXX
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const startParam = safeStart > 0 ? `&start=${safeStart}` : '';
    const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
    return {
      provider: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0&modestbranding=1&enablejsapi=1${
        origin ? `&origin=${origin}` : ''
      }${startParam}`,
    };
  }

  // 2. Vimeo
  // Matches: vimeo.com/123456789, player.vimeo.com/video/123456789
  const vimeoMatch = cleanUrl.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const timeParam = safeStart > 0 ? `#t=${safeStart}s` : '';
    const vimeoAutoplay = safeStart > 0 ? 'autoplay=1&' : '';
    return {
      provider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?${vimeoAutoplay}dnt=1&app_id=122963${timeParam}`,
    };
  }

  // 3. Bunny
  // Matches: iframe.mediadelivery.net/embed/LIB_ID/VIDEO_ID
  const bunnyMatch = cleanUrl.match(
    /(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/i
  );
  if (bunnyMatch && bunnyMatch[1] && bunnyMatch[2]) {
    const libraryId = bunnyMatch[1];
    const videoId = bunnyMatch[2];
    const startParam = safeStart > 0 ? `?t=${safeStart}&autoplay=true` : '?autoplay=false';
    return {
      provider: 'bunny',
      videoId,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}${startParam}`,
    };
  }

  // 4. Generic iframe URL
  let genericUrl = cleanUrl;
  if (safeStart > 0) {
    const separator = genericUrl.includes('?') ? '&' : '?';
    genericUrl = `${genericUrl}${separator}t=${safeStart}&autoplay=1`;
  }

  return {
    provider: 'generic',
    embedUrl: genericUrl,
  };
}
