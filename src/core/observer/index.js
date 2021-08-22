import VNode from '../vdom/vnode'
import Dep from './dep'
import {
  isObject,
  hasOwn,
  isPlainObject
} from '../util/index'
export function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    Array.isArray(value) || isPlainObject(value)
  ) {
    ob = new Observer(value)
  }
  return ob
}

export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // def(value, '__ob__', this)
    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

export function defineReactive (obj, key, val,customSetter,shallow){
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = val
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = val
      if (newVal === value) {
        return
      }
      if (false) {
        // setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // childOb = observe(newVal)
      dep.notify()
    }
  })
}