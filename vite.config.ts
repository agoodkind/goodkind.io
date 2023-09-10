import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir);
};

// define aliases here
export const paths = {

  "@Styles": resolve("./src/Styles"),
  "@Components": resolve("./src/Components"),
  "@Sections": resolve("./src/Sections"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: paths
  }
});