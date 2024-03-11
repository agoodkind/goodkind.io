import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import type { Config as postcssConfig } from "postcss-load-config";
import tailwindcss from "tailwindcss";
import { config as tailwindConfig } from "./tailwind.config";

const postcssPlugins = [
  autoprefixer(),
  tailwindcss(tailwindConfig),
  cssnanoPlugin()
];

export default {
  plugins: postcssPlugins
} satisfies postcssConfig;
