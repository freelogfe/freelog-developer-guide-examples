import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    port: 8101,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve("./src"), // __dirname,
    },
  },
});