import { defineField, defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Video ID / Identifier',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
    }),
    defineField({
      name: 'chapters',
      title: 'Table of Contents / Chapters',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'chapter',
          title: 'Chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'startSeconds',
            },
            prepare({ title, subtitle }) {
              const minutes = Math.floor((subtitle || 0) / 60)
              const seconds = Math.floor((subtitle || 0) % 60)
              const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`
              return {
                title: title || 'Untitled Chapter',
                subtitle: `${timeFormatted} (${subtitle}s)`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'chunk',
          title: 'Transcript Chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Spoken Text / Transcript',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
})
