import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import postcssConfig from "./postcss.config";
import { app } from "./src/app";

const distDir = path.join(process.cwd(), "dist");

const processHtml = async () => {
	const html = renderToStaticMarkup(app());
	return await fs.promises.writeFile("dist/index.html", html);
};

const processCss = async () => {
	const cssSrcPath = path.join(process.cwd(), "src/styles/main.tailwind.css");
	const cssOutPath = path.join(distDir, "styles/main.css");

	const unprocessedCss = await fs.promises.readFile(cssSrcPath, "utf-8");
	const { css: processedCss } = await postcss(postcssConfig.plugins).process(unprocessedCss);
	
	await fs.promises.writeFile(cssOutPath, processedCss);
};

const processAssets = async () => {
	const assetsIn = path.join(process.cwd(), "src/assets");
	const assetsOut = path.join(distDir, "assets");

	await fs.promises.cp(assetsIn, assetsOut, { recursive: true });
};


Promise.all([processHtml(), processCss(), processAssets()]).then(() => {
	console.log("Build complete");
}).catch((err) => {
	console.error("Build failed", err);
});