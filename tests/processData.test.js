import { processData } from '../src'

describe('processData()', () => {
  test('correctly process json with no relationships', () => {
    const json = {
      data: [
        {
          id: '1',
          type: 'posts',
          attributes: {
            title: 'Some Title'
          }
        },
        {
          id: '2',
          type: 'posts',
          attributes: {
            title: 'Some Another'
          }
        }
      ]
    }

    expect(processData(json)).toMatchObject(
      [
        {
          id: '1',
          title: 'Some Title'
        },
        {
          id: '2',
          title: 'Some Another'
        }
      ]
    )
  })

  test('correctly process json with relationships', () => {
    const json = {
      data: [
        {
          id: '1',
          type: 'posts',
          attributes: {
            title: 'Some Title'
          },
          relationships: {
            author: {
              data: { type: 'authors', id: '9' }
            }
          }
        },
        {
          id: '2',
          type: 'posts',
          attributes: {
            title: 'Some Another'
          },
          relationships: {
            author: {
              data: { type: 'authors', id: '10' }
            }
          }
        }
      ],
      included: [
        {
          id: '9',
          type: 'authors',
          attributes: {
            name: 'Bob'
          }
        },
        {
          id: '10',
          type: 'authors',
          attributes: {
            name: 'Alice'
          }
        }
      ]
    }

    expect(processData(json)).toMatchObject(
      [
        {
          id: '1',
          title: 'Some Title',
          author: {
            id: '9',
            name: 'Bob'
          }
        },
        {
          id: '2',
          title: 'Some Another',
          author: {
            id: '10',
            name: 'Alice'
          }
        }
      ]
    )
  })
})
