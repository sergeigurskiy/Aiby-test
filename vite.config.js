import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  publicDir: "static",
  base: '/',
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '> 1%'],
        }),
      ],
    },
  },
  build: {
    cssMinify: 'lightningcss',
    outDir: 'dist',
    assetsDir: 'assets',
  }
});