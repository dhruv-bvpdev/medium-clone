export default {
  name: 'comments',
  title: 'Comments',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: "Comments won't show on the site until approval"
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text'
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [
        {
          type: 'post'
        }
      ]
    }
  ]
}
