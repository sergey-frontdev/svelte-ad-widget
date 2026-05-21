<svelte:options tag={null} />

<script lang="ts">
	// Side-effect import registers the <chat-widget> custom element.
	import "./ChatWidget.wc.svelte";

	export let username = "Эдвард Сноуден";
</script>

<chat-widget {username} />
