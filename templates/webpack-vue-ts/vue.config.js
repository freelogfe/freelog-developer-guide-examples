const { defineConfig } = require('@vue/cli-service')

const path = require('path');
const { name } = require('./package');
const webpackPlugin = require('webpack-mkcert')

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 8006;
module.exports = defineConfig(async () => {
  const https = await webpackPlugin.default({
    force: true,
    source: 'coding',
    hosts: ['localhost', '127.0.0.1']
  })
  console.log(https)
  return {
    transpileDependencies: true,
    outputDir: 'dist',
    assetsDir: 'static',
    filenameHashing: true,
    devServer: {
      https: {
        ...https
      },
      hot: true,
      port,
      historyApiFallback: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    // 自定义webpack配置
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('src'),
        },
      },
      output: {
        // 把子应用打包成 umd 库格式
        library: `${name}-[name]`,
        libraryTarget: 'umd',
        chunkLoadingGlobal: `webpackJsonp_${name}`,
      },
    },
  }
})

