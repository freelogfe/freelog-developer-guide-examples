import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(),vue()],
  server: {
    port: 8880,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
