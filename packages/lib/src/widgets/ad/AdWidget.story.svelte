<svelte:options tag={null} />

<script lang="ts">
	import { onMount, tick } from "svelte";
	// Side-effect import registers the <ad-widget> custom element.
	import "./AdWidget.wc.svelte";

	export let theme: "light" | "dark" = "light";
	export let variant: "long" | "short" | "mobile" = "long";
	// Story-only: open the "О рекламодателе" tooltip on mount by clicking the
	// widget's menu button inside its shadow DOM. The widget exposes no prop for
	// this internal state, so we drive the real interaction instead.
	export let openmenu = false;

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

	let widgetEl: HTMLElement;

	onMount(async () => {
		if (!openmenu) return;
		// Wait for the custom element to upgrade and render its shadow DOM.
		await tick();
		const dots = widgetEl?.shadowRoot?.querySelector<HTMLButtonElement>(".bar-dots, .dots");
		dots?.click();
	});
</script>

<!--wants be with dark mode decorator-->
<div class="stage" class:dark-bg={theme === "dark"}>
	<ad-widget bind:this={widgetEl} {...attrs} />
</div>

<style>
	.stage {
		/* 40px (not 24) so the card/tooltip/badge box-shadows fall inside the
		   captured stage box — VRT can then catch shadow regressions. */
		padding: 40px;
		display: inline-block;
		border-radius: 12px;
	}
	.dark-bg {
		background: #1c1c1f;
	}
</style>
