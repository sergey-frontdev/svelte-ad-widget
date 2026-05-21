import type { StorybookConfig } from "@storybook/svelte-vite";

const config: StorybookConfig = {
	stories: ["../packages/**/*.stories.@(js|ts|svelte)"],
	addons: ["@storybook/addon-essentials", "storycap"],
	framework: {
		name: "@storybook/svelte-vite",
		options: {}
	},
	// The framework injects a single svelte plugin that compiles everything as
	// normal components, so <svelte:options tag=...> on *.wc.svelte is silently
	// ignored and the custom elements are never registered. Replace it with the
	// same two-pass setup the library build uses.
	// (vite-plugin-svelte is ESM-only, so it must be dynamically imported here.)
	async viteFinal(viteConfig) {
		const { svelte } = await import("@sveltejs/vite-plugin-svelte");
		const sveltePreprocess = (await import("svelte-preprocess")).default;

		// storycap's "browser"/ESM build (lib-esm) ships bare `require(...)` calls.
		// Vite's dev esbuild prebundle rewrites them, but the production Rollup build
		// leaves them intact — crashing the served preview with "require is not defined".
		// Force resolution to the CJS entry so @rollup/plugin-commonjs transforms it.
		const { createRequire } = await import("node:module");
		const storycapCjs = createRequire(import.meta.url).resolve("storycap");
		viteConfig.resolve = viteConfig.resolve ?? {};
		const existingAlias = viteConfig.resolve.alias ?? [];
		viteConfig.resolve.alias = [
			...(Array.isArray(existingAlias)
				? existingAlias
				: Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }))),
			{ find: /^storycap$/, replacement: storycapCjs }
		];

		viteConfig.plugins = (viteConfig.plugins ?? [])
			.flat(Infinity)
			.filter(
				(p) => !(p && typeof p === "object" && "name" in p && String(p.name).startsWith("vite-plugin-svelte"))
			);

		viteConfig.plugins.push(
			svelte({
				preprocess: sveltePreprocess(),
				exclude: [/\.wc\.svelte$/]
			}),
			svelte({
				preprocess: sveltePreprocess(),
				include: [/\.wc\.svelte$/],
				compilerOptions: { customElement: true }
			})
		);

		return viteConfig;
	}
};

export default config;
