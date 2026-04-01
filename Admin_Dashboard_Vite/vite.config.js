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
	},
	build: {
		sourcemap: true,
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
