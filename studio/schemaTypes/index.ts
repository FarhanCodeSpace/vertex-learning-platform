import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { course } from './course'
import { instructor } from './instructor'
import { lesson } from './lesson'
import { moduleType } from './module'
import { blockContent } from './objects/blockContent'
import { learningOutcome } from './objects/learningOutcome'
import { resource } from './objects/resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    course,
    lesson,
    instructor,
    category,

    // Embedded Objects
    moduleType,
    learningOutcome,
    resource,
    blockContent,
  ],
}
