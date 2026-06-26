import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv, type UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET ?? "http://backend:5000";

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/tests/setup.ts",
    },
    coverage: {
      provider: "v8",
      reporter: ["lcov", "html"],
      reportsDirectory: "./coverage",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  } as UserConfig;
});
