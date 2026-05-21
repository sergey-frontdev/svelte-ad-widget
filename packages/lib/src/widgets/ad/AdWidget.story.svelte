<svelte:options tag={null} />

<script lang="ts">
	// Side-effect import registers the <ad-widget> custom element.
	import "./AdWidget.wc.svelte";

	export let theme: "light" | "dark" = "light";
	export let variant: "v1" | "v2" = "v1";
	export let title = "";
	export let price = "";
	export let cta = "";

	// Only forward overrides that are actually set, so the widget keeps its
	// built-in default content otherwise.
	$: attrs = {
		theme,
		variant,
		...(title ? { title } : {}),
		...(price ? { price } : {}),
		...(cta ? { cta } : {})
	};
</script>

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
