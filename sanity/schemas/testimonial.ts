export default {
  name: 'testimonial',
  type: 'document',
  title: 'Testimonial',
  fields: [
    {
      name: 'quote',
      type: 'text',
      title: 'Quote',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author Name',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'role',
      type: 'string',
      title: 'Author Role/Position',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'company',
      type: 'string',
      title: 'Company'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Author Image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Rating',
      validation: (Rule: any) => Rule.min(1).max(5),
      initialValue: 5
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show this testimonial prominently',
      initialValue: false
    },
    {
      name: 'metrics',
      type: 'array',
      title: 'Success Metrics',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label'
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value'
            }
          ]
        }
      ]
    }
  ]
}