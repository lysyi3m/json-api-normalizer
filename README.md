# json-api-normalizer

Utility to normalize JSON:API data with ease

![Node.js CI](https://github.com/lysyi3m/json-api-normalizer/workflows/Node.js%20CI/badge.svg?branch=master)
[![npm version](https://badge.fury.io/js/%40lysyi3m%2Fjson-api-normalizer.svg)](https://badge.fury.io/js/%40lysyi3m%2Fjson-api-normalizer)

## Description

json-api-normalizer helps to processing [JSON:API](https://jsonapi.org/) data into more developer-friendly form for further usage. It fully supports [latest JSON:API specification](https://jsonapi.org/format/) including one-to-one & one-to-many relationships, so you don't need to manually format each response to work with regular resource collections. It's main feature is correct exctracting so called ["sparse fieldsets"](https://jsonapi.org/format/#fetching-sparse-fieldsets) and nesting them under corresponding resource.

## Installation

```sh
$ npm install @lysyi3m/json-api-normalizer
```

or using [Yarn](https://yarnpkg.com/):
```sh
$ yarn add @lysyi3m/json-api-normalizer
```

## Usage

```js
import normalizer from '@lysyi3m/json-api-normalizer';

// make a request tou your API endpoint and get response

const result = normalizer(response.data);

console.log(result.data) // data is normalized resources with exctracted & nested relationships
console.log(result.meta) // meta object
console.log(result.links) // links object
```

## Examples

### Basic

Assuming endpoint `/articles?include=author`, your response data would be like this:

```json
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!",
      "body": "The shortest article. Ever.",
      "created": "2015-05-22T14:56:29.000Z",
      "updated": "2015-05-22T14:56:28.000Z"
    },
    "relationships": {
      "author": {
        "data": {"id": "42", "type": "people"}
      }
    }
  }],
  "included": [
    {
      "type": "people",
      "id": "42",
      "attributes": {
        "name": "John",
        "age": 80,
        "gender": "male"
      }
    }
  ]
}
```

And after normalization:
```json
{
  "data": [
    {
      "id": "1",
      "title": "JSON:API paints my bikeshed!",
      "body": "The shortest article. Ever.",
      "created": "2015-05-22T14:56:29.000Z",
      "updated": "2015-05-22T14:56:28.000Z",
      "author": {
        "id": "42",
        "name": "John",
        "age": "80",
        "gender": "male"
      }
    }
  ]
}
```

### Complex relationships

In case one-to-one, one-to-many or nested relationships (i.e., when relationship resource has its own relationships), json-api-normalizer will proccess them at once, using matching by resource id & type altogether.

Assuming endpoint `/articles?include=author,comments`, your response data would be like this:

```json
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "links": {
      "self": "http://example.com/articles/1"
    },
    "relationships": {
      "author": {
        "links": {
          "self": "http://example.com/articles/1/relationships/author",
          "related": "http://example.com/articles/1/author"
        },
        "data": { "type": "people", "id": "9" }
      },
      "comments": {
        "links": {
          "self": "http://example.com/articles/1/relationships/comments",
          "related": "http://example.com/articles/1/comments"
        },
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    }
  }],
  "included": [{
    "type": "people",
    "id": "9",
    "attributes": {
      "first-name": "Dan",
      "last-name": "Gebhardt",
      "twitter": "dgeb"
    },
    "links": {
      "self": "http://example.com/people/9"
    }
  }, {
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "2" }
      }
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}
```

And after normalization:

```json
{
  "data":[
    {
      "id":"1",
      "links":{
        "self":"http://example.com/articles/1"
      },
      "title":"JSON:API paints my bikeshed!",
      "author":{
        "id":"9",
        "links":{
          "self":"http://example.com/people/9"
        },
        "first-name":"Dan",
        "last-name":"Gebhardt",
        "twitter":"dgeb"
      },
      "comments":[
        {
          "id":"5",
          "links":{
            "self":"http://example.com/comments/5"
          },
          "body":"First!",
        },
        {
          "id":"12",
          "links":{
            "self":"http://example.com/comments/12"
          },
          "body":"I like XML better",
          "author":{
            "id":"9",
            "links":{
              "self":"http://example.com/people/9"
            },
            "first-name":"Dan",
            "last-name":"Gebhardt",
            "twitter":"dgeb"
          }
        }
      ]
    }
  ],
}
```

## Available options

### `Camelize`

By default json-api-normalizer does not transform data keys. If `camelize` option is set to `true` all keys will be converted to [camelCase](https://wikipedia.org/wiki/Camel_case).
