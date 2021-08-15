function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {

  }
}

export function createCompileToFunctionFn (compile) {
  return function compileToFunctions (template, options, vm){
    const compiled = compile(template, options)
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.render = function (h) {
      return h('div', [h('h1', 'aaa111')])
    }
    res.staticRenderFns = {} //TODO
    return res
  }
}