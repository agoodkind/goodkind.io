import react from "@vitejs/plugin-react";
import { writeFile } from "fs/promises";
import { renderToString } from "react-dom/server";
import { defineConfig } from "vite";
import { app } from "./src/app";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "index-html-build-replacement",
      apply: "build",
      async transformIndexHtml() {
        const html = renderToString(app());

        return await writeFile("./index.html", html);
      }
    }
  ],
  clearScreen: false,
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true
  }
});
