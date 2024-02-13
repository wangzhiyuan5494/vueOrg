/*
 * @Author: wzy
 * @Date: 2024-02-03 17:16:22
 * @LastEditTime: 2024-02-12 22:14:13
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/init.js
 */
import { compileToFunction } from "./compile/index.js";
export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		let vm = this;
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
		let vm = this;
		el = document.querySelector(el); // 获取元素
		let options = vm.$options;
		if (!options.render) {
			let template = options.template;
			if (!template && el) {
				el = el.outerHTML;
				console.log(el);

				// 变成ast语法树

				let ast = compileToFunction(el);
			}
		}
	};
}
