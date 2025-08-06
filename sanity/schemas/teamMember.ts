export default {
  name: 'teamMember',
  type: 'document',
  title: 'Team Member',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'role',
      type: 'string',
      title: 'Role/Position',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'bio',
      type: 'text',
      title: 'Bio',
      description: 'Short biography of the team member'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Profile Image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'initials',
      type: 'string',
      title: 'Initials',
      description: 'Used if no image is provided',
      validation: (Rule: any) => Rule.max(2)
    },
    {
      name: 'social',
      type: 'object',
      title: 'Social Links',
      fields: [
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter URL'
        },
        {
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn URL'
        },
        {
          name: 'github',
          type: 'url',
          title: 'GitHub URL'
        }
      ]
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