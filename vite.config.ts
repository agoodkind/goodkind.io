import react from "@vitejs/plugin-react";
import path from "path";
import vike from "vike/plugin";
import { defineConfig } from "vite";

function resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// define aliases here
export const paths = {
  "@styles": resolve("./src/styles"),
  "@components": resolve("./src/pages/index/components"),
  "@sections": resolve("./src/pages/index/sections"),
  "@assets": resolve("./src/assets")
};

export default defineConfig({
  plugins: [react(), vike({ prerender: true })],
  resolve: {
    alias: paths
  },
  clearScreen: false,
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true
  }
});
