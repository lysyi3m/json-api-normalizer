import { camelizeData } from '../src'

describe('camelizeData()', () => {
  test('correctly process json', () => {
    const json = {
      data: [
        {
          id: '1',
          book_title: 'Some Title',
          book_author: {
            id: '9',
            first_name: 'Bob'
          }
        },
        {
          id: '2',
          book_title: 'Some Another',
          book_author: {
            id: '10',
            first_name: 'Alice'
          }
        }
      ]
    }

    expect(camelizeData(json)).toMatchObject({
      data: [
        {
          id: '1',
          bookTitle: 'Some Title',
          bookAuthor: {
            id: '9',
            firstName: 'Bob'
          }
        },
        {
          id: '2',
          bookTitle: 'Some Another',
          bookAuthor: {
            id: '10',
            firstName: 'Alice'
          }
        }
      ]
    })
  })
})
