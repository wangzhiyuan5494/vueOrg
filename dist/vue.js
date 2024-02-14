(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
   * @LastEditTime: 2024-02-14 19:13:06
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
      str = "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
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
        console.log("text", text);
        return "_v(".concat(JSON.stringify(text), ")");
      }
      // 插值文本
      var tokens = [];
      var lastindex = defaultTagRE.lastIndex = 0;
      var match;
      while (match = defaultTagRE.exec(text)) {
        console.log(match);
        var index = match.index;
        if (index > lastindex) {
          tokens.push(JSON.stringify(text.slice(lastindex)));
        }
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastindex = index + match[0].length;
        if (lastindex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastindex)));
        }
        return "_v(".concat(tokens.join("+"), ")");
      }
    }
  }
  function generate(el) {
    // 属性{ id:App,style:{color:ReadableByteStreamController,fontsize:12px}}
    var children = genChildren(el);
    var code = "_c(".concat(el.tag, ",").concat(el.attrs.length ? "".concat(genPorps(el.attrs)) : "null", ",").concat(children ? "".concat(children) : "null", ")");
    // code _c(div,{style:{"color":" red","font-size":" 12px"}},_v("hello"))
    console.log("code", code);
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
   * @LastEditTime: 2024-02-14 18:12:30
   * @LastEditors: wzy
   * @Description:
   * @FilePath: /myVue/src/compile/index.js
   */
  function compileToFunction(el) {
    // 将html 变成ast语法树
    var ast = parseHTML(el);

    // 将ast 语法树变成 render 函数 1）ast语法树 变成 字符串 2）字符串变成函数
    generate(ast);
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
