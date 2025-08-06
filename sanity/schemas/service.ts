export default {
  name: 'service',
  type: 'document',
  title: 'Service',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon Type',
      description: 'Choose an icon type',
      options: {
        list: [
          { title: 'Chatbot', value: 'chatbot' },
          { title: 'Voice', value: 'voice' },
          { title: 'Consulting', value: 'consulting' },
          { title: 'Integration', value: 'integration' }
        ]
      }
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'features',
      type: 'array',
      title: 'Features',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              type: 'string',
              title: 'Icon'
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label'
            }
          ]
        }
      ]
    },
    {
      name: 'isLarge',
      type: 'boolean',
      title: 'Large Card',
      description: 'Should this be displayed as a large card?',
      initialValue: false
    },
    {
      name: 'order',
      type: 'number',
      title: 'Display Order'
    }
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}