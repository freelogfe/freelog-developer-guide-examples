import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [mkcert(), vue()],
  server: {
    port: 8203,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["freelog-emulatorjs"], // 让它走原生 ES 模块加载
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".json")) {
            return "assets/localization/[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
