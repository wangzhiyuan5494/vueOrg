/*
 * @Author: wzy
 * @Date: 2024-02-13 20:23:43
 * @LastEditTime: 2024-02-14 22:23:46
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/compile/generate.js
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
/**
 * @description: 处理属性
 * @param {*} attrs
 * @return {*}
 */
function genPorps(attrs) {
	let str = "";
	for (let i = 0; i < attrs.length; i++) {
		let attr = attrs[i];
		if (attr.name == "style") {
			// {name: 'style', value: 'color: red;font: size 12px'}
			// style:{color:red,fontsize:12px}
			let obj = {};
			attr.value.split(";").forEach((item) => {
				let [key, val] = item.split(":");
				obj[key] = val;
			});
			attr.value = obj;
		}
		// 拼接
		str = `${str}${attr.name}:${JSON.stringify(attr.value)},`;
	}
	return `{${str.slice(0, -1)}}`;
}
/**
 * @description: 处理子节点
 * @return {*}
 */
function genChildren(el) {
	let children = el.children;
	if (children) {
		return children.map((child) => gen(child)).join(",");
	}
}
function gen(node) {
	// 元素
	if (node.type == 1) {
		return generate(node);
	} else {
		// 文本
		let text = node.text;
		if (!defaultTagRE.test(text)) {
			// 纯文本
			return `_v(${JSON.stringify(text)})`;
		}
		// 插值文本
		let tokens = [];
		let lastindex = (defaultTagRE.lastIndex = 0);
		let match;
		while ((match = defaultTagRE.exec(text))) {
			let index = match.index;
			if (index > lastindex) {
				tokens.push(JSON.stringify(text.slice(lastindex, index)));
			}
			tokens.push(`_s(${match[1].trim()})`);
			lastindex = index + match[0].length;
			if (lastindex < text.length) {
				tokens.push(JSON.stringify(text.slice(lastindex)));
			}
			debugger;
			return `_v(${tokens.join("+")})`;
		}
	}
}
export function generate(el) {
	// 属性{ id:App,style:{color:ReadableByteStreamController,fontsize:12px}}
	let children = genChildren(el);
	let code = `_c('${el.tag}',${
		el.attrs.length ? `${genPorps(el.attrs)}` : "null"
	},${children ? `${children}` : "null"})`;
	// code _c(div,{style:{"color":" red","font-size":" 12px"}},_v("hello"))
	return code;
}
