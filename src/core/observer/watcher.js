import Dep, { pushTarget, popTarget } from './dep'
export default class Watcher {
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    debugger
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {

    }

    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter() //TODO
    } catch (e) {

    }
    return value
  }
}