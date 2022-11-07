// noinspection JSUnusedGlobalSymbols

import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        'main': resolve(__dirname, 'index.html'),
        'damage-calculator': resolve(__dirname, 'pages/damage-calculator/index.html'),
        'life-damage-calculator': resolve(__dirname, 'pages/life-damage-calculator/index.html'),
        'life-drops-calculator': resolve(__dirname, 'pages/life-drops-calculator/index.html'),
      },
    },
  },
})
