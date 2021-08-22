import Dep, { pushTarget, popTarget } from './dep'
import { queueWatcher } from './scheduler'
let uid = 0
export default class Watcher {
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    this.id = ++uid
    this.active = true
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
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

    } finally {
      // popTarget()
    }
    return value
  }

  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  update () {
    /* istanbul ignore else */
    if (false) {
      // this.dirty = true
    } else {
      debugger
      queueWatcher(this)
    }
  }

  run () {
    if (this.active) {
      const value = this.get()
    }
  }
}