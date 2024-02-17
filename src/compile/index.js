/*
 * @Author: wzy
 * @Date: 2024-02-12 22:07:27
 * @LastEditTime: 2024-02-14 22:24:04
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/compile/index.js
 */

/* 
<div id="app">
    
    <h1> hello word</h1>
</div> 
*/
import { generate } from "./generate";
import { parseHTML } from "./parseAst";

export function compileToFunction(el) {
	// 将html 变成ast语法树
	let ast = parseHTML(el);

	// 将ast 语法树变成 render 函数 1）ast语法树 变成 字符串 2）字符串变成函数
	let code = generate(ast);

	// 将ast字符串变成函数

	let render = new Function(`with(this){return ${code}}`);
	return render;
}
/**
 *  <div id="app">
        hello{{msg}}
 *       <h1> hello word</h1>
 *  </div>
 * 
 * render(){ _c 解析标签
 *	 return _c('div',{id:app},_v('hello'+_s(msg)),_c('h1',_v('hello word')))
 * 
 * }
 * 
 * 
 * 
 */
