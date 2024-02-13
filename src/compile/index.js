/*
 * @Author: wzy
 * @Date: 2024-02-12 22:07:27
 * @LastEditTime: 2024-02-13 14:59:44
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/compile/index.js
 */

/* 
<div id="app">
    
    <h1> hello word</h1>
</div> 
*/
import { parseHTML } from "./parseAst";

export function compileToFunction(el) {
	let ast = parseHTML(el);
}
