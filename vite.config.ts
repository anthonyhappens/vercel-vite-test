import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const cspNonce = "nonce-a4BbIyL0ahXgyyxX0g}n|8LOryCzlRyI";
const nonceValue = "a4BbIyL0ahXgyyxX0g}n|8LOryCzlRyI";

// 自定義插件來處理 nonce 注入
const noncePlugin = () => {
  return {
    name: "nonce-plugin",
    transformIndexHtml(html: string) {
      // 確保所有的 script 和 style 標籤都有 nonce 屬性
      return html
        .replace(
          /<script(?![^>]*nonce=)([^>]*)>/g,
          `<script nonce="${nonceValue}"$1>`
        )
        .replace(
          /<style(?![^>]*nonce=)([^>]*)>/g,
          `<style nonce="${nonceValue}"$1>`
        );
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  html: {
    cspNonce,
  },
  plugins: [react(), noncePlugin()],
  publicDir: "static",
  build: {
    outDir: "public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          // vendor: ["redux"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
  },
  // server: {
  //   // 開發環境中也設定 CSP headers
  //   headers: {
  //     "Content-Security-Policy": `default-src 'self'; script-src 'self' 'nonce-${nonceValue}'; style-src 'self' 'nonce-${nonceValue}'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';`,
  //   },
  // },
});
