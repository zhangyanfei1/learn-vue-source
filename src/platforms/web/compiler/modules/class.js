import {
  getAndRemoveAttr
} from '../../../../compiler/helpers'

function transformNode (el, options) {
  const staticClass = getAndRemoveAttr(el, 'class')
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass)
  }
}

function genData (el) {
  let data = ''
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`
  }
  // if (el.classBinding) {
  //   data += `class:${el.classBinding},`
  // }
  return data
}


export default {
  // staticKeys: ['staticClass'],
  transformNode,
  genData
}