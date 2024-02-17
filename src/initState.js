/*
 * @Author: wzy
 * @Date: 2024-02-03 17:28:41
 * @LastEditTime: 2024-02-14 22:23:43
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/initState.js
 */

import { observer } from "./observe/index.js";

export function initState(vm) {
	let opts = vm.$options;
	//判断
	if (opts.props) {
	}
	if (opts.methods) {
	}
	if (opts.data) {
		debugger;
		initData(vm);
	}

	if (opts.computed) {
	}
	if (opts.watch) {
	}
}
function initData(vm) {
	let data = vm.$options.data;
	// 判断data类型是对象还是函数 获取data配置
	data = vm._data = typeof data == "function" ? data.call(vm) : data; //注意这里this指向
	// 将data上所有的属性代理到vm实例上
	for (let key in data) {
		proxy(vm, "_data", key);
	}
	// 对data进行劫持
	observer(data);
}
function proxy(vm, source, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[source][key];
		},
		set(newValue) {
			vm[source][key] = newValue;
		},
	});
}
