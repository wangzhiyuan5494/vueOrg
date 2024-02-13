(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
	function start(tag, attrs) {
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
	        start(startTagMatch.tagName, startTagMatch.attrs);
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
	  console.log("root", root);
	  return root;
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-12 22:07:27
	 * @LastEditTime: 2024-02-13 14:59:44
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/compile/index.js
	 */
	function compileToFunction(el) {
	  parseHTML(el);
	}

	/*
	 * @Author: wzy
	 * @Date: 2024-02-03 17:16:22
	 * @LastEditTime: 2024-02-12 22:14:13
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/init.js
	 */
	function initMixin(Vue) {
	  Vue.prototype._init = function (options) {
	    var vm = this;
	    this.$options = options;
	    // 初始化状态
	    console.log(vm);
	    // 渲染模版 el
	    if (vm.$options.el) {
	      vm.$mount(vm.$options.el);
	    }
	  };

	  // 创建 $mount
	  Vue.prototype.$mount = function (el) {
	    var vm = this;
	    el = document.querySelector(el); // 获取元素
	    var options = vm.$options;
	    if (!options.render) {
	      var template = options.template;
	      if (!template && el) {
	        el = el.outerHTML;
	        console.log(el);

	        // 变成ast语法树

	        compileToFunction(el);
	      }
	    }
	  };
	}

	/*
	 * @Author: your name
	 * @Date: 2024-02-03 10:45:00
	 * @LastEditTime: 2024-02-03 17:39:01
	 * @LastEditors: wzy
	 * @Description:
	 * @FilePath: /myVue/src/index.js
	 * 可以输入预定的版权声明、个性签名、空行等
	 */
	function Vue(options) {
	  this._init(options);
	}
	initMixin(Vue);

	return Vue;

}));
//# sourceMappingURL=vue.js.map
