import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react'
import path from "path";

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir);
};

// define aliases here
const paths = {
  "@": resolve("./src"),
  "@styles": resolve("./src/styles")
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
      alias: paths
  }
});