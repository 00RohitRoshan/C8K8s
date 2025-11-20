import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@bpmn-io/form-js", "@bpmn-io/form-js/dist/form-viewer.esm.js"]
  }
});
