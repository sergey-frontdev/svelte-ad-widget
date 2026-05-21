<svelte:options tag="ad-widget" />

<script lang="ts">
	import { adContent } from "./adContent";

	// Props (lowercase — HTML attributes can't be camelCase on custom elements)
	export let theme: "light" | "dark" = "light";
	/**
	 * Layout, chosen explicitly (no viewport sniffing — so it renders the same in
	 * Storybook docs as in Canvas):
	 * "long"   — desktop product card showing both buses.
	 * "short"  — desktop product card showing a single bus.
	 * "mobile" — mobile promo card (image + text + CTA), e.g. the Audi creative.
	 */
	export let variant: "long" | "short" | "mobile" = "long";

	// Content (defaults from adContent; overridable per-attribute, like a real ad tag)
	export let href = adContent.href;
	export let domain = adContent.domain;
	export let legal = adContent.advertiser.legal;

	// Promo card (mobile) content — editable per-attribute.
	export let image = adContent.promo.image;
	export let title = adContent.promo.title;
	export let description = adContent.promo.price;
	export let cta = adContent.promo.cta;

	// The promo card (Audi) is the mobile layout; "long"/"short" are desktop.
	$: showPromo = variant === "mobile";
	// "short" shows a single bus, "long" shows both.
	$: products = variant === "short" ? adContent.products.slice(0, 1) : adContent.products;

	let menuOpen = false;
	let hidden = false;

	function hideAd() {
		hidden = true;
		menuOpen = false;
	}

	function aboutAdvertiser() {
		menuOpen = false;
		window.open(href, "_blank", "noopener,noreferrer");
	}

	function copyLink() {
		menuOpen = false;
		navigator.clipboard?.writeText(href).catch(() => {});
	}
</script>

{#if !hidden}
	<div class="ad {theme}" class:mobile={showPromo} class:desktop={!showPromo}>
		{#if showPromo}
			<!-- promo card: overlay badges on the square creative -->
			<span class="badge label">Реклама</span>
			<button
				class="badge dots"
				class:vertical={showPromo}
				on:click={() => (menuOpen = !menuOpen)}
				aria-label="Меню рекламы"
			>
				<span class="dot" /><span class="dot" /><span class="dot" />
			</button>
		{:else}
			<!-- product card: header bar -->
			<header class="bar">
				<span class="rek">Реклама</span>
				<span class="domain">
					<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
						<circle cx="12" cy="12" r="9" />
						<path d="M3 12 H21 M12 3 a14 14 0 0 1 0 18 M12 3 a14 14 0 0 0 0 18" />
					</svg>
					{domain}
				</span>
				<button class="bar-dots" on:click={() => (menuOpen = !menuOpen)} aria-label="Меню рекламы">
					<span class="dot" /><span class="dot" /><span class="dot" />
				</button>
			</header>
		{/if}

		{#if menuOpen}
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
			<div class="backdrop" on:click={() => (menuOpen = false)} />
			<div class="tooltip">
				<button class="tooltip-close" on:click={() => (menuOpen = false)} aria-label="Закрыть">
					<svg viewBox="0 0 24 24" width="16" height="16">
						<line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
					</svg>
				</button>
				<p class="tooltip-legal">{legal}</p>

				<button class="tooltip-action" on:click={hideAd}>
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path d="M3 3 L21 21" />
						<path
							d="M10.6 5.1 A9.7 9.7 0 0 1 12 5 c5 0 9 4.5 10 7 -0.5 1.2 -1.6 2.8 -3.2 4.1 M6.5 6.7 C4 8.2 2.5 10.4 2 12 c1 2.5 5 7 10 7 a9.6 9.6 0 0 0 3.6 -0.7"
						/>
						<path d="M9.5 9.6 a3.4 3.4 0 0 0 4.9 4.8" />
					</svg>
					Скрыть объявление
				</button>

				<button class="tooltip-action" on:click={() => (menuOpen = false)}>
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path d="M12 3 L22 20 H2 Z" />
						<line x1="12" y1="9" x2="12" y2="14" />
						<circle cx="12" cy="17" r="0.6" class="fill" />
					</svg>
					Пожаловаться
				</button>

				<button class="tooltip-action" on:click={aboutAdvertiser}>
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<circle cx="11" cy="13" r="8" />
						<line x1="11" y1="11.5" x2="11" y2="17" />
						<circle cx="11" cy="9" r="0.7" class="fill" />
					</svg>
					О рекламодателе
					<svg class="ext" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
						<path d="M8 16 L16 8" /><path d="M9 8 H16 V15" />
					</svg>
				</button>

				<button class="tooltip-action" on:click={copyLink}>
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path d="M9 15 L15 9" />
						<path d="M11 7 l2 -2 a3.5 3.5 0 0 1 5 5 l-2 2" />
						<path d="M13 17 l-2 2 a3.5 3.5 0 0 1 -5 -5 l2 -2" />
					</svg>
					Скопировать ссылку
				</button>
			</div>
		{/if}

		{#if showPromo}
			<a class="creative" {href} target="_blank" rel="noopener noreferrer">
				<img class="img square" src={image} alt={title} loading="lazy" />
				<div class="body">
					<p class="m-title">{title}</p>
					<p class="m-price">{description}</p>
					<span class="m-cta">{cta}</span>
				</div>
			</a>
		{:else}
			<div class="creatives">
				{#each products as c (c.image)}
					<a class="creative" {href} target="_blank" rel="noopener noreferrer">
						<div class="frame">
							<img class="img" src={c.image} alt={c.title} loading="lazy" />
						</div>
						<p class="c-price">{c.price}</p>
						<p class="c-title">{c.title}</p>
					</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	:host {
		display: inline-block;
		background: transparent;
		font-family:
			system-ui,
			-apple-system,
			"Segoe UI",
			Roboto,
			sans-serif;
	}
	* {
		box-sizing: border-box;
	}

	.ad {
		position: relative;
		width: 240px;
		max-width: 240px;
		background: transparent;
		/* light theme tokens (default) */
		--border: #e2e2e6;
		--plate-bg: #ffffff;
		--label-color: #b6b9bf;
		--dots-color: #9aa0a6;
		--domain-color: #4a4d52;
		--tooltip-bg: #ffffff;
		--tooltip-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
		--legal-color: #6b7488;
		--action-color: #2563eb;
		--action-hover: rgba(37, 99, 235, 0.08);
		--text: #1c1c1f;
		--price: #5f6368;
		--cta: #2563eb;
	}
	.ad.dark {
		--border: #3a3a41;
		--plate-bg: #2a2a2e;
		--label-color: #777a82;
		--dots-color: #a7abb3;
		--domain-color: #cfd2d8;
		--tooltip-bg: #232327;
		--tooltip-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
		--legal-color: #9aa7c0;
		--action-color: #6ba3ff;
		--action-hover: rgba(107, 163, 255, 0.12);
		--text: #ececef;
		--price: #b0b3b8;
		--cta: #6ba3ff;
	}

	/* desktop gets the gray frame */
	.ad.desktop {
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}
	.ad.mobile {
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
	}

	/* ---- Desktop header bar ---- */
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
	}
	.rek {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.6px;
		text-transform: uppercase;
		color: var(--label-color);
		white-space: nowrap;
	}
	.domain {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 12px;
		color: var(--domain-color);
		overflow: hidden;
		white-space: nowrap;
	}
	.domain svg {
		flex: 0 0 auto;
		fill: none;
		stroke: var(--dots-color);
		stroke-width: 1.4;
	}
	.bar-dots {
		display: flex;
		gap: 3px;
		align-items: center;
		background: transparent;
		border: none;
		padding: 4px 2px;
		cursor: pointer;
	}
	.bar-dots .dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--dots-color);
	}

	/* ---- Mobile overlay badges ---- */
	.badge {
		position: absolute;
		top: 8px;
		z-index: 2;
		background: var(--plate-bg);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
		border: none;
	}
	.label {
		left: 8px;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 9px;
		font-weight: 700;
		color: var(--label-color);
		line-height: 1.4;
	}
	.dots {
		right: 8px;
		display: flex;
		padding: 4px 8px;
		border-radius: 10px;
		gap: 3px;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.dots .dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--dots-color);
	}
	.dots.vertical {
		flex-direction: column;
		gap: 3px;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		padding: 0;
	}

	/* ---- Tooltip ---- */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9;
	}
	.tooltip {
		position: absolute;
		top: 38px;
		right: 8px;
		z-index: 10;
		width: 230px;
		max-width: calc(100vw - 24px);
		padding: 12px;
		background: var(--tooltip-bg);
		border-radius: 12px;
		box-shadow: var(--tooltip-shadow);
		text-align: left;
	}
	.tooltip-close {
		position: absolute;
		top: 8px;
		right: 8px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2px;
		color: var(--action-color);
		display: flex;
	}
	.tooltip-close svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.tooltip-legal {
		margin: 0 18px 10px 0;
		font-size: 11px;
		line-height: 1.45;
		color: var(--legal-color);
		white-space: pre-line;
	}
	.tooltip-action {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 8px 6px;
		background: transparent;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 13px;
		color: var(--action-color);
		text-align: left;
	}
	.tooltip-action:hover {
		background: var(--action-hover);
	}
	.tooltip-action svg {
		flex: 0 0 auto;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.tooltip-action svg .fill {
		fill: currentColor;
		stroke: none;
	}
	.tooltip-action .ext {
		width: 12px;
		height: 12px;
		margin-left: -4px;
		align-self: flex-start;
	}

	/* ---- Creatives ---- */
	.creative {
		display: block;
		text-decoration: none;
	}
	.creatives .creative {
		padding: 0 12px 14px;
	}
	.frame {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		background: #ffffff;
	}
	.img {
		display: block;
		width: 100%;
		height: auto;
	}
	.img.square {
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
	.c-price {
		margin: 10px 0 4px;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--text);
	}
	.c-title {
		margin: 0;
		font-size: 13px;
		line-height: 1.35;
		color: var(--text);
	}

	/* mobile body */
	.body {
		padding: 10px 12px 12px;
	}
	.m-title {
		margin: 0 0 4px;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
		color: var(--text);
	}
	.m-price {
		margin: 0 0 6px;
		font-size: 12px;
		color: var(--price);
	}
	.m-cta {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: var(--cta);
	}
</style>
