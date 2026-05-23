<svelte:options tag={null} />

<script lang="ts">
	import { onMount, tick } from "svelte";
	// Side-effect import registers the <chat-widget> custom element.
	import "./ChatWidget.wc.svelte";

	export let username = "Эдвард Сноуден";
	// Story-only: open the chat panel on mount by clicking the launcher inside
	// the widget's shadow DOM. The widget exposes no prop for its open state, so
	// we drive the real interaction. Opening seeds a deterministic greeting +
	// FAQ chips (no timers), which keeps the captured state stable.
	export let open = false;

	let widgetEl: HTMLElement;

	onMount(async () => {
		if (!open) return;
		await tick();
		const launcher = widgetEl?.shadowRoot?.querySelector<HTMLButtonElement>(".launcher");
		launcher?.click();
	});
</script>

<chat-widget bind:this={widgetEl} {username} />
