import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    port: 8000,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve("./src"),
    },
  },
})
