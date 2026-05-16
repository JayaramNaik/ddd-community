// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/ddd-community/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Dream • Decide • Dominate",
        short_name: "DDD Community",
        description: "A student mentorship community helping juniors make better academic, career, and life decisions.",
        start_url: "/ddd-community/",
        scope: "/ddd-community/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#020818",
        theme_color: "#38bdf8",
        icons: [
          { src: "/ddd-community/icons/icon-72.png",  sizes: "72x72",  type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-96.png",  sizes: "96x96",  type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-128.png", sizes: "128x128", type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-144.png", sizes: "144x144", type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-152.png", sizes: "152x152", type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any maskable" },
          { src: "/ddd-community/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
