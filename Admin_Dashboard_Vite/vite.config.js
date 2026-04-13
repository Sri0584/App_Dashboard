import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"], // pass compiler via react plugin
			},
		}),
		VitePWA({ registerType: "autoUpdate" }),
	],
	test: {
		environment: "jsdom",
		setupFiles: "./src/test/setup.js",
		include: ["src/**/*.test.{js,jsx,ts,tsx}", "src/**/*.spec.{js,jsx,ts,tsx}"],
		exclude: ["e2e/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/test/setup.js",
				"src/main.jsx",
				"src/**/*.css",
				"src/**/*.scss",
			],
		},
	},
	build: {
		sourcemap: true,
		chunkSizeWarningLimit: 1000, // increase chunk size warning limit
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("@mui")) return "mui";
						if (id.includes("recharts")) return "charts";
						if (id.includes("formik")) return "formik";
						if (id.includes("yup")) return "yup";
						return "vendor";
					}
				},
			},
		},
	},
});
