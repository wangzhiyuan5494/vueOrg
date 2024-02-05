/*
 * @Author: wzy
 * @Date: 2024-02-03 17:16:22
 * @LastEditTime: 2024-02-03 17:38:57
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/init.js
 */
import { initState } from "./initState";
export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		let vm = this;
		this.$options = options;
		// 初始化状态
		initState(vm);
	};
}
