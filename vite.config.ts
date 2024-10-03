import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  //office
  // server: {
  //   host: "192.168.0.107",
  // },
  //niraj home
  // server: {
  //   host: "192.168.16.104",
  // },
  plugins: [
    react(),
    tsConfigPaths(),
    electron([
      {
        entry: "electron/main.ts",
      },
      {
        entry: "electron/preload.ts",
        onstart(options) {
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
});
