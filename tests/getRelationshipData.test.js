import { getRelationshipData } from '../src'

describe('getRelationshipData()', () => {
  test('return correct relationship data for provided relationship', () => {
    const relationship = { type: 'authors', id: '9' }

    const included = [
      {
        id: '9',
        type: 'authors',
        attributes: {
          name: 'Bob'
        }
      }
    ]

    expect(getRelationshipData(relationship, included)).toMatchObject({
      id: '9',
      name: 'Bob'
    })
  })

  test('return nothing if included resources are not provided', () => {
    const relationship = { type: 'authors', id: '9' }

    expect(getRelationshipData(relationship)).toBeUndefined()
  })
})
