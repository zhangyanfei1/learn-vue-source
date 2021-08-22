import { noop } from '../../shared/util'
import config from '../config'
export let warn = noop
export let generateComponentTrace = (noop) // work around flow check


const hasConsole = typeof console !== 'undefined'
warn = (msg, vm) => {
  const trace = vm ? generateComponentTrace(vm) : ''
  if (config.warnHandler) {

  } else if (hasConsole && (!config.silent)) {
    console.error(`[Vue warn]: ${msg}${trace}`)
  }
}

generateComponentTrace = vm => {}