import {parseHTML} from './html-parser'
import { baseWarn } from '../helpers'

export let warn
/**
 * Convert HTML string to AST.
 */
export function parse (template, options){
  warn = options.warn || baseWarn
  let root
  let currentParent
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary, start, end) {
      
    },
    end () {},
    chars (text) {},
    comment (text, start, end) {
      if (currentParent) {
        const child = {
          type: 3,
          text,
          isComment: true
        }
        currentParent.children.push(child)
      }
    }
  })
  return root
}