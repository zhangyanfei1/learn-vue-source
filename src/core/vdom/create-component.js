import {
  isUndef,
  isObject
} from '../util/index'

import { activeInstance } from '../instance/lifecycle'

import VNode from './vnode'

const componentVNodeHooks = {
  init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {

    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  prepatch (oldVnode, vnode) {

  },
  insert (vnode) {

  },
  destroy (vnode) {

  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

export function createComponent (Ctor, data, context, children, tag){
  const baseCtor = context.$options._base

  if (isUndef(Ctor)) {
    return
  }
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  if (typeof Ctor !== 'function') {
    return
  }

  let asyncFactory
  if (isUndef(Ctor.cid)) {
    //TODO
  }

  data = data || {}

  const propsData = '' //TODO
  const listeners = data.on

  //安装组件的钩子函数
  installComponentHooks(data)

  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode

}

function installComponentHooks (data) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    hooks[key] = componentVNodeHooks[key]
  }
}

export function createComponentInstanceForVnode (vnode, parent){
  const options = {
    _isComponent: true,
    parent,
    _parentVnode: vnode
  }

  return new vnode.componentOptions.Ctor(options)
}