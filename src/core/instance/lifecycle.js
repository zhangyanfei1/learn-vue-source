import {noop} from '../util/index'
import Watcher from '../observer/watcher'

export let activeInstance = null

export function initLifecycle (vm) {
  const options = vm.$options
  let parent = options.parent
  if (parent && !options.abstract) {
    parent.$children.push(vm)
  }
  vm.$parent = parent
  vm.$children = []
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    debugger
    const vm = this

    const prevVnode = vm._vnode

    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }

    activeInstance = prevActiveInstance
  }
}
export function mountComponent (vm, el, hydrating){
  vm.$el = el

  let updateComponent
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)

  return vm
}