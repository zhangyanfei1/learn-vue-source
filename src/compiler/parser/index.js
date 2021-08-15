import {parseHTML} from './html-parser'

/**
 * Convert HTML string to AST.
 */
export function parse (template, options){
  let root
  let currentParent
  parseHTML(template, {
    shouldKeepComment: options.comments,
    start (tag, attrs, unary) {},
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