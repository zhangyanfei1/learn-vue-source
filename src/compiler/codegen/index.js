import {baseWarn, pluckModuleFunction} from '../helpers'
import baseDirectives from '../directives/index'
import { extend, no } from '../../shared/util'
export class CodegenState {
  constructor (options) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    this.staticRenderFns = []
    this.pre = false
  }
}
export function generate (ast, options){
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

export function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }
  if (false) { //todo

  } else {
    let code
    if (el.component) {
      //TODO
    } else {
      let data
      if (true) { //TODO
        data = genData(el, state)
      }
      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    return code
  }
}

export function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
){
  const children = el.children
  if (children.length) {
    const el = children[0]
    const gen = altGenNode || genNode
    return `[${children.map(c => gen(c, state)).join(',')}]`
  }
}

export function genData (el, state) {
  let data = '{'
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  data = data.replace(/,$/, '') + '}'
  return data
}

function genNode (node, state) {
  if (node.type === 1) {
    // return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    // return genComment(node)
  } else {
    return genText(node)
  }
}

export function genText (text) {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}

function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}