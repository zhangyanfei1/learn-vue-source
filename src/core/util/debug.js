import { noop } from '../../shared/util'
import config from '../config'
export let warn = noop
export let generateComponentTrace = (noop) // work around flow check
export let formatComponentName = (noop)

const hasConsole = typeof console !== 'undefined'
warn = (msg, vm) => { //对代码异常情况的处理
  const trace = vm ? generateComponentTrace(vm) : ''
  if (config.warnHandler) {

  } else if (hasConsole && (!config.silent)) {
    console.error(`[Vue warn]: ${msg}${trace}`)
  }
}

formatComponentName = (vm, includeFile) => {
  if (vm.$root === vm) {
    return '<Root>'
  }
}

generateComponentTrace = vm => {
  if (vm._isVue && vm.$parent) {

  } else {
    return `\n\n(found in ${formatComponentName(vm)})`
  }
}