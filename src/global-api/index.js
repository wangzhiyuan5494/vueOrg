import { mergeOptios } from "../utils/index";

export function initGlobApi(Vue) {
	Vue.options = {};
	Vue.mixin = function (mixin) {
		mergeOptios(this.options, mixin);
	};
}
