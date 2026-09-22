import { defineArrayMember, defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
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
      name: 'summary',
      title: 'Summary / Subtitle',
      type: 'text',
      rows: 3,
      description: 'Marketing summary of the course',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'icon',
      title: 'Brand / Icon Identifier',
      type: 'string',
      description: 'Brand logo identifier (e.g. "nextjs", "docker", "typescript") or icon name',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'All Levels', value: 'All Levels' },
        ],
        layout: 'radio',
      },
      initialValue: 'Intermediate',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price ($ USD)',
      type: 'number',
      description: 'Course price in USD (0 for free)',
      initialValue: 0,
    }),
    defineField({
      name: 'duration',
      title: 'Total Duration',
      type: 'string',
      description: 'Display duration, e.g. "18h 24m"',
    }),
    defineField({
      name: 'popular',
      title: 'Popular / Featured Flag',
      type: 'boolean',
      description: 'Display a popular or featured badge on catalog and cards',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      type: 'number',
      description: 'Total enrolled students for display (e.g. 1420)',
      initialValue: 0,
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What You'll Learn (Learning Outcomes)",
      type: 'array',
      of: [defineArrayMember({ type: 'learningOutcome' })],
      description: 'List of key learning outcomes shown on the course detail page',
    }),
    defineField({
      name: 'modules',
      title: 'Course Modules',
      type: 'array',
      of: [defineArrayMember({ type: 'module' })],
      description: 'Ordered list of course modules containing lesson references',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      instructor: 'instructor.name',
      level: 'level',
      media: 'coverImage',
      popular: 'popular',
    },
    prepare({ title, instructor, level, media, popular }) {
      const details = [
        instructor ? `by ${instructor}` : null,
        level,
        popular ? '★ Popular' : null,
      ].filter(Boolean).join(' • ')

      return {
        title,
        subtitle: details,
        media,
      }
    },
  },
})
