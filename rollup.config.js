/*
 * @Author: wzy
 * @Date: 2024-02-03 11:45:13
 * @LastEditTime: 2024-02-14 22:18:47
 * @LastEditors: wzy
 * @Description:
 * @FilePath: /myVue/rollup.config.js
 */
import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
	input: "./src/index.js", //打包的入口文件
	output: {
		file: "dist/vue.js",
		format: "umd", //在window上挂着vue
		name: "Vue",
		sourcemap: true,
	},
	plugins: [
		babel({
			exclude: ["node_modules/**", "dist/**"],
		}),
		serve({
			prot: 5000,
			contentBase: "",
			openPage: "./index.html",
		}),
	],
};
