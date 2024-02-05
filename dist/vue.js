(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  /*
  import { observer } from './index';
   * @Author: wzy
   * @Date: 2024-02-03 18:49:19
   * @LastEditTime: 2024-02-05 12:17:20
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
      console.log("劫持数组");
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
          console.log("args", args);
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
        console.log("数组");
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
   * @LastEditTime: 2024-02-05 11:56:21
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
   * @Author: wzy
   * @Date: 2024-02-03 17:16:22
   * @LastEditTime: 2024-02-03 17:38:57
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
