/*
 * @Author: wzy
 * @Date: 2024-02-17 15:25:05
 * @LastEditTime: 2024-02-17 21:32:07
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/utils/index.js
 */
export const HOOKS = [
	"beforeCreated",
	"created",
	"beforeMount",
	"mounted",
	"beforeUpdate",
	"updated",
	"beforeDestory",
	"destoryed",
];
// 策略模式
let starts = {};
starts.data = function () {};
starts.computed = function () {};
starts.watch = function () {};
starts.methods = function () {};

export function mergeOptios(parent, child) {
	console.log(parent, child);
	const options = {};
	for (let key in parent) {
		mergeField(key);
	}
	for (let key in child) {
		mergeField(key);
	}
	function mergeField(key) {
		if (start[key]) {
			options[key] = starts[key](parent[key], child[key]);
		} else {
			options[key] = child[key];
		}
	}
}
