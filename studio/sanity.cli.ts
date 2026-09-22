import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '89pwd9pn',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  typegen: {
    path: '../sanity/lib/queries.ts',
    schema: './schemaTypes',
    generates: '../sanity/types.ts',
  },
})
