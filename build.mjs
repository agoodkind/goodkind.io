#!/usr/bin/env node

import { build, context } from "esbuild";
import process from "node:process";
import { esbuildConfig } from "./build.config.mjs";

const args = process.argv.slice(2);
const isWatch = args.includes("--watch") || args.includes("-w");

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

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
      await sleep(100);
      console.log("👀 Ready (typescript)");

      async function shutdown(signal) {
        if (signal === "SIGINT") {
          console.log("\n🛑 Stopping TypeScript watcher...");
        }
        await ctx.dispose();
        process.exit(0);
      }

      process.on("SIGINT", async function () {
        await shutdown("SIGINT");
      });

      process.on("SIGTERM", async function () {
        await shutdown("SIGTERM");
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
