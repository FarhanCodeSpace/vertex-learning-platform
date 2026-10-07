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
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * Searches lessons, courses, and video transcripts/chapters in Sanity.
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

  // Tokenize keywords for wildcard and regex matching
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
    query: `*[_type == "course"]{
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
          thumbnail,
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

  // Fetch video intelligence documents
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
    query: `*[_type == "video"]{
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
    const text = (target || '').toLowerCase()
    const q = queryStr.toLowerCase()
    if (!text) return 0
    if (text === q) return 100
    if (text.includes(q)) return 80

    let matches = 0
    for (const token of wordTokens) {
      if (text.includes(token)) {
        matches += 1
      }
    }
    return (matches / wordTokens.length) * 50
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

        // Find video intelligence matches
        let matchedChapter: { startSeconds: number; label: string; score: number } | null = null
        let matchedChunk: { startSeconds: number; text: string; score: number } | null = null

        const videoDoc = videoUrl ? videoMap.get(videoUrl) : null
        if (videoDoc) {
          // 1. Chapter matching (Table of contents)
          if (videoDoc.chapters) {
            for (const ch of videoDoc.chapters) {
              const chScore = calculateScore(ch.label, normalizedQuery, tokens)
              if (chScore > 0 && (!matchedChapter || chScore > matchedChapter.score)) {
                matchedChapter = { startSeconds: ch.startSeconds, label: ch.label, score: chScore }
              }
            }
          }

          // 2. Transcript chunk matching (Fallback)
          if (videoDoc.chunks) {
            for (const chunk of videoDoc.chunks) {
              const chunkScore = calculateScore(chunk.text, normalizedQuery, tokens)
              if (chunkScore > 0 && (!matchedChunk || chunkScore > matchedChunk.score)) {
                matchedChunk = { startSeconds: chunk.startSeconds, text: chunk.text, score: chunkScore }
              }
            }
          }
        }

        // Add Video Result if matched chapter, chunk, or strong lesson title match with video
        if (videoUrl) {
          let videoScore = 0
          let startSec = 0
          let videoDesc = ''

          if (matchedChapter && matchedChapter.score >= 20) {
            videoScore = matchedChapter.score * 1.3
            startSec = matchedChapter.startSeconds
            videoDesc = matchedChapter.label
          } else if (matchedChunk && matchedChunk.score >= 20) {
            videoScore = matchedChunk.score
            startSec = matchedChunk.startSeconds
            videoDesc = matchedChunk.text
          } else if (maxLessonScore >= 30) {
            videoScore = maxLessonScore * 0.9
            startSec = Math.floor(lessonDuration * 0.15)
            videoDesc = lessonKeyPoints[0] || notesText.slice(0, 140) || lessonTitle
          }

          if (videoScore >= 20) {
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
              thumbnail: undefined,
              lessonSlug,
              videoUrl,
              score: videoScore,
            })
          }
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
