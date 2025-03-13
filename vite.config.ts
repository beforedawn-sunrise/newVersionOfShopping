/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import vue from "@vitejs/plugin-vue";
// import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/newVersionOfShopping/",
  plugins: [
    vue(),
    // VueI18nPlugin({
    //   include: path.resolve(__dirname, "./src/locales/**"),
    // }),
    mkcert(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/style/public.scss" as *;`,
      },
    },
  },
  test: {
    globals: true,
  },
});
