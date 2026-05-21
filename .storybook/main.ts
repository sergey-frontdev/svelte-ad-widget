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
