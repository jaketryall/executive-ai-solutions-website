import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolio',
  title: 'Portfolio Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Project Type',
      type: 'string',
      description: 'e.g., E-Commerce, Marketing Agency, Healthcare Portal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Live Site URL',
      type: 'url',
      description: 'The live website URL (without https://)',
      validation: (Rule) => Rule.required().custom((url) => {
        if (!url) return true
        // Remove protocol if included
        const cleanUrl = url.toString().replace(/^https?:\/\//, '')
        return cleanUrl === url ? true : 'Please enter URL without protocol (e.g., example.com)'
      }),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview Screenshot',
      type: 'image',
      description: 'Screenshot of the website (16:10 aspect ratio recommended)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color for project accent (e.g., #0066ff)',
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false,
      }),
    }),
    defineField({
      name: 'tech',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tech stack used (e.g., Next.js, TypeScript, etc.)',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Main features of the project',
      validation: (Rule) => Rule.required().min(3).max(6),
    }),
    defineField({
      name: 'stats',
      title: 'Performance Stats',
      type: 'object',
      fields: [
        {
          name: 'visitors',
          title: 'Monthly Visitors',
          type: 'string',
          description: 'e.g., 15K+/mo',
        },
        {
          name: 'conversion',
          title: 'Conversion Rate',
          type: 'string',
          description: 'e.g., 8.2%',
        },
        {
          name: 'speed',
          title: 'Page Speed Score',
          type: 'string',
          description: 'e.g., 99/100',
        },
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'string',
      description: 'e.g., 4 weeks, 2 months',
      initialValue: '4 weeks',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project prominently',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which projects appear (lower numbers first)',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'previewImage',
    },
  },
})