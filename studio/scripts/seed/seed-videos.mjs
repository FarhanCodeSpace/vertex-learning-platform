import { createClient } from 'next-sanity'
import path from 'path'

const client = createClient({
  projectId: '89pwd9pn',
  dataset: 'production',
  apiVersion: '2026-09-22',
  token: 'skHKQCsqHaCkBWPpniKW88XIYnDOiacOhhuciniIB98muBx97Oox6YVN8slf9cyI1GuNksLrQT0qAemAFO2zctc3mvKc0i0Ui45w4tvKwYnS3GYufCnSYbJyEu3WQicVocYYCy243kALEG6sUfUrbkqvgrNAUYKZl9KKcRyF7VNzLez9inat',
  useCdn: false,
})

async function seedVideos() {
  console.log('Fetching all lessons from Sanity...')
  const lessons = await client.fetch(`*[_type == "lesson"]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    duration,
    keyPoints,
    "notesText": pt::text(notes)
  }`)

  console.log(`Found ${lessons.length} lessons. Preparing video documents...`)

  const videosMap = new Map()

  for (const lesson of lessons) {
    if (!lesson.videoUrl) continue

    const url = lesson.videoUrl
    let videoId = ''
    try {
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0]
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
      } else if (url.includes('vimeo.com/')) {
        videoId = url.split('vimeo.com/')[1].split('?')[0]
      } else {
        videoId = path.basename(url)
      }
    } catch {
      videoId = lesson.slug
    }

    let cleanId = (videoId || lesson.slug).replace(/[^a-zA-Z0-9_]/g, '_')
    // Sanity document ID element must start with alphanumeric
    cleanId = cleanId.replace(/^_+/, 'v_')
    if (/^[0-9]/.test(cleanId)) {
      cleanId = `v_${cleanId}`
    }

    const docId = `video.${cleanId}`

    if (videosMap.has(docId)) continue

    const duration = lesson.duration || 600
    const points = lesson.keyPoints || []
    
    // Generate realistic chapters
    const chapters = []
    chapters.push({
      _key: `ch-0`,
      startSeconds: 0,
      label: `Introduction to ${lesson.title}`,
    })

    if (points.length > 0) {
      const step = Math.floor((duration * 0.8) / points.length)
      points.forEach((point, idx) => {
        chapters.push({
          _key: `ch-${idx + 1}`,
          startSeconds: Math.floor((idx + 1) * step),
          label: point,
        })
      })
    } else {
      chapters.push(
        { _key: `ch-1`, startSeconds: Math.floor(duration * 0.25), label: 'Core Concepts and Architecture' },
        { _key: `ch-2`, startSeconds: Math.floor(duration * 0.55), label: 'Implementation and Patterns' },
        { _key: `ch-3`, startSeconds: Math.floor(duration * 0.85), label: 'Summary and Key Takeaways' }
      )
    }

    // Generate realistic transcript chunks
    const chunks = []
    const notesSnippets = (lesson.notesText || '')
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 15)

    const chunkCount = Math.max(4, Math.min(8, Math.floor(duration / 90)))
    const chunkInterval = Math.floor(duration / (chunkCount + 1))

    for (let i = 0; i < chunkCount; i++) {
      const sec = Math.floor((i + 1) * chunkInterval)
      let text = ''
      if (notesSnippets[i]) {
        text = notesSnippets[i] + '.'
      } else if (points[i % points.length]) {
        text = `In this section we explore how to ${points[i % points.length].toLowerCase()} with practical examples.`
      } else {
        text = `Understanding ${lesson.title} and best practices for building robust implementations.`
      }

      chunks.push({
        _key: `chunk-${i}`,
        startSeconds: sec,
        text: text,
      })
    }

    const videoDoc = {
      _id: docId,
      _type: 'video',
      id: cleanId,
      url: url,
      title: lesson.title,
      duration: duration,
      chapters: chapters,
      chunks: chunks,
    }

    videosMap.set(docId, videoDoc)
  }

  console.log(`Generated ${videosMap.size} video documents. Uploading to Sanity in transactions...`)

  const videoDocs = Array.from(videosMap.values())
  const batchSize = 25

  for (let i = 0; i < videoDocs.length; i += batchSize) {
    const batch = videoDocs.slice(i, i + batchSize)
    const transaction = client.transaction()
    for (const doc of batch) {
      transaction.createOrReplace(doc)
    }
    await transaction.commit()
    console.log(`Committed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videoDocs.length / batchSize)}`)
  }

  console.log('Video intelligence seed complete!')
}

seedVideos().catch(console.error)
