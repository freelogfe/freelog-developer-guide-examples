import { defineConfig } from "father";

export default defineConfig({
  // 配置 esm 打包
  esm: {
    output: "dist/esm",
    sourcemap: true,
  },
  // 配置 cjs 打包
  cjs: {
    output: "dist/cjs",
    sourcemap: true,
  },
  // 配置 umd 打包
  umd: {
    name: "EmulatorJS",
    output: "dist/umd",
    sourcemap: true,
  },
  // 配置别名
  alias: {
    "@": "./src",
  },
  // 配置需要额外处理的文件
  extraBabelPlugins: [],
  // 配置平台
  platform: "browser",
  // 配置目标环境
  targets: {
    chrome: 80,
    firefox: 70,
    safari: 13,
    edge: 80,
  },
});
