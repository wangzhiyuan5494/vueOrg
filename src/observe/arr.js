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
let oldArrayProtoMethods = Array.prototype;
// 继承
export let ArrayMehods = Object.create(oldArrayProtoMethods);
// 劫持
let methods = ["push", "pop", "shift", "unshift", "sort", "splice", "reverse"];
methods.forEach((item) => {
	ArrayMehods[item] = function (...args) {
		// 对追加数据进行响应式处理
		let inserted;
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
		let ob = this.__ob__;
		if (inserted) {
			ob.observerArray(inserted);
		}

		let result = oldArrayProtoMethods[item].apply(this, args);
		return result;
	};
});
