<svelte:options tag={null} />

<script lang="ts">
	import Avatar from "./Avatar.svelte";
	import type { Sender } from "./chatStore";

	export let sender: Sender;
	export let text: string;
	export let userinitials = "";
	export let specialistinitials = "";

	// Inline styles — see the note in Avatar.svelte for why no <style> block.
	const bubbleBase =
		"padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.45;max-width:75%;white-space:pre-wrap;word-break:break-word;";
	const bubbleByKind: Record<Sender, string> = {
		user: "background:linear-gradient(145deg,var(--amber-bright),var(--amber));color:#221700;border-bottom-right-radius:4px;",
		bot: "background:var(--graphite-700);color:var(--text);border-bottom-left-radius:4px;",
		specialist:
			"background:var(--graphite-600);color:var(--text);border-bottom-left-radius:4px;box-shadow:inset 0 0 0 1px rgba(245,166,35,0.25);"
	};

	$: rowStyle =
		"display:flex;align-items:flex-end;gap:8px;max-width:100%;" + (sender === "user" ? "justify-content:flex-end;" : "");
	$: bubbleStyle = bubbleBase + bubbleByKind[sender];
</script>

<div style={rowStyle}>
	{#if sender !== "user"}
		<Avatar kind={sender} text={specialistinitials} />
	{/if}
	<div style={bubbleStyle}>{text}</div>
	{#if sender === "user"}
		<Avatar kind="user" text={userinitials} />
	{/if}
</div>
