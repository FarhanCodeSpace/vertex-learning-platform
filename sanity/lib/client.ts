import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN only when no auth token is present.
  // Private datasets require authenticated requests directly to the live API.
  useCdn: !token,
  token: typeof window === 'undefined' ? token : undefined,
  perspective: 'published',
  stega: false,
})
