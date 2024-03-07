import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    proxy: {
      // "/api": {
      //   target: "http://localhost:5000",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    }
  }
});
