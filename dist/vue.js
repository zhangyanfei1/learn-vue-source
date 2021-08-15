(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

class VNode {
  constructor (
    tag, data, children, text, elm, context, componentOptions, asyncFactory
  ){
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.componentOptions = componentOptions;
    this.asyncFactory = asyncFactory;
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function noop (a, b, c) {}

const identity = (_) => _;

function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

function isTrue (v) {
  return v === true
}

const no = (a, b, c) => {
  return (a === 'div' || a === 'h1')
}; // TODO

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key){
  return hasOwnProperty.call(obj, key)
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function makeMap (
  str,
  expectsLowerCase
) {
  const map = Object.create(null);
  const list= str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

var config = ({
  /**
   * Parse the real tag name for the specific platform.
   */
   parsePlatformTagName: identity,
   isReservedTag: no,
   optionMergeStrategies: Object.create(null)
})

const strats = config.optionMergeStrategies;

function resolveAsset (options, type, id, warnMissing){
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type];
  if (hasOwn(assets, id)) return assets[id]
}

const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

function mergeOptions (parent, child, vm){
  const options = {};
  let key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key]);
  }

  return options
}

function normalizeChildren (children) {
  return isPrimitive(children)
  ? [createTextVNode(children)] : Array.isArray(children)
  ? normalizeArrayChildren(children)
  : undefined
}

function normalizeArrayChildren (children) {
  const res = [];
  let i, c;
  for (i = 0; i < children.length; i++) {
    c = children[i];

    if (Array.isArray(c)) {

    } else if (isPrimitive(c)) {

    } else {
      res.push(c);
    }
  }
  return res
}

class Watcher {
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    expOrFn();
  }
}

let activeInstance = null;

function initLifecycle (vm) {
  const options = vm.$options;
  let parent = options.parent;
  if (parent && !options.abstract) {
    parent.$children.push(vm);
  }
  vm.$parent = parent;
  vm.$children = [];
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    const vm = this;

    const prevVnode = vm._vnode;

    const prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode);
    }

    activeInstance = prevActiveInstance;
  };
}
function mountComponent (vm, el, hydrating){
  vm.$el = el;

  let updateComponent;
  updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };

  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);

  return vm
}

const componentVNodeHooks = {
  init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {

    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  prepatch (oldVnode, vnode) {

  },
  insert (vnode) {

  },
  destroy (vnode) {

  }
};

const hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (Ctor, data, context, children, tag){
  const baseCtor = context.$options._base;

  if (isUndef(Ctor)) {
    return
  }
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    return
  }

  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    //TODO
  }

  data = data || {};

  const propsData = ''; //TODO
  const listeners = data.on;

  //安装组件的钩子函数
  installComponentHooks(data);

  const name = Ctor.options.name || tag;
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  );
  return vnode

}

function installComponentHooks (data) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

function createComponentInstanceForVnode (vnode, parent){
  const options = {
    _isComponent: true,
    parent,
    _parentVnode: vnode
  };

  return new vnode.componentOptions.Ctor(options)
}

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;

function createElement (context, tag, data, children, normalizationType, alwaysNormalize){
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (context, tag, data, children, normalizationType){
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // children = simpleNormalizeChildren(children)
  }

  let vnode;
  if (typeof tag === 'string') {
    let Ctor;

    if (config.isReservedTag(tag)) {
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  }

  return vnode
}

function initRender (vm) {
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}

function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    const {render, _parentVnode} = vm.$options;
    vm.$vnode = _parentVnode;

    let vnode;
    vnode = render.call(vm._renderProxy, vm.$createElement);
    return vnode
  };
}

let initProxy;

initProxy = function initProxy (vm) {
  vm._renderProxy = vm;
};

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }

    initProxy(vm);
    initLifecycle(vm);
    initRender(vm);

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function resolveConstructorOptions (Ctor) {
  let options = Ctor.options;
  return options
}

function initInternalComponent (vm, options){
  const opts = vm.$options = Object.create(vm.constructor.options);
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
  }
}

function Vue (options) {
  this._init(options);
}

initMixin(Vue);

lifecycleMixin(Vue);
renderMixin(Vue);

function initExtend (Vue) {
  Vue.cid = 0;
  let cid = 1;

  Vue.extend = function (extendOptions){
    extendOptions = extendOptions || {};
    const Super = this;
    const SuperId = Super.cid;
    const Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    return Sub
  };
}

function initGlobalAPI (Vue) {
  Vue.options = Object.create(null);
  Vue.options._base = Vue;

  initExtend(Vue);
}

initGlobalAPI(Vue);

function createPatchFunction (backend) {
  const { modules, nodeOps } = backend;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm
  ){
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    const data = vnode.data;
    const children = vnode.children;
    const tag = vnode.tag;

    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      insert(parentElm, vnode.elm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm);
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i],insertedVnodeQueue, vnode.elm);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data;
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance);
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }

      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        return true
      }
    }
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {

      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {

    }
    vnode.elm = vnode.componentInstance.$el;
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {

    const insertedVnodeQueue = [];
    //老的不存在，增
    if (isUndef(oldVnode)) {
      createElm(vnode, insertedVnodeQueue);
    } else {
      //新旧都存在，比对
      const isRealElement = isDef(oldVnode.nodeType);
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode);
      }

      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);

      createElm(vnode, insertedVnodeQueue, parentElm, nodeOps.nextSibling(oldElm));
    }

    return vnode.elm
  }
}

function createElement$1 (tagName, vnode){
  const elm = document.createElement(tagName);
  return elm
}

function appendChild (node, child) {
  node.appendChild(child);
}

function tagName (node) {
  return node.tagName
}

function parentNode (node){
  return node.parentNode
}

function createTextNode (text){
  return document.createTextNode(text)
}

function nextSibling (node) {
  return node.nextSibling
}

var nodeOps = Object.freeze({
	createElement: createElement$1,
	appendChild: appendChild,
	tagName: tagName,
	parentNode: parentNode,
	createTextNode: createTextNode,
	nextSibling: nextSibling
});

const modules = '';

const patch = createPatchFunction({nodeOps, modules});

Vue.prototype.__patch__ = patch;

Vue.prototype.$mount = function (el, hydrating){
  return mountComponent(this, el, hydrating)
};

function query (el){
  if (typeof el === 'string') {
    const selected = document.querySelector(el);
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

const baseOptions = {
  
};

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {

  }
}

function createCompileToFunctionFn (compile) {
  return function compileToFunctions (template, options, vm){
    const compiled = compile(template, options);
    const res = {};
    const fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.render = function (h) {
      return h('div', [h('h1', 'aaa111')])
    };
    res.staticRenderFns = {}; //TODO
    return res
  }
}

function createCompilerCreator (baseCompile) {
  //接收一个baseOptions，返回  compile，compileToFunctions

  return function createCompiler (baseOptions) {
    function compile (template, options){
      const finalOptions = Object.create(baseOptions);
      const compiled = baseCompile(template.trim(), finalOptions);
      return compiled
    }
    //返回  compile，compileToFunctions
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const comment = /^<!\--/; //判断 <!--
const conditionalComment = /^<!\[/; //<![]
const doctype = /^<!DOCTYPE [^>]+>/i;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);


const isPlainTextElement = makeMap('script,style,textarea', true);

function parseHTML (html, options) {
  let index = 0;
  let last, lastTag;
  while (html) {
    last = html;
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->');
          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }
            advance(commentEnd + 3);
            continue
          }
        }

        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          const curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          continue
        }
      }

      
    } else {

    }

    if (html === last) {
      break
    }
  }

  function parseStartTag () {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function parseEndTag (tagName, start, end) {

  }

  function advance (n) {
    index += n;
    html = html.substring(n);
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (template, options){
  let root;
  let currentParent;
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
        };
        currentParent.children.push(child);
      }
    }
  });
  return root
}

function generate (ast, options){
  return {
    render: '',
    staticRenderFns: {}
  }
}

//createCompiler  函数  接收 createCompiler(baseOptions)  ，返回  两个函数
const createCompiler = createCompilerCreator(function baseCompile (
  template, options
) {
  const ast = parse(template.trim(), options);
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

const { compile, compileToFunctions } = createCompiler(baseOptions);

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydrating){
  el = el && query(el);
  const options = this.$options;
  // if (options._componentTag) {
  //   let render = function(h) {
  //     return h('div', '这是一个子组件')
  //   }
  //   options.render = render
  // }
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {

        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }

    if (template) {
      // let render = function () {
      //   console.log('render')
      // }
      const { render, staticRenderFns } = compileToFunctions(template, {

      }, this);
      options.render = render;
    }
  }

  return mount.call(this, el, hydrating)
};

return Vue;

})));
