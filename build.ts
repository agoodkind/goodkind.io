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


fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(stylesDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

// Render the app to a string

// Write the rendered app to the output HTML file
const htmlOutputPath = path.join(distDir, "index.html");
fs.writeFileSync(htmlOutputPath, staticHtml);

// Define the input CSS file path

// Read the input CSS file
const cssInput = fs.readFileSync(cssPath);

// Process the CSS with PostCSS
postcss(postcssConfig.plugins)
	.process(cssInput)
	.then(({ css }) => {
		// Write the processed CSS to the output CSS file
		const cssOutputPath = path.join(stylesDir, "main.css");
		fs.writeFileSync(cssOutputPath, css);
	});

fs.cpSync(assets, assetsDir, { recursive: true });
