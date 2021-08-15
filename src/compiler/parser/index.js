import {parseHTML} from './html-parser'

/**
 * Convert HTML string to AST.
 */
export function parse (template, options){
  let root
  let currentParent
  parseHTML(template, {
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