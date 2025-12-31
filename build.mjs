#!/usr/bin/env node

import { build, context } from "esbuild";
import process from "node:process";
import { esbuildConfig } from "./build.config.mjs";

const isWatch = process.argv.includes("--watch") || process.argv.includes("-w");

/**
 * Main build function
 * @returns {Promise<void>}
 */
async function main() {
  try {
    if (isWatch) {
      /** @type {import('esbuild').BuildOptions} */
      const quietConfig = { ...esbuildConfig, logLevel: "error" };
      const ctx = await context(quietConfig);

      await ctx.watch();
      
      // Small delay to let other processes start
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("👀 Ready (typescript)");

      process.on("SIGINT", async () => {
        console.log("\n🛑 Stopping TypeScript watcher...");
        await ctx.dispose();
        process.exit(0);
      });
    } else {
      await build(esbuildConfig);
      console.log("✅ Build complete");
    }
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

main();
