(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

	/*
	 * @Author: wzy
	 * @Date: 2024-02-17 15:25:05
	 * @LastEditTime: 2024-02-17 21:32:07
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/utils/index.js
	 */
	// 策略模式
	var starts = {};
	starts.data = function () {};
	starts.computed = function () {};
	starts.watch = function () {};
	starts.methods = function () {};
	function mergeOptios(parent, child) {
	  console.log(parent, child);
	  for (var key in parent) {
	    mergeField(key);
	  }
	  for (var _key in child) {
	    mergeField(_key);
	  }
	  function mergeField(key) {
	    if (start[key]) {
	      starts[key](parent[key], child[key]);
	    } else {
	      child[key];
	    }
	  }
	}

	function initGlobApi(Vue) {
	  Vue.options = {};
	  Vue.mixin = function (mixin) {
	    mergeOptios(this.options, mixin);
	  };
	}

	function _iterableToArrayLimit(r, l) {
	  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	  if (null != t) {
	    var e,
	      n,
	      i,
	      u,
	      a = [],
	      f = !0,
	      o = !1;
	    try {
	      if (i = (t = t.call(r)).next, 0 === l) {
	        if (Object(t) !== t) return;
	        f = !1;
	      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
	    } catch (r) {
	      o = !0, n = r;
	    } finally {
	      try {
	        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
	      } finally {
	        if (o) throw n;
	      }
	    }
	    return a;
	  }
	}
	function _toPrimitive(t, r) {
	  if ("object" != typeof t || !t) return t;
	  var e = t[Symbol.toPrimitive];
	  if (void 0 !== e) {
	    var i = e.call(t, r || "default");
	    if ("object" != typeof i) return i;
	    throw new TypeError("@@toPrimitive must return a primitive value.");
	  }
	  return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
	  var i = _toPrimitive(t, "string");
	  return "symbol" == typeof i ? i : String(i);
	}
	function _typeof(o) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	    return typeof o;
	  } : function (o) {
	    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	  }, _typeof(o);
	}
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	  }
	}
	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}
	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-13 20:23:43
	 * @LastEditTime: 2024-02-14 22:23:46
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/compile/generate.js
	 */
	var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
	/**
	 * @description: 处理属性
	 * @param {*} attrs
	 * @return {*}
	 */
	function genPorps(attrs) {
	  var str = "";
	  var _loop = function _loop() {
	    var attr = attrs[i];
	    if (attr.name == "style") {
	      // {name: 'style', value: 'color: red;font: size 12px'}
	      // style:{color:red,fontsize:12px}
	      var obj = {};
	      attr.value.split(";").forEach(function (item) {
	        var _item$split = item.split(":"),
	          _item$split2 = _slicedToArray(_item$split, 2),
	          key = _item$split2[0],
	          val = _item$split2[1];
	        obj[key] = val;
	      });
	      attr.value = obj;
	    }
	    // 拼接
	    str = "".concat(str).concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
	  };
	  for (var i = 0; i < attrs.length; i++) {
	    _loop();
	  }
	  return "{".concat(str.slice(0, -1), "}");
	}
	/**
	 * @description: 处理子节点
	 * @return {*}
	 */
	function genChildren(el) {
	  var children = el.children;
	  if (children) {
	    return children.map(function (child) {
	      return gen(child);
	    }).join(",");
	  }
	}
	function gen(node) {
	  // 元素
	  if (node.type == 1) {
	    return generate(node);
	  } else {
	    // 文本
	    var text = node.text;
	    if (!defaultTagRE.test(text)) {
	      // 纯文本
	      return "_v(".concat(JSON.stringify(text), ")");
	    }
	    // 插值文本
	    var tokens = [];
	    var lastindex = defaultTagRE.lastIndex = 0;
	    var match;
	    while (match = defaultTagRE.exec(text)) {
	      var index = match.index;
	      if (index > lastindex) {
	        tokens.push(JSON.stringify(text.slice(lastindex, index)));
	      }
	      tokens.push("_s(".concat(match[1].trim(), ")"));
	      lastindex = index + match[0].length;
	      if (lastindex < text.length) {
	        tokens.push(JSON.stringify(text.slice(lastindex)));
	      }
	      debugger;
	      return "_v(".concat(tokens.join("+"), ")");
	    }
	  }
	}
	function generate(el) {
	  // 属性{ id:App,style:{color:ReadableByteStreamController,fontsize:12px}}
	  var children = genChildren(el);
	  var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genPorps(el.attrs)) : "null", ",").concat(children ? "".concat(children) : "null", ")");
	  // code _c(div,{style:{"color":" red","font-size":" 12px"}},_v("hello"))
	  return code;
	}

	var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名称
	var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //<span:xx>
	var startTagOpen = new RegExp("^<".concat(qnameCapture)); //开头箭头
	var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 标签结束
	var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 标签属性
	var startTagClose = /^\s*(\/?)>/;
	// 创建AST语法树
	function creatASTElement(tag, attrs) {
	  return {
	    tag: tag,
	    // 元素
	    attrs: attrs,
	    // 属性
	    children: [],
	    //子节点
	    type: 1,
	    parent: null
	  };
	}
	var root; // 跟元素
	var creatParent; // 当前的父元素
	// 数据结构栈
	var stack = [];
	function start$1(tag, attrs) {
	  // 开始的标签
	  var element = creatASTElement(tag, attrs);
	  if (!root) {
	    root = element;
	  }
	  creatParent = element;
	  stack.push(element);
	}
	function charts(text) {
	  // 文本
	  text = text.replace(/\s/g, "");
	  if (text) {
	    creatParent.children.push({
	      type: 3,
	      text: text
	    });
	  }
	}
	function end(tag) {
	  // 结束标签
	  var element = stack.pop();
	  creatParent = stack[stack.length - 1];
	  if (creatParent) {
	    element.parent = creatParent.tag;
	    creatParent.children.push(element);
	  }
	}
	function parseHTML(html) {
	  while (html) {
	    // 判断标签
	    var textEnd = html.indexOf("<");
	    if (textEnd == 0) {
	      // 开始标签
	      var startTagMatch = parseStartTag();
	      if (startTagMatch) {
	        start$1(startTagMatch.tagName, startTagMatch.attrs);
	      }
	      // 结束标签
	      var endTagMatch = html.match(endTag);
	      if (endTagMatch) {
	        advance(endTagMatch[0].length);
	        end(endTagMatch[1]);
	      }
	    }
	    var text = void 0;
	    if (textEnd > 0) {
	      // 文本
	      // 获取文本内容
	      text = html.substring(0, textEnd);
	    }
	    if (text) {
	      charts(text);
	      advance(text.length);
	    }
	  }
	  function parseStartTag() {
	    var start = html.match(startTagOpen);
	    if (!start) return;
	    var match = {
	      tagName: start[1],
	      attrs: []
	    };
	    // 删除开始标签
	    advance(start[0].length);
	    // 获取属性
	    var attr;
	    var end;
	    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
	      match.attrs.push({
	        name: attr[1],
	        value: attr[3] || attr[4] || attr[5]
	      });
	      advance(attr[0].length);
	    }
	    if (end) {
	      advance(end[0].length);
	      return match;
	    }
	  }
	  function advance(n) {
	    html = html.substring(n);
	  }
	  return root;
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-12 22:07:27
	 * @LastEditTime: 2024-02-14 22:24:04
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/compile/index.js
	 */
	function compileToFunction(el) {
	  // 将html 变成ast语法树
	  var ast = parseHTML(el);

	  // 将ast 语法树变成 render 函数 1）ast语法树 变成 字符串 2）字符串变成函数
	  var code = generate(ast);

	  // 将ast字符串变成函数

	  var render = new Function("with(this){return ".concat(code, "}"));
	  return render;
	}
	/**
	 *  <div id="app">
	        hello{{msg}}
	 *       <h1> hello word</h1>
	 *  </div>
	 * 
	 * render(){ _c 解析标签
	 *	 return _c('div',{id:app},_v('hello'+_s(msg)),_c('h1',_v('hello word')))
	 * 
	 * }
	 * 
	 * 
	 * 
	 */

	/*
	import { observer } from './index';
	 * @Author: wzy
	 * @Date: 2024-02-03 18:49:19
	 * @LastEditTime: 2024-02-14 22:24:13
	 * @LastEditors: wzy
	 * @Description: 对数组类型进行响应式处理
	 * @FilePath: /myVue/src/observe/arr.js
	 */
	// 重写数组
	// 获取数组原来的方法
	var oldArrayProtoMethods = Array.prototype;
	// 继承
	var ArrayMehods = Object.create(oldArrayProtoMethods);
	// 劫持
	var methods = ["push", "pop", "shift", "unshift", "sort", "splice", "reverse"];
	methods.forEach(function (item) {
	  ArrayMehods[item] = function () {
	    // 对追加数据进行响应式处理
	    var inserted;
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	    switch (item) {
	      case "push":
	      case "unshift":
	        inserted = args;
	        break;
	      case "splice":
	        inserted = args.splice(2);
	        break;
	    }
	    // 如果有追加的实例则将追加的数据进行响应式处理
	    var ob = this.__ob__;
	    if (inserted) {
	      ob.observerArray(inserted);
	    }
	    var result = oldArrayProtoMethods[item].apply(this, args);
	    return result;
	  };
	});

	function observer(data) {
	  if (_typeof(data) !== "object" || data == null) {
	    return data;
	  }
	  // 对象类型处理
	  return new Observer(data);
	}
	var Observer = /*#__PURE__*/function () {
	  function Observer(data) {
	    _classCallCheck(this, Observer);
	    // 给data定义一个属性 将observer内置的方法绑定到上面，方便后续逻辑调用
	    Object.defineProperty(data, "__ob__", {
	      enumerable: false,
	      value: this
	    });
	    if (Array.isArray(data)) {
	      data.__proto__ = ArrayMehods;
	      // 如果是数组对象
	      this.observerArray(data);
	    } else {
	      // 对象
	      this.walk(data); // 遍历
	    }
	  }
	  _createClass(Observer, [{
	    key: "walk",
	    value: function walk(data) {
	      var keys = Object.keys(data);
	      for (var i = 0; i < keys.length; i++) {
	        // 对每个属性进行劫持
	        var key = keys[i];
	        var value = data[key];
	        defineReactive(data, key, value);
	      }
	    }
	  }, {
	    key: "observerArray",
	    value: function observerArray(data) {
	      // 处理数组内是对象的情况
	      for (var i = 0; i < data.length; i++) {
	        observer(data[i]);
	      }
	    }
	  }]);
	  return Observer;
	}();
	function defineReactive(data, key, value) {
	  // 对像类型进行递归处理,深度劫持
	  observer(value);
	  Object.defineProperty(data, key, {
	    get: function get() {
	      return value;
	    },
	    set: function set(newValue) {
	      if (newValue == value) return;
	      observer(newValue); // 如果设置的是对象，则进行数据响应
	      value = newValue;
	    }
	  });
	}

	// 总结：
	// 1.对象类型处理
	// Object.defineProperty 有缺点 只能对 对象中的一个属性进行劫持
	// 深层嵌套对象需要遍历 递归处理
	// 用户在对劫持数据进行set操作时 如果新的数据是对象类型也需要进行响应式处理

	// 2.数组
	// 对数组的劫持采用的是，重写可以改变数组本省的7个方法（push,pop,shift,unshift,splice,sort,reverse）

	/*
	 * @Author: wzy
	 * @Date: 2024-02-03 17:28:41
	 * @LastEditTime: 2024-02-14 22:23:43
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/initState.js
	 */
	function initState(vm) {
	  var opts = vm.$options;
	  //判断
	  if (opts.props) ;
	  if (opts.methods) ;
	  if (opts.data) {
	    debugger;
	    initData(vm);
	  }
	  if (opts.computed) ;
	  if (opts.watch) ;
	}
	function initData(vm) {
	  var data = vm.$options.data;
	  // 判断data类型是对象还是函数 获取data配置
	  data = vm._data = typeof data == "function" ? data.call(vm) : data; //注意这里this指向
	  // 将data上所有的属性代理到vm实例上
	  for (var key in data) {
	    proxy(vm, "_data", key);
	  }
	  // 对data进行劫持
	  observer(data);
	}
	function proxy(vm, source, key) {
	  Object.defineProperty(vm, key, {
	    get: function get() {
	      return vm[source][key];
	    },
	    set: function set(newValue) {
	      vm[source][key] = newValue;
	    }
	  });
	}

	/*
	import { parseHTML } from '../compile/parseAst';
	 * @Author: wzy
	 * @Date: 2024-02-14 22:29:18
	 * @LastEditTime: 2024-02-17 15:20:16
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/vnode/path.js
	 */
	/**
	 * @description:将虚拟dom变成真实dom
	 * @param {*} oldVnode
	 * @param {*} vnode
	 * @return {*}
	 */
	function patch(oldVnode, vnode) {
	  // console.log(oldVnode, vnode);
	  var el = createEl(vnode);
	  // console.log(el);
	  // 替换 dom  1）获取父节点 2）插入 3）删除
	  var parentEl = oldVnode.parentNode;
	  parentEl.insertBefore(el, oldVnode.nextsibling);
	  parentEl.removeChild(oldVnode);
	  return el;
	}
	/**
	 * @description: 创建dom
	 * @return {*}
	 */
	function createEl(vnode) {
	  var tag = vnode.tag,
	    children = vnode.children;
	    vnode.key;
	    vnode.data;
	    var text = vnode.text;
	  if (typeof tag == "string") {
	    //标签
	    vnode.el = document.createElement(tag);
	    if (children && children.length > 0) {
	      children.forEach(function (child) {
	        vnode.el.appendChild(createEl(child));
	      });
	    }
	  } else {
	    vnode.el = document.createTextNode(text);
	  }
	  return vnode.el;
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-14 19:37:36
	 * @LastEditTime: 2024-02-17 15:19:51
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/lifecycle.js
	 */
	function mountComponent(vm, el) {
	  vm._update(vm._render());
	}
	function lifecycleMinxin(Vue) {
	  Vue.prototype._update = function (vnode) {
	    // console.log(vnode);
	    var vm = this;
	    vm.$el = patch(vm.$el, vnode);
	  };
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-03 17:16:22
	 * @LastEditTime: 2024-02-14 22:28:11
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/init.js
	 */
	function initMixin(Vue) {
	  Vue.prototype._init = function (options) {
	    var vm = this;
	    this.$options = options;
	    // 初始化状态
	    initState(vm);
	    // 渲染模版 el
	    if (vm.$options.el) {
	      vm.$mount(vm.$options.el);
	    }
	  };

	  // 创建 $mount
	  Vue.prototype.$mount = function (el) {
	    var vm = this;
	    el = document.querySelector(el); // 获取元素
	    vm.$el = el;
	    var options = vm.$options;
	    if (!options.render) {
	      var template = options.template;
	      if (!template && el) {
	        el = el.outerHTML;

	        // 变成ast语法树

	        var render = compileToFunction(el);
	        /**
	         * 将render函数变成vnode
	         * 将vnode变成真实dom放到页面上
	         *
	         */
	        options.render = render;
	      }
	    }
	    mountComponent(vm);
	  };
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-14 19:33:30
	 * @LastEditTime: 2024-02-14 22:26:06
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/vnode/index.js
	 */
	/**
	 * @description: 虚拟dom
	 * @param {*} Vue
	 * @return {*}
	 */
	function renderMixin(Vue) {
	  Vue.prototype._c = function () {
	    // 标签
	    // 创建标签
	    return createElement.apply(void 0, arguments);
	  };
	  Vue.prototype._v = function (text) {
	    // 文本
	    return createText(text);
	  };
	  Vue.prototype._s = function (val) {
	    return val == null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
	    // 变量
	  };
	  Vue.prototype._render = function () {
	    var vm = this;
	    var render = vm.$options.render;
	    var vnode = render.call(this);
	    return vnode;
	  };
	}
	function createElement(tag) {
	  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }
	  return vnode(tag, data, children);
	}
	function vnode(tag, data, children, text) {
	  return {
	    tag: tag,
	    data: data,
	    children: children,
	    text: text
	  };
	}
	function createText(text) {
	  return vnode(undefined, undefined, undefined, text);
	}

	/*
	 * @Author: your name
	 * @Date: 2024-02-03 10:45:00
	 * @LastEditTime: 2024-02-17 15:17:50
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/index.js
	 * 可以输入预定的版权声明、个性签名、空行等
	 */
	function Vue(options) {
	  this._init(options);
	}
	initMixin(Vue);
	lifecycleMinxin(Vue); // 添加生命周期
	renderMixin(Vue); // 添加render

	//	全局放方法
	initGlobApi(Vue);

	return Vue;

}));
//# sourceMappingURL=vue.js.map
