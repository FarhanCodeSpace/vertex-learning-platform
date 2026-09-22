import { defineArrayMember, defineField, defineType } from 'sanity'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Supported providers: YouTube, Vimeo, or Bunny video embed URL',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Display duration, e.g. "12m 45s" or "15:20"',
    }),
    defineField({
      name: 'freePreview',
      title: 'Free Preview',
      type: 'boolean',
      description: 'Whether this lesson has a free preview badge',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      type: 'number',
      description: 'Learner count for display',
      initialValue: 0,
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points ("In this lesson you will")',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bullet points highlighting what the student will learn in this lesson',
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      description: 'Optional pro tip callout for this lesson',
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes',
      type: 'blockContent',
      description: 'Rich text notes, code snippets, and explanations for the lesson',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'resource' })],
      description: 'Associated project files, links, code repositories, or documents',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      media: 'poster',
      freePreview: 'freePreview',
    },
    prepare({ title, duration, media, freePreview }) {
      const badges = [
        duration,
        freePreview ? 'Free Preview' : null,
      ].filter(Boolean).join(' • ')

      return {
        title,
        subtitle: badges,
        media,
      }
    },
  },
})
