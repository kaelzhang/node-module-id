'use strict'

module.exports = parse
parse.format = format

const REGEX_PARSE_ID = /^((?:[^\/])+?)(?:@([^\/]+))?(\/.*)?$/
// On android 2.2,
// `[^\/]+?` will fail to do the lazy match, but `(?:[^\/]+?)` works.
// Shit, go to hell!

// @param {string} resolved path-resolved module identifier
function parse (id) {
  if (!id) {
    throw new TypeError('`id` must be a string.')
  }

  let match = id.match(REGEX_PARSE_ID)
  let name = match[1]

  // 'a/inner' -> 'a@latest/inner'
  let version = match[2]
  let path = match[3] || ''

  // There always be matches
  return new Pkg(name, version, path)
}


class Pkg {
  constructor (name, version, path) {
    this.name = name
    this.version = version
    this.path = path
  }

  format () {
    return format(this)
  }

  normalize_url () {
    return this.name + '/'
    + (this.version || '*')
    + (this.path || '/' + this.name + '.js')
  }

  get pkg () {
    return this.name + '@' + (this.version || '*')
  }
}


function format (obj) {
  if (Object(obj) !== obj) {
    throw new TypeError('`obj` must be an object.')
  }

  let version_slice = obj.version
      ? '@' + obj.version
      : ''

  return obj.name + version_slice + (obj.path || '')
}
