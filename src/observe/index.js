/*
import { observer } from './index';
 * @Author: wzy
 * @Date: 2024-02-03 18:01:08
 * @LastEditTime: 2024-02-05 12:17:32
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/observe/index.js
 */
import { ArrayMehods } from "./arr";
export function observer(data) {
	if (typeof data !== "object" || data == null) {
		return data;
	}
	// 对象类型处理
	return new Observer(data);
}

class Observer {
	constructor(data) {
		// 给data定义一个属性 将observer内置的方法绑定到上面，方便后续逻辑调用
		Object.defineProperty(data, "__ob__", {
			enumerable: false,
			value: this,
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
	walk(data) {
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			// 对每个属性进行劫持
			let key = keys[i];
			let value = data[key];
			defineReactive(data, key, value);
		}
	}
	observerArray(data) {
		// 处理数组内是对象的情况
		for (let i = 0; i < data.length; i++) {
			observer(data[i]);
		}
	}
}
function defineReactive(data, key, value) {
	// 对像类型进行递归处理,深度劫持
	observer(value);
	Object.defineProperty(data, key, {
		get() {
			return value;
		},
		set(newValue) {
			if (newValue == value) return;
			observer(newValue); // 如果设置的是对象，则进行数据响应
			value = newValue;
		},
	});
}

// 总结：
// 1.对象类型处理
// Object.defineProperty 有缺点 只能对 对象中的一个属性进行劫持
// 深层嵌套对象需要遍历 递归处理
// 用户在对劫持数据进行set操作时 如果新的数据是对象类型也需要进行响应式处理

// 2.数组
// 对数组的劫持采用的是，重写可以改变数组本省的7个方法（push,pop,shift,unshift,splice,sort,reverse）
