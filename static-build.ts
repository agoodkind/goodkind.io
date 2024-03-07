import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { renderToString } from "react-dom/server";
import tailwindcss from "tailwindcss";
import { app } from "./src/app";
import { config as tailwindConfig } from "./tailwind.config";

// Render the app to a string
const html = renderToString(app());

// Define the output directories
const distDir = path.join(process.cwd(), "dist");
const stylesDir = path.join(distDir, "styles");

// Ensure the output directories exist
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(stylesDir, { recursive: true });

// Write the rendered app to the output HTML file
const htmlOutputPath = path.join(distDir, "index.html");
fs.writeFileSync(htmlOutputPath, html);

// Define the input CSS file path
const cssInputPath = path.join(process.cwd(), "src/styles/main.tailwind.css");

// Read the input CSS file
const cssInput = fs.readFileSync(cssInputPath);

// Define the PostCSS plugins
const postcssPlugins = [
  autoprefixer,
  tailwindcss(tailwindConfig),
  cssnanoPlugin
];

// Process the CSS with PostCSS
postcss(postcssPlugins)
  .process(cssInput)
  .then(({ css }) => {
    // Write the processed CSS to the output CSS file
    const cssOutputPath = path.join(stylesDir, "main.css");
    fs.writeFileSync(cssOutputPath, css);
  });
