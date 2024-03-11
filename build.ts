
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import postcssConfig from "./postcss.config";
import { app } from "./src/app";

const outDir = path.join(process.cwd(), "dist");
const stylesOutDir = path.join(outDir, "styles");
const assetsOutDir = path.join(outDir, "assets");

const processHtml = async () => {
	const html = renderToStaticMarkup(app());
	const outHtmlPath = path.join(outDir, "index.html");

	return await writeFile(outHtmlPath, html);
};

const processCss = async () => {
	const cssSrcPath = path.join(process.cwd(), "src/styles/main.tailwind.css");
	const cssOutPath = path.join(stylesOutDir, "main.css");

	const unprocessedCss = await readFile(cssSrcPath, "utf-8");
	const { css: processedCss } = await postcss(postcssConfig.plugins).process(unprocessedCss, {
		from: cssSrcPath,
		to: cssOutPath
	});
	
	await writeFile(cssOutPath, processedCss);
};

const processAssets = async () => {
	const assetsIn = path.join(process.cwd(), "src/assets");

	await cp(assetsIn, assetsOutDir, { recursive: true });
};


const build = async () => {
	console.log("Building...");
	console.log("Cleaning dist directory...");
	await rm(path.join(outDir), { recursive: true, force: true});

	console.log("Creating directories...");
	await Promise.all([outDir, stylesOutDir, assetsOutDir].map(async (dir) => await mkdir(dir, { recursive: true })));
	
	console.log("Processing files...");
	await Promise.all([processHtml(), processCss(), processAssets()]);

	console.log("Build complete");
};

build().catch((err) => {
	console.error("Build failed", err);

	throw err;
});
