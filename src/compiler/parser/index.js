import {parseHTML} from './html-parser'
import { parseText } from './text-parser'
import { baseWarn,pluckModuleFunction } from '../helpers'

export let warn
let transforms
let delimiters

export function createASTElement (tag, attrs, parent){
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
  }
}


export function processElement (element, options){
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
}
/**
 * Convert HTML string to AST.
 */

export function parse (template, options){
  warn = options.warn || baseWarn

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  delimiters = options.delimiters

  const stack = []
  let root
  let currentParent
  let inVPre = false
  function closeElement (element) {
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
  }
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary, start, end) {
      let element = createASTElement(tag, attrs, currentParent)
      if (!root) {
        root = element
      }
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        // closeElement(element)
      }
    },
    end (tag, start, end) {
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      // currentParent = stack[stack.length - 1]
      // if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      //   element.end = end
      // }
      closeElement(element)
    },
    chars (text, start, end) {
      const children = currentParent.children
      if (text) {
        let res
        let child
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))){ //TODO
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else if (text !== ' ' || !children.length) {
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          if (options.outputSourceRange) {
            child.start = start
            child.end = end
          }
          children.push(child)
        }
      }
    },
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

function makeAttrsMap (attrs) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    // if (
    //   process.env.NODE_ENV !== 'production' &&
    //   map[attrs[i].name] && !isIE && !isEdge
    // ) {
    //   warn('duplicate attribute: ' + attrs[i].name, attrs[i])
    // }
    map[attrs[i].name] = attrs[i].value
  }
  return map
} 