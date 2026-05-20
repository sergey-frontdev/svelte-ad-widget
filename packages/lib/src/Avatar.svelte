<svelte:options tag={null} />

<script lang="ts">
	import type { Sender } from "./chatStore";

	export let kind: Sender = "bot";
	export let text = "";
	export let size = 30;

	const backgrounds: Record<Sender, string> = {
		user: "linear-gradient(145deg, var(--amber-bright), var(--amber))",
		bot: "linear-gradient(145deg, var(--graphite-600), var(--graphite-900))",
		specialist: "linear-gradient(145deg, #4a4a52, var(--graphite-900))"
	};
	const colors: Record<Sender, string> = {
		user: "#2a1c00",
		bot: "var(--amber)",
		specialist: "var(--amber-bright)"
	};
	const textShadows: Record<Sender, string> = {
		user: "0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.25)",
		bot: "0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.12)",
		specialist: "0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.12)"
	};

	$: style = [
		`width:${size}px`,
		`height:${size}px`,
		"flex:0 0 auto",
		"display:flex",
		"align-items:center",
		"justify-content:center",
		"border-radius:50%",
		`font-size:${Math.round(size * 0.4)}px`,
		"font-weight:700",
		"letter-spacing:0.5px",
		`background:${backgrounds[kind]}`,
		`color:${colors[kind]}`,
		`text-shadow:${textShadows[kind]}`,
		"box-shadow:inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 3px rgba(0,0,0,0.45)"
	].join(";");

	$: iconSize = Math.round(size * 0.55);
</script>

<span {style} aria-hidden="true">
	{#if kind === "bot"}
		<svg
			viewBox="0 0 24 24"
			width={iconSize}
			height={iconSize}
			fill="none"
			stroke="var(--amber)"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect x="4" y="7" width="16" height="11" rx="3" />
			<circle cx="9" cy="12.5" r="1.4" fill="var(--amber)" stroke="none" />
			<circle cx="15" cy="12.5" r="1.4" fill="var(--amber)" stroke="none" />
			<line x1="12" y1="3" x2="12" y2="7" />
			<circle cx="12" cy="2.5" r="1.3" />
		</svg>
	{:else}
		{text}
	{/if}
</span>
