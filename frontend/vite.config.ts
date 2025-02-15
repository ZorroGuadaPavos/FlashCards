import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					chakra: ["@chakra-ui/react"],
					tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
					vendor: ["react", "react-dom", "react-hook-form"],
				},
			},
		},
	},
});
