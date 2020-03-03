import { extractRelationships } from '../src'

describe('extractRelationships()', () => {
  test('correctly map relationships using provided included resources', () => {
    const relationships = {
      author: {
        data: { type: 'authors', id: '9' }
      }
    }

    const included = [{
      id: '9',
      type: 'authors',
      attributes: {
        name: 'Bob'
      }
    }]

    expect(extractRelationships(relationships, included)).toMatchObject({
      author: {
        id: '9',
        name: 'Bob'
      }
    })
  })

  test('correctly map multiple relationships using provided included resources', () => {
    const relationships = {
      author: {
        data: { type: 'authors', id: '9' }
      },
      tags: {
        data: [
          { type: 'tags', id: '1' },
          { type: 'tags', id: '2' }
        ]
      }
    }

    const included = [
      {
        id: '9',
        type: 'authors',
        attributes: {
          name: 'Bob'
        }
      },
      {
        id: '1',
        type: 'tags',
        attributes: {
          title: 'Book'
        }
      },
      {
        id: '2',
        type: 'tags',
        attributes: {
          title: 'Novel'
        }
      }
    ]

    expect(extractRelationships(relationships, included)).toMatchObject({
      author: {
        id: '9',
        name: 'Bob'
      },
      tags: [
        { id: '1', title: 'Book' },
        { id: '2', title: 'Novel' }
      ]
    })
  })

  test('return nothing if included resources are not provided', () => {
    const relationships = {
      author: {
        data: { type: 'authors', id: '9' }
      }
    }

    expect(extractRelationships(relationships)).toBeUndefined()
  })
})
