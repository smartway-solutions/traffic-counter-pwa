import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["smartway-icon.png"],
      manifest: {
        name: "手機交通量計數器",
        short_name: "交通計數器",
        description: "離線優先的道路車種人工計數工具",
        theme_color: "#0b57d0",
        background_color: "#f5f7fb",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "./",
        scope: "./",
        lang: "zh-TW",
        icons: [
          {
            src: "smartway-icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // 使用手冊的教學影片／圖片體積大，不納入 PWA 預快取，改由網路載入
        globIgnores: ["manual/**"],
        navigateFallback: "index.html"
      }
    })
  ]
});
