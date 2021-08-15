import Vue from './runtime/index'
import { query } from './util/index'
import {compileToFunctions} from './compiler/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating){
  el = el && query(el)
  const options = this.$options
  // if (options._componentTag) {
  //   let render = function(h) {
  //     return h('div', '这是一个子组件')
  //   }
  //   options.render = render
  // }
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {

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
      // let render = function () {
      //   console.log('render')
      // }
      debugger
      const { render, staticRenderFns } = compileToFunctions(template, {

      }, this)
      debugger
      options.render = render
    }
  }

  return mount.call(this, el, hydrating)
}

export default Vue