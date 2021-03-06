import normalizer from '../src'

const multipleResourcesJSON = {
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
        first_name: 'Bob'
      }
    },
    {
      id: '10',
      type: 'authors',
      attributes: {
        first_name: 'Alice'
      }
    }
  ],
  meta: {
    records_count: '2'
  }
}

const singleResourcesJSON = {
  data: {
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
  included: [
    {
      id: '9',
      type: 'authors',
      attributes: {
        first_name: 'Bob'
      }
    }
  ],
  meta: {
    records_count: '1'
  }
}

describe('normalizer()', () => {
  describe('multiple resources', () => {
    test('correctly process json with relationships', () => {
      expect(normalizer(multipleResourcesJSON)).toMatchObject({
        data: [
          {
            id: '1',
            title: 'Some Title',
            author: {
              id: '9',
              first_name: 'Bob'
            }
          },
          {
            id: '2',
            title: 'Some Another',
            author: {
              id: '10',
              first_name: 'Alice'
            }
          }
        ],
        meta: {
          records_count: '2'
        }
      })
    })

    test('correctly process json and camelize keys', () => {
      expect(normalizer(multipleResourcesJSON, { camelize: true })).toMatchObject({
        data: [
          {
            id: '1',
            title: 'Some Title',
            author: {
              id: '9',
              firstName: 'Bob'
            }
          },
          {
            id: '2',
            title: 'Some Another',
            author: {
              id: '10',
              firstName: 'Alice'
            }
          }
        ],
        meta: {
          recordsCount: '2'
        }
      })
    })
  })

  describe('single resources', () => {
    test('correctly process json with relationships', () => {
      expect(normalizer(singleResourcesJSON)).toMatchObject({
        data: {
          id: '1',
          title: 'Some Title',
          author: {
            id: '9',
            first_name: 'Bob'
          }
        },
        meta: {
          records_count: '1'
        }
      })
    })

    test('correctly process json and camelize keys', () => {
      expect(normalizer(singleResourcesJSON, { camelize: true })).toMatchObject({
        data: {
          id: '1',
          title: 'Some Title',
          author: {
            id: '9',
            firstName: 'Bob'
          }
        },
        meta: {
          recordsCount: '1'
        }
      })
    })
  })
})
