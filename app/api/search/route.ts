import { NextRequest, NextResponse } from 'next/server'
import { searchContent } from '@/sanity/lib/search'
import { z } from 'zod'

const searchRequestSchema = z.object({
  query: z.string().default(''),
  sort: z.enum(['relevant', 'duration', 'course']).default('relevant'),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || searchParams.get('query') || ''
    const sortParam = (searchParams.get('sort') || 'relevant') as 'relevant' | 'duration' | 'course'

    const parsed = searchRequestSchema.safeParse({
      query: q,
      sort: ['relevant', 'duration', 'course'].includes(sortParam) ? sortParam : 'relevant',
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid search parameters' }, { status: 400 })
    }

    const searchResponse = await searchContent(parsed.data.query, parsed.data.sort)
    return NextResponse.json(searchResponse)
  } catch (error) {
    console.error('[Search API Error]:', error)
    return NextResponse.json(
      { error: 'An error occurred while executing search query' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = searchRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const searchResponse = await searchContent(parsed.data.query, parsed.data.sort)
    return NextResponse.json(searchResponse)
  } catch (error) {
    console.error('[Search API Error]:', error)
    return NextResponse.json(
      { error: 'An error occurred while executing search query' },
      { status: 500 }
    )
  }
}
