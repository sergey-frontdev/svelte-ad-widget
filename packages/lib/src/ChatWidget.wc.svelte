<svelte:options tag="chat-widget" />

<script lang="ts">
	import { onDestroy, tick } from "svelte";
	import { createChat } from "./chatStore";
	import Avatar from "./Avatar.svelte";
	import Message from "./Message.svelte";

	// Props (lowercase — HTML attributes can't be camelCase on custom elements)
	export let username = "Эдвард Сноуден";

	const chat = createChat();
	const { messages, quickReplies, isTyping, dotCount } = chat;

	let open = false;
	let draft = "";
	let messagesEl: HTMLDivElement;

	function initials(name: string): string {
		return name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("");
	}

	$: userinitials = initials(username);

	async function scrollToBottom() {
		await tick();
		if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
	}
	chat.onUpdate(scrollToBottom);

	function openChat() {
		open = true;
		chat.start();
	}

	function sendDraft() {
		chat.send(draft);
		draft = "";
	}

	function onKeydown(event: KeyboardEvent) {
		// Enter sends; Shift+Enter (and other modifiers) inserts a newline.
		if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault();
			sendDraft();
		}
	}

	onDestroy(chat.destroy);
</script>

{#if open}
	<div class="panel" role="dialog" aria-label="Чат подбора автомобиля">
		<header class="header">
			<div class="header-info">
				<Avatar kind="bot" size={36} />
				<div>
					<div class="header-title">Подбор авто</div>
					<div class="header-status">онлайн</div>
				</div>
			</div>
			<button class="icon-btn" on:click={() => (open = false)} aria-label="Закрыть чат">
				<svg viewBox="0 0 24 24" width="18" height="18">
					<line x1="6" y1="6" x2="18" y2="18" />
					<line x1="18" y1="6" x2="6" y2="18" />
				</svg>
			</button>
		</header>

		<div class="messages" bind:this={messagesEl}>
			{#each $messages as msg (msg.id)}
				<Message sender={msg.sender} text={msg.text} {userinitials} specialistinitials="С" />
			{/each}

			{#if $isTyping}
				<div class="typing-row">
					<Avatar kind="bot" />
					<div class="bubble typing">{".".repeat($dotCount)}</div>
				</div>
			{/if}
		</div>

		{#if $quickReplies.length}
			<div class="quick-replies">
				{#each $quickReplies as reply (reply.label)}
					<button class="chip" on:click={() => chat.clickChip(reply)}>{reply.label}</button>
				{/each}
			</div>
		{/if}

		<div class="composer">
			<textarea
				bind:value={draft}
				on:keydown={onKeydown}
				rows="1"
				placeholder="Напишите сообщение…"
				aria-label="Поле ввода сообщения"
			/>
			<button class="send-btn" on:click={sendDraft} disabled={!draft.trim() || $isTyping} aria-label="Отправить">
				<svg viewBox="0 0 24 24" width="20" height="20">
					<path d="M4 12 L20 4 L13 20 L11 13 Z" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<button class="launcher" class:hidden={open} on:click={openChat} aria-label="Открыть чат">
	<svg viewBox="0 0 24 24" width="26" height="26">
		<path d="M5 4 H19 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 H9 l-5 4 V6 a2 2 0 0 1 2 -2 Z" />
		<line x1="8" y1="9" x2="16" y2="9" class="line" />
		<line x1="8" y1="12.5" x2="13" y2="12.5" class="line" />
	</svg>
</button>

<style>
	:host {
		--graphite-900: #1c1c1f;
		--graphite-800: #232327;
		--graphite-700: #2c2c31;
		--graphite-600: #3a3a41;
		--amber: #f5a623;
		--amber-bright: #ffb52e;
		--text: #ececef;
		--text-dim: #9a9aa3;
		font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
	}

	* {
		box-sizing: border-box;
	}

	/* ---- Launcher ---- */
	.launcher {
		position: fixed;
		right: 24px;
		bottom: 24px;
		width: 60px;
		height: 60px;
		border: none;
		border-radius: 50%;
		background: linear-gradient(145deg, var(--graphite-700), var(--graphite-900));
		color: var(--amber);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 6px 20px rgba(0, 0, 0, 0.35),
			0 0 0 1px rgba(245, 166, 35, 0.25);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease;
		z-index: 2147483000;
	}
	.launcher:hover {
		transform: translateY(-2px) scale(1.04);
		box-shadow:
			0 10px 26px rgba(0, 0, 0, 0.45),
			0 0 0 1px rgba(245, 166, 35, 0.5);
	}
	.launcher.hidden {
		display: none;
	}
	.launcher svg {
		fill: none;
		stroke: var(--amber);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.launcher .line {
		stroke: var(--amber-bright);
	}

	/* ---- Panel ---- */
	.panel {
		position: fixed;
		right: 24px;
		bottom: 24px;
		width: 360px;
		max-width: calc(100vw - 32px);
		height: 560px;
		max-height: calc(100vh - 48px);
		display: flex;
		flex-direction: column;
		background: var(--graphite-800);
		border-radius: 20px;
		overflow: hidden;
		box-shadow:
			0 18px 50px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.04);
		z-index: 2147483000;
		animation: pop 0.2s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* ---- Header ---- */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px;
		background: linear-gradient(135deg, var(--graphite-700), var(--graphite-900));
		border-bottom: 1px solid rgba(245, 166, 35, 0.18);
	}
	.header-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.header-title {
		color: var(--text);
		font-size: 15px;
		font-weight: 600;
	}
	.header-status {
		color: var(--amber);
		font-size: 12px;
	}
	.icon-btn {
		background: transparent;
		border: none;
		color: var(--text-dim);
		cursor: pointer;
		padding: 4px;
		border-radius: 8px;
		display: flex;
	}
	.icon-btn:hover {
		color: var(--text);
		background: rgba(255, 255, 255, 0.06);
	}
	.icon-btn svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}

	/* ---- Messages ---- */
	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: var(--graphite-800);
	}
	.messages::-webkit-scrollbar {
		width: 8px;
	}
	.messages::-webkit-scrollbar-thumb {
		background: var(--graphite-600);
		border-radius: 8px;
	}

	.typing-row {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}
	.bubble.typing {
		padding: 10px 14px;
		border-radius: 16px;
		border-bottom-left-radius: 4px;
		background: var(--graphite-700);
		color: var(--amber);
		font-weight: 700;
		letter-spacing: 2px;
		min-width: 34px;
	}

	/* ---- Quick replies ---- */
	.quick-replies {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px 16px 4px;
		background: var(--graphite-800);
	}
	.chip {
		text-align: left;
		padding: 10px 14px;
		border-radius: 14px;
		border: 1px solid rgba(245, 166, 35, 0.4);
		background: var(--graphite-700);
		color: var(--text);
		font-size: 13px;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			transform 0.1s ease;
	}
	.chip:hover {
		background: var(--graphite-600);
		border-color: var(--amber);
		transform: translateX(2px);
	}

	/* ---- Composer ---- */
	.composer {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		padding: 12px 16px 16px;
		background: var(--graphite-800);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}
	textarea {
		flex: 1;
		resize: none;
		max-height: 110px;
		padding: 10px 14px;
		border-radius: 18px;
		border: 1px solid var(--graphite-600);
		background: var(--graphite-900);
		color: var(--text);
		font-family: inherit;
		font-size: 14px;
		line-height: 1.4;
		outline: none;
	}
	textarea:focus {
		border-color: var(--amber);
	}
	textarea::placeholder {
		color: var(--text-dim);
	}
	.send-btn {
		flex: 0 0 auto;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		background: linear-gradient(145deg, var(--amber-bright), var(--amber));
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 0.12s ease,
			opacity 0.12s ease;
	}
	.send-btn:hover:not(:disabled) {
		transform: scale(1.06);
	}
	.send-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.send-btn svg {
		fill: #221700;
	}
</style>
