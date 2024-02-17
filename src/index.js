/*
 * @Author: your name
 * @Date: 2024-02-03 10:45:00
 * @LastEditTime: 2024-02-17 15:17:50
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/index.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { initGlobApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMinxin } from "./lifecycle";
import { renderMixin } from "./vnode/index";

function Vue(options) {
	this._init(options);
}
initMixin(Vue);
lifecycleMinxin(Vue); // 添加生命周期
renderMixin(Vue); // 添加render

//	全局放方法
initGlobApi(Vue);

export default Vue;
