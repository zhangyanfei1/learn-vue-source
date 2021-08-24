import {isUnaryTag} from './util'
import modules from './modules/index'
import directives from './directives/index'
export const baseOptions = {
  expectHTML: true,
  modules,
  directives,
  isUnaryTag
}