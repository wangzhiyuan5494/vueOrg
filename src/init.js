/*
 * @Author: wzy
 * @Date: 2024-02-03 17:16:22
 * @LastEditTime: 2024-02-14 22:28:11
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/init.js
 */
import { compileToFunction } from "./compile/index.js";
import { initState } from "./initState.js";
import { mountComponent } from "./lifecycle.js";
export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		let vm = this;
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
		let vm = this;
		el = document.querySelector(el); // 获取元素
		vm.$el = el;
		let options = vm.$options;
		if (!options.render) {
			let template = options.template;
			if (!template && el) {
				el = el.outerHTML;

				// 变成ast语法树

				let render = compileToFunction(el);
				/**
				 * 将render函数变成vnode
				 * 将vnode变成真实dom放到页面上
				 *
				 */
				options.render = render;
			}
		}
		mountComponent(vm, el);
	};
}
