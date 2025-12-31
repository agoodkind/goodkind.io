// @ts-check

import process from "node:process";

// Environment detection
const isDev = process.env["NODE_ENV"] === "development";
const isProduction = process.env["NODE_ENV"] === "production" || !isDev;

/**
 * Entry points for bundling
 * Add more entry points here as needed
 */
export const entryPoints = [
  {
    in: "src/main.ts",
    out: "main",
  },
  {
    in: "src/livereload.ts",
    out: "livereload",
  },
];

/**
 * Build configuration for esbuild
 * @type {import('esbuild').BuildOptions}
 */
export const esbuildConfig = {
  entryPoints,
  bundle: true,

  // Development vs Production settings
  minify: isProduction,
  minifyWhitespace: isProduction,
  minifySyntax: isProduction,
  minifyIdentifiers: isProduction,
  keepNames: isDev,
  sourcemap: isDev ? "inline" : false,

  // Output
  outdir: "dist",
  format: "iife",

  // Target & Platform
  platform: "browser",
  target: ["es2020"],

  // Optimization
  treeShaking: true,

  // Logging
  logLevel: isDev ? "warning" : "error",
};
