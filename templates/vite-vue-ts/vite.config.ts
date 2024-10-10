import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [basicSsl(), vue()],
  server: {
    port: 8003,
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
});
