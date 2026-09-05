import { defineConfig, loadEnv } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    "http://gottours-001-site4.mtempurl.com/publicEliecer";
  return {
    plugins: [vuePlugin()],
    test: {
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.spec.js", "src/**/*.test.js"],
      css: false,
      pool: "forks",
    },
    base: "./",
    resolve: {
      extensions: [".vue", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        moment: path.resolve(__dirname, "src/utils/momentShim.js"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData(content, filename) {
            const normalized = filename.replace(/\\/g, "/");
            if (
              normalized.endsWith("/assets/styles/main.scss") ||
              normalized.endsWith("/assets/styles/_mixins.scss")
            ) {
              return content;
            }
            return `@use "@/assets/styles/mixins" as *;\n${content}`;
          },
          quietDeps: true,
        },
      },
    },
    server: {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: !proxyTarget.startsWith("http://"),
        },
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",
          assetFileNames: "assets/[name].[hash][extname]",
        },
      },
    },
  };
});
