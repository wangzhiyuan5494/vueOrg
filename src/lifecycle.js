import { patch } from "./vnode/path";

/*
 * @Author: wzy
 * @Date: 2024-02-14 19:37:36
 * @LastEditTime: 2024-02-17 15:19:51
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/lifecycle.js
 */
export function mountComponent(vm, el) {
	vm._update(vm._render());
}

export function lifecycleMinxin(Vue) {
	Vue.prototype._update = function (vnode) {
		// console.log(vnode);
		let vm = this;
		vm.$el = patch(vm.$el, vnode);
	};
}
