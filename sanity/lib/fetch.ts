import { SeverityNumber } from '@opentelemetry/api-logs'
import { type QueryParams } from 'next-sanity'

import { emitPostHogLog } from '@/lib/posthog-logger'
import { client } from './client'

export interface FetchOptions {
  revalidate?: number | false
  tags?: string[]
}

/**
 * Server-side helper to fetch data from Sanity with caching and revalidation support.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  options = {},
}: {
  query: string
  params?: QueryParams
  options?: FetchOptions
}): Promise<T> {
  const { revalidate = 60, tags = [] } = options
  const startedAt = Date.now()

  try {
    const result = await client.fetch<T>(query, params, {
      next: {
        revalidate: typeof revalidate === 'number' ? revalidate : undefined,
        tags,
      },
      cache: revalidate === false ? 'no-store' : undefined,
    })

    await emitPostHogLog('Sanity request completed', SeverityNumber.INFO, {
      event: 'sanity_request',
      status: 'success',
      duration_ms: Date.now() - startedAt,
      tag_count: tags.length,
      cache_mode: revalidate === false ? 'no_store' : 'revalidate',
    })

    return result
  } catch (error) {
    await emitPostHogLog('Sanity request completed', SeverityNumber.ERROR, {
      event: 'sanity_request',
      status: 'failed',
      duration_ms: Date.now() - startedAt,
      tag_count: tags.length,
      error_type: error instanceof Error ? error.name : 'unknown',
    })
    throw error
  }
}
