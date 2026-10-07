import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@sanity/client'
import {
  SANITY_CONTEXT_SLUG,
  SANITY_CONTEXT_GROQ_FILTER,
  SANITY_CONTEXT_INSTRUCTIONS,
} from '../sanity/agent/search-context'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89pwd9pn'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

async function seedContextDoc() {
  console.log('--- Seeding Sanity Context Document ---')
  console.log(`Project ID: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Slug: ${SANITY_CONTEXT_SLUG}`)

  if (!token) {
    console.warn('⚠️ No SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN found. Generating NDJSON payload instead.')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-09-22',
    token,
    useCdn: false,
  })

  const contextDoc = {
    _id: `sanity.agentContext.${SANITY_CONTEXT_SLUG}`,
    _type: 'sanity.agentContext',
    slug: {
      _type: 'slug',
      current: SANITY_CONTEXT_SLUG,
    },
    groqFilter: SANITY_CONTEXT_GROQ_FILTER,
    instructions: SANITY_CONTEXT_INSTRUCTIONS,
  }

  try {
    if (token) {
      const res = await client.createOrReplace(contextDoc)
      console.log('✅ Successfully created/updated Sanity Context document in dataset:', res._id)
    }
  } catch (error) {
    console.error('⚠️ Could not write directly to Sanity API (viewer token or permission limitation):', (error as Error).message)
  }

  console.log('\n📄 Context Document Payload:')
  console.log(JSON.stringify(contextDoc, null, 2))
  console.log('\n✨ Done!')
}

seedContextDoc().catch((err) => {
  console.error('Error seeding context document:', err)
  process.exit(1)
})
