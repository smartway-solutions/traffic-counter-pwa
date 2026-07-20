import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  build: {
    // AG Grid 的核心是單一 ESM module（約 582 kB／gzip 161 kB），無法再由 bundler 拆開。
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "ag-grid",
              test: /node_modules[\\/](?:ag-grid-community|ag-grid-react|ag-stack)[\\/]/,
              maxSize: 350 * 1024
            }
          ]
        }
      }
    }
  },
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
        theme_color: "#111827",
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
