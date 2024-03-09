import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import postcssConfig from "./postcss.config";
import { app } from "./src/app";

// inputs
const assets = path.join(process.cwd(), "src/assets");
const cssPath = path.join(process.cwd(), "src/styles/main.tailwind.css");
const staticHtml = renderToStaticMarkup(app());

//  outputs
const distDir = path.join(process.cwd(), "dist");
const stylesDir = path.join(distDir, "styles");
const assetsDir = path.join(distDir, "assets");

// Ensure the output directories exist
Promise.all([distDir, stylesDir, assetsDir].map((dir) => {
	return fs.promises.mkdir(dir, { recursive: true });
}));

// Write the rendered app to the output HTML file
const htmlOutputPath = path.join(distDir, "index.html");
fs.writeFileSync(htmlOutputPath, staticHtml);

// Define the input CSS file path
const cssOutPath = path.join(stylesDir, "main.css");
	
fs.promises.readFile(cssPath).then((css) => postcss(postcssConfig.plugins)
	.process(css)
	.then(({ css }) => {
		fs.writeFileSync(cssOutPath, css);
	})).then(() => {
	console.log("Build complete");
});

// copy assets
fs.cpSync(assets, assetsDir, { recursive: true });
