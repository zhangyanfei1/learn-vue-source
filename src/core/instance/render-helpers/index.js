import { createTextVNode } from '../../vdom/vnode'
import {toString} from '../../../shared/util'
export function installRenderHelpers (target) {
  target._v = createTextVNode
  target._s = toString
}