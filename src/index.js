/*
 * @Author: your name
 * @Date: 2024-02-03 10:45:00
 * @LastEditTime: 2024-02-14 19:50:18
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/index.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { initMixin } from "./init";
import { lifecycleMinxin } from "./lifecycle";
import { renderMixin } from "./vnode/index";

function Vue(options) {
	this._init(options);
}
initMixin(Vue);
lifecycleMinxin(Vue); // 添加生命周期
renderMixin(Vue); // 添加render

export default Vue;
