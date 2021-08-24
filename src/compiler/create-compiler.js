import {createCompileToFunctionFn} from './to-function'
import { detectErrors } from './error-detector'
import { extend } from '../shared/util'
export function createCompilerCreator (baseCompile) {
  //接收一个baseOptions，返回  compile，compileToFunctions

  return function createCompiler (baseOptions) {
    function compile (template, options){
      // 合并baseOption 和 options
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg)
      }
      if (options) {
        if (options.outputSourceRange) {
          const leadingSpaceLength = template.match(/^\s*/)[0].length

          warn = (msg, range, tip) => {
            const data = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            (tip ? tips : errors).push(data)
          }
        }
        //合并 modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        //合并 directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }
      finalOptions.warn = warn
      const compiled = baseCompile(template.trim(), finalOptions)
      detectErrors(compiled.ast, warn)
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }
    //返回  compile，compileToFunctions
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}