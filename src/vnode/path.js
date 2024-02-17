/*
import { parseHTML } from '../compile/parseAst';
 * @Author: wzy
 * @Date: 2024-02-14 22:29:18
 * @LastEditTime: 2024-02-17 15:20:16
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/vnode/path.js
 */
/**
 * @description:将虚拟dom变成真实dom
 * @param {*} oldVnode
 * @param {*} vnode
 * @return {*}
 */
export function patch(oldVnode, vnode) {
	// console.log(oldVnode, vnode);
	let el = createEl(vnode);
	// console.log(el);
	// 替换 dom  1）获取父节点 2）插入 3）删除
	let parentEl = oldVnode.parentNode;
	parentEl.insertBefore(el, oldVnode.nextsibling);
	parentEl.removeChild(oldVnode);
	return el;
}
/**
 * @description: 创建dom
 * @return {*}
 */
function createEl(vnode) {
	let { tag, children, key, data, text } = vnode;
	if (typeof tag == "string") {
		//标签
		vnode.el = document.createElement(tag);
		if (children && children.length > 0) {
			children.forEach((child) => {
				vnode.el.appendChild(createEl(child));
			});
		}
	} else {
		vnode.el = document.createTextNode(text);
	}
	return vnode.el;
}
