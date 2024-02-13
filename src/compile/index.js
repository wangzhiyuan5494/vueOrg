/*
 * @Author: wzy
 * @Date: 2024-02-12 22:07:27
 * @LastEditTime: 2024-02-13 14:46:31
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/compile/index.js
 */

/* 
<div id="app">
    
    <h1> hello word</h1>
</div> 
*/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); //开头箭头
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 标签结束
const attribute =
	/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 标签属性
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// 创建AST语法树
function creatASTElement(tag, attrs) {
	return {
		tag, // 元素
		attrs, // 属性
		children: [], //子节点
		type: 1,
		parent: null,
	};
}
let root; // 跟元素
let creatParent; // 当前的父元素
// 数据结构栈
let stack = [];
function start(tag, attrs) {
	// 开始的标签
	console.log(tag, attrs, "开始");
	let element = creatASTElement(tag, attrs);
	if (!root) {
		root = element;
	}
	creatParent = element;
	stack.push(element);
}
function charts(text) {
	// 文本
	console.log(text, "文本");
	text = text.replace(/\s/g, "");
	if (text) {
		creatParent.children.push({
			type: 3,
			text,
		});
	}
}
function end(tag) {
	// 结束标签
	console.log(tag, "结束标签");
	let element = stack.pop();
	creatParent = stack[stack.length - 1];
	if (creatParent) {
		element.parent = creatParent.tag;
		creatParent.children.push(element);
	}
}
function parseHTML(html) {
	while (html) {
		// 判断标签
		let textEnd = html.indexOf("<");
		if (textEnd == 0) {
			// 开始标签
			const startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
			}
			// 结束标签
			let endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1]);
			}
		}
		let text;
		if (textEnd > 0) {
			// 文本
			// 获取文本内容
			text = html.substring(0, textEnd);
		}
		if (text) {
			charts(text);
			advance(text.length);
		}
	}
	function parseStartTag() {
		const start = html.match(startTagOpen);
		if (!start) return;
		let match = {
			tagName: start[1],
			attrs: [],
		};
		// 删除开始标签
		advance(start[0].length);
		// 获取属性
		let attr;
		let end;
		while (
			!(end = html.match(startTagClose)) &&
			(attr = html.match(attribute))
		) {
			match.attrs.push({
				name: attr[1],
				value: attr[3] || attr[4] || attr[5],
			});
			advance(attr[0].length);
		}
		if (end) {
			advance(end[0].length);
			return match;
		}
	}
	function advance(n) {
		html = html.substring(n);
	}
	console.log("root", root);
	return root;
}
export function compileToFunction(el) {
	let ast = parseHTML(el);
}
