import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  preview: {
    port: 3001,
  },
  // for dev
  server: {
    port: 9000,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
