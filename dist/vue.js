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

function noop$1 (a, b, c) {}

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

const no$1 = (a, b, c) => {
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

const _toString = Object.prototype.toString;

function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}


function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}


function cached(fn){
  const cache = Object.create(null);
  return (function cachedFn (str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to
}

var config = ({
  /**
   * Parse the real tag name for the specific platform.
   */
   parsePlatformTagName: identity,
   isReservedTag: no$1,
   optionMergeStrategies: Object.create(null),
   warnHandler: null,
   silent: false
})

const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

const isIE = UA && /msie|trident/.test(UA);

const isEdge = UA && UA.indexOf('edge/') > 0;

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

const callbacks = [];
let pending = false;
function flushCallbacks () {
  debugger
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
let timerFunc;


if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop$1);
  };
  
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
function nextTick (cb, ctx) {
  callbacks.push(() => {
    try {
      cb.call(ctx);
    } catch (e) {
      // TODO
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
}

let warn = noop$1;
let tip = noop$1;
let generateComponentTrace = (noop$1); // work around flow check
let formatComponentName = (noop$1);

const hasConsole = typeof console !== 'undefined';
warn = (msg, vm) => { //对代码异常情况的处理
  const trace = vm ? generateComponentTrace(vm) : '';
  if (config.warnHandler) {

  } else if (hasConsole && (!config.silent)) {
    console.error(`[Vue warn]: ${msg}${trace}`);
  }
};

tip = (msg, vm) => {
  if (hasConsole && (!config.silent)) {
    console.warn(`[Vue tip]: ${msg}` + (
      vm ? generateComponentTrace(vm) : ''
    ));
  }
};

formatComponentName = (vm, includeFile) => {
  if (vm.$root === vm) {
    return '<Root>'
  }
};

generateComponentTrace = vm => {
  if (vm._isVue && vm.$parent) {

  } else {
    return `\n\n(found in ${formatComponentName(vm)})`
  }
};

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

let uid = 0;

class Dep {
  constructor () {
    this.id = uid++;
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify () {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

Dep.target = null;
const targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

const queue = [];
let has = {};
let waiting = false;
let flushing = false;
let index = 0;
function flushSchedulerQueue () {
  let watcher, id;
  debugger
  flushing = true;
  // currentFlushTimestamp = getNow()
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }
}


function queueWatcher (watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {

    }
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

let uid$1 = 0;
class Watcher {
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    this.id = ++uid$1;
    this.active = true;
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {

    }

    this.value = this.lazy
      ? undefined
      : this.get();
  }

  get () {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter(); //TODO
    } catch (e) {

    } finally {
      // popTarget()
    }
    return value
  }

  addDep (dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  update () {
    /* istanbul ignore else */
    {
      debugger
      queueWatcher(this);
    }
  }

  run () {
    if (this.active) {
      const value = this.get();
    }
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

  new Watcher(vm, updateComponent, noop$1, null, true /* isRenderWatcher */);

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

function installRenderHelpers (target) {
  target._v = createTextVNode;
  target._s = toString;
}

function initRender (vm) {
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}

function renderMixin (Vue) {
  installRenderHelpers(Vue.prototype);
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

function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    Array.isArray(value) || isPlainObject(value)
  ) {
    ob = new Observer(value);
  }
  return ob
}

class Observer {
  constructor (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    // def(value, '__ob__', this)
    if (Array.isArray(value)) {
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk (obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function defineReactive (obj, key, val,customSetter,shallow){
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = val;
      if (Dep.target) {
        dep.depend();
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = val;
      if (newVal === value) {
        return
      }
      {
        val = newVal;
      }
      // childOb = observe(newVal)
      dep.notify();
    }
  });
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop$1,
  set: noop$1
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
function initState (vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function initData (vm) {
  let data = vm.$options.data;
  debugger
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
    if (!isPlainObject(data)) {
      data = {};
      //TODO
    }
  const keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    {
      proxy(vm, `_data`, key);
    }
  }

  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  return data.call(vm, vm)
}

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
    initState(vm);

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

const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

const isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

const isReservedTag = (tag) => {
  return isHTMLTag(tag) || isSVG(tag)
};

const isPreTag = (tag) => tag === 'pre';

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

const mustUseProp = (tag, type, attr) => {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

function query (el){
  if (typeof el === 'string') {
    const selected = document.querySelector(el);
    if (!selected) {
      warn('Canot find element：' + el);
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

const isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

const canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

function baseWarn (msg, range) {
  console.error(`[Vue compiler]: ${msg}`);
}

function pluckModuleFunction (modules, key){
  return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
}

function getAndRemoveAttr (el, name, removeFromMap){
  let val;
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList;
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

function transformNode (el, options) {
  const staticClass = getAndRemoveAttr(el, 'class');
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
}

function genData (el) {
  let data = '';
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`;
  }
  // if (el.classBinding) {
  //   data += `class:${el.classBinding},`
  // }
  return data
}


var klass = {
  // staticKeys: ['staticClass'],
  transformNode,
  genData
}

// import style from './style'
// import model from './model'

var modules$1 = [
  klass
  // style,
  // model
]

function model (){
  
}

function text (el, dir) {
  
}

function html (el, dir) {

}

var directives = {
  model,
  text,
  html
}

const baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives,
  isPreTag,
  isUnaryTag,
  canBeLeftOpenTag,
  mustUseProp, //TODO
  getTagNamespace,
  isReservedTag
};

function generateCodeFrame (source, start, end){
  
}

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  const cache = Object.create(null);
  return function compileToFunctions (template, options, vm){
    options = extend({}, options);
    const warn$$1 = options.warn || warn;
    delete options.warn;
    {
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    const key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    } //生成一个key

    const compiled = compile(template, options);
    {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(e => {
            warn$$1(
              `Error compiling template:\n\n${e.msg}\n\n` +
              generateCodeFrame(template, e.start, e.end),
              vm
            );
          });
        } else {
          warn$$1(
            `Error compiling template:\n\n${template}\n\n` +
            compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
            vm
          );
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(e => tip(e.msg, vm));
        } else {
          compiled.tips.forEach(msg => tip(msg, vm));
        }
      }
    }
    const res = {};
    const fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    // res.render = function (h) {
    //   return h('div', [h('h1', 'aaa111')])
    // }
    res.staticRenderFns = {}; //TODO
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        );
      }
    }
    return (cache[key] = res)
  }
}

// detect problematic expressions in a template
function detectErrors (ast, warn) {
  
}

function createCompilerCreator (baseCompile) {
  //接收一个baseOptions，返回  compile，compileToFunctions

  return function createCompiler (baseOptions) {
    function compile (template, options){
      // 合并baseOption 和 options
      const finalOptions = Object.create(baseOptions);
      const errors = [];
      const tips = [];

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg);
      };
      if (options) {
        if (options.outputSourceRange) {
          const leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = (msg, range, tip) => {
            const data = { msg };
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }
            (tip ? tips : errors).push(data);
          };
        }
        //合并 modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        //合并 directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }
      finalOptions.warn = warn;
      const compiled = baseCompile(template.trim(), finalOptions);
      detectErrors(compiled.ast, warn);
      compiled.errors = errors;
      compiled.tips = tips;
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

const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
};

const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, match => decodingMap[match])
}

function parseHTML (html, options) {
  const stack = [];
  const expectHTML = options.expectHTML;
  const isUnaryTag = options.isUnaryTag || no;
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
          handleStartTag(startTagMatch);
          continue
        }
      }

      let text, rest, next;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          next = rest.indexOf('<', 1);
          if (next < 0) break
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      //纯文本，没有 标签
      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (!stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length });
      }
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

  function handleStartTag (match) {
    const tagName = match.tagName;
    const unarySlash = match.unarySlash;
    const unary = isUnaryTag(tagName) || !!unarySlash;
    const l = match.attrs.length;
    const attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i];
      const value = args[3] || args[4] || args[5] || '';
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName;
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      pos = 0;
    }

    if (pos >= 0) {
      for (let i = stack.length - 1; i >= pos; i--) {
        if ((i > pos || !tagName) && options.warn) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`,
            { start: stack[i].start, end: stack[i].end }
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

       // Remove the open elements from the stack
       stack.length = pos;
       lastTag = pos && stack[pos - 1].tag;
    }
  }

  function advance (n) {
    index += n;
    html = html.substring(n);
  }
}

function parseFilters (exp) {
  return exp
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const buildRegex = function () { //TODO

};
function parseText (text, delimiters){
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  const tokens = [];
  const rawTokens = [];
  let lastIndex = tagRE.lastIndex = 0;
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    const exp = parseFilters(match[1].trim());
    tokens.push(`_s(${exp})`);
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

let warn$1;
let platformIsPreTag;
let platformMustUseProp;
let platformGetTagNamespace;
let transforms;
let delimiters;

function createASTElement (tag, attrs, parent){
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


function processElement (element, options){
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
}
/**
 * Convert HTML string to AST.
 */

function parse (template, options){
  warn$1 = options.warn || baseWarn;
  platformIsPreTag = options.isPreTag || no$1;
  platformMustUseProp = options.mustUseProp || no$1;
  platformGetTagNamespace = options.getTagNamespace || no$1;
  const isReservedTag = options.isReservedTag || no$1;
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  const stack = [];
  const preserveWhitespace = options.preserveWhitespace !== false;
  const whitespaceOption = options.whitespace;
  let root;
  let currentParent;
  let inVPre = false;
  function closeElement (element) { //关闭标签
    if (!inVPre && !element.processed) {
      element = processElement(element, options);
    }
  }

  parseHTML(template, {
    warn: warn$1,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag, //是否是一元标签
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments, //是否保存注释
    outputSourceRange: options.outputSourceRange,
    start (tag, attrs, unary, start, end) {
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      let element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }
      if (!root) {
        root = element;
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        // closeElement(element)
      }
    },
    end (tag, start, end) {
      const element = stack[stack.length - 1];
      // pop stack
      stack.length -= 1;
      // currentParent = stack[stack.length - 1]
      // if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      //   element.end = end
      // }
      closeElement(element);
    },
    chars (text, start, end) {
      const children = currentParent.children;
      if (text) {
        let res;
        let child;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))){ //TODO
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          };
        } else if (text !== ' ' || !children.length) {
          child = {
            type: 3,
            text
          };
        }
        if (child) {
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          children.push(child);
        }
      }
    },
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

function makeAttrsMap (attrs) {
  const map = {};
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$1('duplicate attribute: ' + attrs[i].name, attrs[i]);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

function guardIESVGBug (attrs) {
  const res = [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

var baseDirectives = {
  
}

class CodegenState {
  constructor (options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    const isReservedTag = options.isReservedTag || no$1;
    this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  }
}
function generate (ast, options){
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }
  {
    let code;
    if (el.component) {
      //TODO
    } else {
      let data;
      { //TODO
        data = genData$1(el, state);
      }
      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`;
    }
    return code
  }
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
){
  const children = el.children;
  if (children.length) {
    const el = children[0];
    const gen = altGenNode || genNode;
    return `[${children.map(c => gen(c, state)).join(',')}]`
  }
}

function genData$1 (el, state) {
  let data = '{';
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  data = data.replace(/,$/, '') + '}';
  return data
}

function genNode (node, state) {
  if (node.type === 1) {
    // return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    // return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}

function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

//createCompiler  函数  接收 createCompiler(baseOptions)  ，返回  两个函数
const createCompiler = createCompilerCreator(function baseCompile (
  template, options
) {
  //parse 作用是将字符串模板编译成ast
  const ast = parse(template.trim(), options);
  //静态化
  if (options.optimize !== false) { //TODO
    
  }
  //ast转换成代码字符串
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

const { compile, compileToFunctions } = createCompiler(baseOptions);

let div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

const idToTemplate = cached(id => {
  const el = query(id);
  return el && el.innerHTML
});

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydrating){
  el = el && query(el);
  if (el === document.body || el === document.documentElement) {
    warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    );
    return this
  }
  const options = this.$options;
  if (!options.render) { //只有在没有传入render的时候，才考虑使用模板
    let template = options.template;
    if (template) { //template几种不同传入方式处理
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          if (!template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
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
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: true,
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters
      }, this);
      debugger
      options.render = render;
    }
  }

  return mount.call(this, el, hydrating)
};

function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions; //把你的模板编译成 render函数

return Vue;

})));
