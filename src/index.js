import { isArray, isEmpty, isNil, find, isPlainObject, camelCase } from 'lodash'

/**
 * Extract data relationships using id-type mapping of realtionship object with included entities
 * @param {object} relationships - resource relationships object
 * @param {Array} included - included resources from JSON:API response
 * @returns {object} - extracted relationships data
 */
export function extractRelationships (relationships, included) {
  if (isNil(included) || isEmpty(included)) {
    return
  }

  const extractedRelationships = {}

  Object.keys(relationships).forEach(key => {
    const { data } = relationships[key]

    if (isNil(data) || isEmpty(data)) {
      return
    }

    const { attributes } = find(included, { id: data.id, type: data.type }) || {}

    if (isNil(attributes) || isEmpty(attributes)) {
      return
    }

    extractedRelationships[key] = Object.assign({}, { id: data.id }, attributes)
  })

  return extractedRelationships
}

/**
 * Run processing on provided json
 * @param {object} { data, included } - JSON:API response object
 * @returns {object} - processed data
 */
export function processData ({ data, included }) {
  const dataArray = isArray(data) ? data : [data]

  return dataArray.map(elem => {
    const {
      attributes = {},
      id,
      links,
      meta,
      relationships = {}
    } = elem

    const extractedRelationships = extractRelationships(relationships, included) || {}

    return Object.assign({}, { id, links, meta }, attributes, extractedRelationships)
  })
}

/**
 * Camelize object keys recursively
 * - if provided data is array, process each element of array
 * - if provided data is plain object, camelize its keys
 * - otherwise - return initial value
 * @param {*} data - data to process
 * @returns {*} - processed data with camelized keys
 */
export function camelizeData (data) {
  if (isArray(data)) {
    return data.map(elem => camelizeData(elem))
  }

  if (isPlainObject(data)) {
    return Object.keys(data).reduce((acc, key) => {
      acc[camelCase(key)] = camelizeData(data[key])

      return acc
    }, {})
  }

  return data
}

/**
 * Main function
 * - run processing on provided json object with options
 * - if `options.camelize` provided, convert data keys to camelCase
 * @param {object} json - JSON:API response object
 * @param {object} [{ camelize = false }={}] - optional options
 * @returns {object} - processed object with data, meta & links objects
 */
export default function normalizer (json, { camelize = false } = {}) {
  let { links, meta } = json

  let data = processData(json)

  if (camelize) {
    data = camelizeData(data)
    meta = camelizeData(meta)
  }

  return { data, meta, links }
}
