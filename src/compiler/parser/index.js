import {parseHTML} from './html-parser'
import { parseText } from './text-parser'
import { baseWarn,pluckModuleFunction } from '../helpers'
import { no } from '../../shared/util'
import { isIE, isEdge } from '../../core/util/env'

export let warn
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent
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
  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no
  const isReservedTag = options.isReservedTag || no
  maybeComponent = (el) => !!(
    el.component ||
    el.attrsMap[':is'] ||
    el.attrsMap['v-bind:is'] ||
    !(el.attrsMap.is ? isReservedTag(el.attrsMap.is) : isReservedTag(el.tag))
  )

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  const whitespaceOption = options.whitespace
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false
  function closeElement (element) { //关闭标签
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
  }

  function trimEndingWhitespace (el) {

  }

  function checkRootConstraints (el) {

  }


  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag, //是否是一元标签
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments, //是否保存注释
    outputSourceRange: options.outputSourceRange,
    start (tag, attrs, unary, start, end) {
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      let element = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }
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
    if (
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name, attrs[i])
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}