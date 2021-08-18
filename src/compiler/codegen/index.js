export class CodegenState {
  
}
export function generate (ast, options){
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: '',
    staticRenderFns: {}
  }
}

export function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }
  if (false) { //TODo

  } else {
    let code
    if (el.component) {

    } else {
      let data
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

}