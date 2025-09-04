import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        process: "process",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // polyfill Buffer
        }),
      ],
    },
  },
});
