import {warn} from '../../../core/util/index'
export function query (el){
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      warn('Canot find element：' + el)
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}