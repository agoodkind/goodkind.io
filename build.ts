import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import postcssConfig from "./postcss.config";
import { app } from "./src/app";

const distDir = path.join(process.cwd(), "dist");

const processHtml = async () => {
	const htmlSrc = renderToStaticMarkup(app());
 const htmlOutPath = path.join(distDir, "index.html");

	return await fs.promises.writeFile(htmlOutPath, htmlSrc);
};

const processCss = async () => {
	const cssSrcPath = path.join(process.cwd(), "src/styles/main.tailwind.css");
	const cssOutPath = path.join(distDir, "styles/main.css");

	const unprocessedCss = await fs.promises.readFile(cssSrcPath, "utf-8");
	const { css: processedCss } = await postcss(postcssConfig.plugins).process(unprocessedCss);
	
	await fs.promises.writeFile(cssOutPath, processedCss);
};

const processAssets = async () => {
	const assetsSrcPath = path.join(process.cwd(), "src/assets");
	const assetsOutPath = path.join(distDir, "assets");

	await fs.promises.cp(assetsSrcPath, assetsOutPath, { recursive: true });
};


Promise.all([processHtml(), processCss(), processAssets()]).then(() => {
	console.log("Build complete");
}).catch((err) => {
	console.error("Build failed", err);
});
