import {createCompilerCreator} from './create-compiler'
import { parse } from './parser/index'
import {generate} from './codegen/index'
import {optimize} from './optimizer'
//createCompiler  函数  接收 createCompiler(baseOptions)  ，返回  两个函数
export const createCompiler = createCompilerCreator(function baseCompile (
  template, options
) {
  //parse 作用是将字符串模板编译成ast
  const ast = parse(template.trim(), options)
  //静态化
  if (options.optimize !== false) { //TODO
    optimize(ast, options)
  }
  //ast转换成代码字符串
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})