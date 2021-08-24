import Vue from './runtime/index'
import { query } from './util/index'
import { warn, cached } from '../../core/util/index'
import {compileToFunctions} from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating){
  el = el && query(el)
  if (el === document.body || el === document.documentElement) {
    warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
  const options = this.$options
  if (!options.render) { //只有在没有传入render的时候，才考虑使用模板
    let template = options.template
    if (template) { //template几种不同传入方式处理
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          if (!template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }

    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: true,
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters
      }, this)
      debugger
      options.render = render
    }
  }

  return mount.call(this, el, hydrating)
}

function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions //把你的模板编译成 render函数

export default Vue