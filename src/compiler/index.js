import {createCompilerCreator} from './create-compiler'
import { parse } from './parser/index'
import {generate} from './codegen/index'
//createCompiler  函数  接收 createCompiler(baseOptions)  ，返回  两个函数
export const createCompiler = createCompilerCreator(function baseCompile (
  template, options
) {
  const ast = parse(template.trim(), options)
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})