import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'freelogLibrary.snnaenu.localModule',
      fileName: (format) => `react-helloworld.${format}.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'react',
          'react/jsx-runtime': 'jsxRuntime'
        },
        name: 'freelogLibrary.snnaenu.localModule'
      },
    },
  },
  plugins: [react()],
})