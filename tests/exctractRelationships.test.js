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

  test('return nothing if included resources are not provided', () => {
    const relationships = {
      author: {
        data: { type: 'authors', id: '9' }
      }
    }

    expect(extractRelationships(relationships)).toBeUndefined()
  })
})
