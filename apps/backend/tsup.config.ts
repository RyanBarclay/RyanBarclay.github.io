import { defineConfig } from "tsup";

/**
 * Bundle the entire service — dependencies included — into ONE JS file.
 * The runtime image then needs no node_modules at all: smaller image,
 * faster pull, faster cold start (see apps/backend/_lore.md).
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node22",
  clean: true,
  minify: true,
  noExternal: [/.*/],
});
