import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // GitHub Pages project site: https://zainnaeem28.github.io/solvpath-assessment/
  base: process.env.GITHUB_PAGES === "true" ? "/solvpath-assessment/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
