const { build } = require("esbuild");
const { resolve } = require("path");
const args = require("minimist")(process.argv.slice(2));

//minist 用来解析命令行参数的

const target = args._[0] || "reactivity";
const format = args.f || "global";

//开发环境只打包某一个

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

//iife  立即执行函数
//cjs node的模块 module.export
//esm 浏览器的esModule模块  import
const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm";

//输出文件名
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
);

//天生就支持ts
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], //入口文件
  outfile,
  bundle: true, //把所有的包全部打包一起
  sourcemap: true,
  format: outputFormat, //输出格式
  globalName: pkg.buildOptions?.name, //打包输出名称
  platform: format === "cjs" ? "node" : "browser", //打包平台
  watch: {
    //监视文件变化
    onRebuild(error) {
      if (!error) {
        console.log("rebuilt ~~~~");
      }
    },
  },
}).then(() => {
  console.log("wathcing~~~~");
});
