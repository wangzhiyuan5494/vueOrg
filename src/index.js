/*
 * @Author: your name
 * @Date: 2024-02-03 10:45:00
 * @LastEditTime: 2024-02-03 17:39:01
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/src/index.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { initMixin } from "./init";

function Vue(options) {
	this._init(options);
}
initMixin(Vue);
export default Vue;
