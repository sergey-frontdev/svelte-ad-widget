<svelte:options tag={null} />

<script lang="ts">
	// Side-effect import registers the <ad-widget> custom element.
	import "./AdWidget.wc.svelte";

	export let theme: "light" | "dark" = "light";
	export let variant: "long" | "short" | "mobile" = "long";

	// Promo card content (undefined → widget keeps its built-in default).
	export let image: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let cta: string | undefined = undefined;
	export let domain: string | undefined = undefined;
	export let href: string | undefined = undefined;
	// Tooltip ("О рекламодателе") text (legal + ИНН + ID, single field).
	export let legal: string | undefined = undefined;

	// Only forward overrides that are actually set, so the widget keeps its
	// built-in default content otherwise.
	$: attrs = Object.fromEntries(
		Object.entries({ theme, variant, image, title, description, cta, domain, href, legal }).filter(
			([, v]) => v !== undefined && v !== ""
		)
	);
</script>

<!--wants be with dark mode decorator-->
<div class="stage" class:dark-bg={theme === "dark"}>
	<ad-widget {...attrs} />
</div>

<style>
	.stage {
		padding: 24px;
		display: inline-block;
		border-radius: 12px;
	}
	.dark-bg {
		background: #1c1c1f;
	}
</style>
