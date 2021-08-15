import {isUndef, isDef, isPrimitive} from '../util/index'
import VNode from './vnode'
export function createPatchFunction (backend) {
  const { modules, nodeOps } = backend

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm
  ){
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag

    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)
      createChildren(vnode, children, insertedVnodeQueue)
      insert(parentElm, vnode.elm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm)
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i],insertedVnodeQueue, vnode.elm)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance)
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm)
      }

      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        insert(parentElm, vnode.elm, refElm)
        return true
      }
    }
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {

      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {

    }
    vnode.elm = vnode.componentInstance.$el
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {

    const insertedVnodeQueue = []
    //老的不存在，增
    if (isUndef(oldVnode)) {
      createElm(vnode, insertedVnodeQueue)
    } else {
      //新旧都存在，比对
      const isRealElement = isDef(oldVnode.nodeType)
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
      }

      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      createElm(vnode, insertedVnodeQueue, parentElm, nodeOps.nextSibling(oldElm))
    }

    return vnode.elm
  }
}