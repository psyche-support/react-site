// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages; 
  base: "/",
  // if using custom domain like psyche.support, set base: "/"
});