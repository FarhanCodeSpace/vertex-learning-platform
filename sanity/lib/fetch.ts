import { type QueryParams } from 'next-sanity'

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

  return client.fetch<T>(query, params, {
    next: {
      revalidate: typeof revalidate === 'number' ? revalidate : undefined,
      tags,
    },
    cache: revalidate === false ? 'no-store' : undefined,
  })
}
