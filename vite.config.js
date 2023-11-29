import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

const path = require("path");
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      vue: '@vue/compat'
    },
  },
})
