import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      name: 'freelogLibrary.snnaenu.localModule',
      fileName: (format) => `vue-helloworld.${format}.js`,
      formats: ['umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        name: 'freelogLibrary.snnaenu.localModule'
      },
    },
  },
  plugins: [vue()],
  external: ['vue'],
})