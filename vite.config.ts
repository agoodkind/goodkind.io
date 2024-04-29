import react from "@vitejs/plugin-react";
import path from "path";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import { ViteFaviconsPlugin } from "vite-plugin-favicon2";
import ogPlugin from "vite-plugin-open-graph";

function resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// define aliases here
export const paths = {
  "@styles": resolve("./src/styles"),
  "@components": resolve("./src/components"),
  "@sections": resolve("./src/sections"),
  "@assets": resolve("./src/assets"),
  "@data": resolve("./src/data")
};

export default defineConfig({
  plugins: [
    react(),
    vike({ prerender: true }),
    ViteFaviconsPlugin({
      logo: "./src/assets/logo.png",
      favicons: {
        appName: "goodkind-io",
        appDescription: "Alex Goodkind"
      }
    }),
    ogPlugin({
      basic: {
        image: "https://goodkind.io/assets/apple-icon.png"
      }
    })
  ],
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
