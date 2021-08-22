export function noop (a, b, c) {}

export const identity = (_) => _

export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

export function isTrue (v) {
  return v === true
}

export const no = (a, b, c) => {
  return (a === 'div' || a === 'h1')
} // TODO

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key){
  return hasOwnProperty.call(obj, key)
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function makeMap (
  str,
  expectsLowerCase
) {
  const map = Object.create(null)
  const list= str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

const _toString = Object.prototype.toString

export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}


export function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

