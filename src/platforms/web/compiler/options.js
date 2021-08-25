import {isUnaryTag, canBeLeftOpenTag} from './util'
import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'
import modules from './modules/index'
import directives from './directives/index'
export const baseOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  canBeLeftOpenTag,
  mustUseProp, //TODO
  getTagNamespace,
  isReservedTag
}