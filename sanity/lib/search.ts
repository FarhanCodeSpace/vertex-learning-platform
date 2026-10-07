import { sanityFetch } from './fetch'
import { formatDuration } from '@/lib/format'

export type SearchResultType = 'video' | 'lesson'

export interface VideoSearchResult {
  id: string
  type: 'video'
  title: string
  courseTitle: string
  courseSlug: string
  courseIcon?: string
  moduleLabel: string // e.g. "Lesson 5.1 · Data Fetching & Caching"
  moduleTitle: string
  summary: string
  duration: number
  durationFormatted: string // e.g. "12:45"
  startSeconds: number
  startFormatted: string // e.g. "12:45" or "08:32"
  thumbnail?: string
  lessonSlug: string
  videoUrl?: string
  score: number
}

export interface LessonSearchResult {
  id: string
  type: 'lesson'
  title: string
  courseTitle: string
  courseSlug: string
  courseIcon?: string
  moduleLabel: string // e.g. "Module 5"
  moduleTitle: string
  summary: string
  keyPoints: string[]
  duration: number
  durationFormatted: string
  lessonSlug: string
  score: number
}

export type SearchResult = VideoSearchResult | LessonSearchResult

export interface SearchResponse {
  query: string
  totalResults: number
  coursesCount: number
  results: SearchResult[]
}

function formatTimestamp(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds))
  const h = Math.floor(safeSec / 3600)
  const m = Math.floor((safeSec % 3600) / 60)
  const s = safeSec % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * Searches lessons, courses, and video transcripts/chapters in Sanity.
 * Adheres to 2-stage timestamp resolution:
 * 1. Match authored chapters (Table of Contents) first (clean labels).
 * 2. Fall back to transcript chunks only if no chapters match.
 */
export async function searchContent(
  query: string,
  sort: 'relevant' | 'duration' | 'course' = 'relevant'
): Promise<SearchResponse> {
  const normalizedQuery = (query || '').trim()
  if (!normalizedQuery) {
    return {
      query: '',
      totalResults: 0,
      coursesCount: 0,
      results: [],
    }
  }

  // Tokenize keywords for wildcard and token matching
  const tokens = normalizedQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)

  // Fetch all courses with populated lessons and modules
  const coursesData = await sanityFetch<
    {
      _id: string
      title: string
      slug: { current: string }
      icon?: string
      modules: {
        title: string
        summary?: string
        lessons: {
          _id: string
          title: string
          slug: { current: string }
          videoUrl?: string
          thumbnail?: { asset?: { url?: string } }
          duration?: number
          keyPoints?: string[]
          notesText?: string
        }[]
      }[]
    }[]
  >({
    query: `*[_type == "course" && !(_id in path("drafts.**"))]{
      _id,
      title,
      slug,
      icon,
      modules[]{
        title,
        summary,
        lessons[]->{
          _id,
          title,
          slug,
          videoUrl,
          "thumbnail": thumbnail.asset->url,
          duration,
          keyPoints,
          "notesText": pt::text(notes)
        }
      }
    }`,
    options: {
      tags: ['course', 'lesson', 'search'],
    },
  })

  // Fetch video intelligence documents (internal lookup)
  const videosData = await sanityFetch<
    {
      _id: string
      url: string
      title?: string
      duration?: number
      chapters?: { startSeconds: number; label: string }[]
      chunks?: { startSeconds: number; text: string }[]
    }[]
  >({
    query: `*[_type == "video" && !(_id in path("drafts.**"))]{
      _id,
      url,
      title,
      duration,
      chapters,
      chunks
    }`,
    options: {
      tags: ['video', 'search'],
    },
  })

  // Build a lookup map of videoUrl -> video intelligence document
  const videoMap = new Map<string, typeof videosData[0]>()
  for (const v of videosData || []) {
    if (v.url) {
      videoMap.set(v.url, v)
    }
  }

  const videoResults: VideoSearchResult[] = []
  const lessonResults: LessonSearchResult[] = []
  const matchingCoursesSet = new Set<string>()

  // Helper score calculator
  const calculateScore = (target: string, queryStr: string, wordTokens: string[]): number => {
    const text = (target || '').toLowerCase().trim()
    const q = queryStr.toLowerCase().trim()
    if (!text || !q) return 0
    if (text === q) return 100
    if (text.startsWith(q)) return 90
    if (text.includes(q)) return 80

    let matchedTokensCount = 0
    let boundaryMatches = 0
    for (const token of wordTokens) {
      if (!token) continue
      if (text.includes(token)) {
        matchedTokensCount += 1
        const boundaryRegex = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
        if (boundaryRegex.test(text)) {
          boundaryMatches += 1
        }
      }
    }

    if (matchedTokensCount === 0) return 0

    const matchRatio = matchedTokensCount / wordTokens.length
    const bonus = (boundaryMatches / wordTokens.length) * 15
    return Math.min(75, Math.round(matchRatio * 55 + bonus))
  }

  // Iterate courses, modules, and lessons
  for (const course of coursesData || []) {
    const courseTitle = course.title || ''
    const courseSlug = course.slug?.current || ''
    const courseIcon = course.icon || ''

    if (!course.modules) continue

    course.modules.forEach((mod, modIdx) => {
      const moduleNumber = modIdx + 1
      const moduleTitle = mod.title || `Module ${moduleNumber}`
      const moduleSummary = mod.summary || ''

      if (!mod.lessons) return

      mod.lessons.forEach((lesson, lessonIdx) => {
        if (!lesson) return
        const lessonNumber = `${moduleNumber}.${lessonIdx + 1}`
        const lessonTitle = lesson.title || ''
        const lessonSlug = lesson.slug?.current || ''
        const lessonDuration = lesson.duration || 480
        const lessonKeyPoints = lesson.keyPoints || []
        const notesText = lesson.notesText || ''
        const videoUrl = lesson.videoUrl || ''

        // Check Lesson match
        const titleScore = calculateScore(lessonTitle, normalizedQuery, tokens)
        const keyPointsText = lessonKeyPoints.join(' ')
        const keyPointsScore = calculateScore(keyPointsText, normalizedQuery, tokens)
        const notesScore = calculateScore(notesText, normalizedQuery, tokens)
        const moduleScore = calculateScore(moduleTitle, normalizedQuery, tokens)
        const courseScore = calculateScore(courseTitle, normalizedQuery, tokens)

        const maxLessonScore = Math.max(
          titleScore * 1.5,
          keyPointsScore * 1.2,
          notesScore,
          moduleScore * 0.8,
          courseScore * 0.5
        )

        // TWO-STAGE TIMESTAMP RESOLUTION:
        // Stage 1: Chapters (Table of contents) - Clean authored topics
        // Stage 2: Transcript Chunks (Fallback) - Only if no chapter matches
        let videoScore = 0
        let startSec = 0
        let videoDesc = ''
        let matchedStage: 'chapter' | 'transcript' | 'topic' | null = null

        const videoDoc = videoUrl ? videoMap.get(videoUrl) : null
        if (videoDoc) {
          // --- STAGE 1: CHAPTER RESOLUTION ---
          let bestChapter: { startSeconds: number; label: string; score: number } | null = null
          if (videoDoc.chapters && videoDoc.chapters.length > 0) {
            for (const ch of videoDoc.chapters) {
              const chScore = calculateScore(ch.label, normalizedQuery, tokens)
              if (chScore > 0 && (!bestChapter || chScore > bestChapter.score)) {
                bestChapter = { startSeconds: ch.startSeconds, label: ch.label, score: chScore }
              }
            }
          }

          if (bestChapter && bestChapter.score >= 20) {
            // Found matching chapter: prioritize clean chapter timestamp
            videoScore = bestChapter.score * 1.35
            startSec = bestChapter.startSeconds
            videoDesc = bestChapter.label
            matchedStage = 'chapter'
          }

          // --- STAGE 2: TRANSCRIPT CHUNKS FALLBACK ---
          if (!matchedStage && videoDoc.chunks && videoDoc.chunks.length > 0) {
            let bestChunk: { startSeconds: number; text: string; score: number } | null = null
            for (const chunk of videoDoc.chunks) {
              const chunkScore = calculateScore(chunk.text, normalizedQuery, tokens)
              if (chunkScore > 0 && (!bestChunk || chunkScore > bestChunk.score)) {
                bestChunk = { startSeconds: chunk.startSeconds, text: chunk.text, score: chunkScore }
              }
            }

            if (bestChunk && bestChunk.score >= 20) {
              videoScore = bestChunk.score
              startSec = bestChunk.startSeconds
              videoDesc = bestChunk.text
              matchedStage = 'transcript'
            }
          }

          // --- STAGE 3: LESSON TOPIC MATCH WITH KNOWN VIDEO ---
          if (!matchedStage && maxLessonScore >= 35) {
            // Broad lesson topic match: ground to the first chapter or 0s
            videoScore = maxLessonScore * 0.85
            startSec = videoDoc.chapters && videoDoc.chapters.length > 0 ? videoDoc.chapters[0].startSeconds : 0
            videoDesc = lessonKeyPoints[0] || notesText.slice(0, 140) || lessonTitle
            matchedStage = 'topic'
          }
        } else if (videoUrl && maxLessonScore >= 35) {
          videoScore = maxLessonScore * 0.85
          startSec = 0
          videoDesc = lessonKeyPoints[0] || notesText.slice(0, 140) || lessonTitle
          matchedStage = 'topic'
        }

        // Add Video Result if valid grounded video moment was found
        if (videoUrl && videoScore >= 20) {
          matchingCoursesSet.add(courseTitle)
          videoResults.push({
            id: `video-${lesson._id}-${startSec}`,
            type: 'video',
            title: lessonTitle,
            courseTitle,
            courseSlug,
            courseIcon,
            moduleLabel: `Lesson ${lessonNumber} · ${moduleTitle}`,
            moduleTitle,
            summary:
              videoDesc ||
              `Learn ${lessonTitle.toLowerCase()} in depth with step-by-step guidance and practical patterns.`,
            duration: lessonDuration,
            durationFormatted: formatDuration(lessonDuration),
            startSeconds: startSec,
            startFormatted: formatTimestamp(startSec),
            thumbnail: (typeof lesson.thumbnail === 'string' ? lesson.thumbnail : undefined),
            lessonSlug,
            videoUrl,
            score: videoScore,
          })
        }

        // Add Lesson Result if lesson score matches
        if (maxLessonScore >= 25) {
          matchingCoursesSet.add(courseTitle)
          lessonResults.push({
            id: `lesson-${lesson._id}`,
            type: 'lesson',
            title: lessonTitle,
            courseTitle,
            courseSlug,
            courseIcon,
            moduleLabel: `Module ${moduleNumber}`,
            moduleTitle,
            summary:
              notesText.slice(0, 160) ||
              moduleSummary ||
              `Explore ${lessonTitle} in ${courseTitle} with comprehensive examples and best practices.`,
            keyPoints: lessonKeyPoints.length > 0 ? lessonKeyPoints.slice(0, 3) : [
              `Core principles of ${lessonTitle}`,
              `Implementation techniques and architecture`,
              `Optimization and best practices`,
            ],
            duration: lessonDuration,
            durationFormatted: formatDuration(lessonDuration),
            lessonSlug,
            score: maxLessonScore,
          })
        }
      })
    })
  }

  // Merge results
  const allResults: SearchResult[] = [...videoResults, ...lessonResults]

  // Deduplicate by lessonSlug + type + startSeconds
  const uniqueResultsMap = new Map<string, SearchResult>()
  for (const item of allResults) {
    const key = `${item.type}-${item.lessonSlug}-${item.type === 'video' ? item.startSeconds : 0}`
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, item)
    }
  }

  const finalResults = Array.from(uniqueResultsMap.values())

  // Apply sorting
  if (sort === 'duration') {
    finalResults.sort((a, b) => b.duration - a.duration)
  } else if (sort === 'course') {
    finalResults.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))
  } else {
    // 'relevant': sort by score descending
    finalResults.sort((a, b) => b.score - a.score)
  }

  return {
    query: normalizedQuery,
    totalResults: finalResults.length,
    coursesCount: matchingCoursesSet.size,
    results: finalResults,
  }
}
