export default {
  name: 'faq',
  type: 'document',
  title: 'FAQ',
  fields: [
    {
      name: 'question',
      type: 'string',
      title: 'Question',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'answer',
      type: 'text',
      title: 'Answer',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'Technical', value: 'technical' },
          { title: 'Support', value: 'support' }
        ]
      }
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