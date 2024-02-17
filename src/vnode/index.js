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
export function renderMixin(Vue) {
	Vue.prototype._c = function () {
		// 标签
		// 创建标签
		return createElement(...arguments);
	};
	Vue.prototype._v = function (text) {
		// 文本
		return createText(text);
	};
	Vue.prototype._s = function (val) {
		return val == null
			? ""
			: typeof val === "object"
			? JSON.stringify(val)
			: val;
		// 变量
	};
	Vue.prototype._render = function () {
		let vm = this;
		let render = vm.$options.render;
		let vnode = render.call(this);
		return vnode;
	};
}
function createElement(tag, data = {}, ...children) {
	return vnode(tag, data, children);
}
function vnode(tag, data, children, text) {
	return {
		tag,
		data,
		children,
		text,
	};
}
function createText(text) {
	return vnode(undefined, undefined, undefined, text);
}
