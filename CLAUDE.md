# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` / `npm run dev` — Start Vite dev server for the demo app (uses `vite.demo.config.ts`, default at http://localhost:5173).
- `npm run build` — Build the web components library to `dist/lib/` (uses `vite.config.ts`).
- `npm run build:demo` — Build the demo app to `dist/demo/`.
- `npm run preview` — Preview the built demo.
- `npm run check` — Type-check Svelte + TS with `svelte-check`.
- `npm run lint` / `npm run format` — Prettier check / write across the repo.
- `npm run storybook` — Run Storybook dev server (port 6006) for developing/documenting widgets.
- `npm run build-sb` / `npm run serve-sb` — Build static Storybook to `storybook-static/` / serve it on port 6006.
- `npm run vrt:docker` — **Preferred VRT entry point.** Runs the full visual regression suite inside the pinned CI container (`ghcr.io/puppeteer/puppeteer:25.0.4`, `--platform linux/amd64`) defined by `Dockerfile.vrt` + `docker-compose.vrt.yml`, so screenshots match GitHub CI byte-for-byte. Requires Docker.
- `npm run vrt:approve:docker` — Re-capture and promote the baseline inside the same container. Use this (not the bare `vrt:approve`) to regenerate `.reg/expected/`, then commit it.
- `npm run vrt` — Full visual regression run: build + serve Storybook, capture screenshots with storycap, then diff against the baseline with `reg-suit run`. Runs natively — only meaningful **inside** the container (or in CI); a native macOS run produces false font-rasterization diffs.
- `npm run vrt:capture` — Just capture screenshots into `__screenshots__/` (no diff).
- `npm run vrt:approve` — Promote the current `__screenshots__/` to the committed baseline in `.reg/expected/`. Native; prefer `vrt:approve:docker`.

There is no unit test runner. The only automated test layer is the screenshot-based visual regression suite (see below).

## Architecture

This is a Svelte 3 + Vite + TypeScript project (based on a web-components library template) that compiles Svelte components into framework-agnostic **custom elements (web components)**. The shipped product is a set of embeddable ad/chat widgets. The repo uses two parallel Vite configs and a `packages/` split:

- `packages/lib/` — Library source. Entry is `packages/lib/index.ts`, which re-exports every widget intended for distribution. Widgets live one-per-folder under `packages/lib/src/widgets/` and use the `.wc.svelte` extension, declaring their tag via `<svelte:options tag="..." />` (e.g. `AdWidget.wc.svelte` → `<ad-widget>`, `ChatWidget.wc.svelte` → `<chat-widget>`).
- `packages/demo/` — A Svelte SPA used to develop/test the library. It imports `../../lib` directly so changes are picked up live.

### Widgets

- **AdWidget** (`<ad-widget>`, `src/widgets/ad/`) — Russian-language ad card. Props (lowercase attributes): `theme` (`light`/`dark`), `variant` (`long`/`short` desktop product cards, `mobile` promo card), plus per-attribute content overrides (`href`, `domain`, `legal`, `image`, `title`, `description`, `cta`). Defaults come from `adContent.ts`; only set overrides are applied. The "О рекламодателе" tooltip is internal state with no prop.
- **ChatWidget** (`<chat-widget>`, `src/widgets/chat/`) — Chat bubble UI. Has internal child components (`Avatar.svelte`, `Message.svelte`) and a `chatStore.ts` store. Demo Q&A data in `carQA.ts`.
- Internal/child components use the plain `.svelte` extension (not exported, not compiled as custom elements).

### Two-pass Svelte plugin

Both `vite.config.ts` and `vite.demo.config.ts` register the `@sveltejs/vite-plugin-svelte` **twice**: once that excludes `*.wc.svelte` (compiled as normal Svelte components — used for child/internal components and the demo app) and once that includes only `*.wc.svelte` (compiled as custom elements). This is the mechanism that lets a single repo emit both regular Svelte components and web components. When modifying the build, preserve this split.

### Library build (`vite.config.ts`)

- `root` is `packages/lib/`, output is `dist/lib/`.
- Controlled by `BUNDLE_COMPONENTS` env var (default truthy): when bundled, emits a single library in `es`, `esm` (minified), and `umd` formats named after `pkg.name`. When `BUNDLE_COMPONENTS=false`, emits one ES module per component via dynamic imports + manual chunks (see README "Building each component into its own module"). The expected pattern for unbundled mode is to change `packages/lib/index.ts` to dynamically `import()` each `.wc.svelte` file.
- A custom `minifyEs()` plugin post-processes ES output with esbuild because Vite's built-in minifier doesn't apply to library ES builds (workaround for vitejs/vite#6555).
- `package.json` `module`/`main` point at `dist/lib/my-library.{js,umd.js}` — the filename is derived from `pkg.name`, so renaming the package requires checking these paths.

### Demo build (`vite.demo.config.ts`)

- `root` is `packages/demo/`, output is `dist/demo/`.
- The `.wc.svelte` plugin pass sets `customElement: true` so the demo registers actual custom elements at runtime. HMR is disabled in both passes.
- `resolve.dedupe: ["svelte"]` is required because the demo and the lib both pull in Svelte.

### Storybook (`.storybook/`)

- Storybook 7 + `@storybook/svelte-vite`. Stories are `packages/**/*.stories.@(js|ts|svelte)`.
- The framework injects a single Svelte plugin that compiles everything as normal components, so `<svelte:options tag=...>` on `.wc.svelte` is ignored. `.storybook/main.ts`'s `viteFinal` strips that plugin and re-adds the **same two-pass setup** the lib build uses, so custom elements actually register inside Storybook. Preserve this when touching Storybook config.
- Stories render through a `*.story.svelte` wrapper (e.g. `AdWidget.story.svelte`) — it side-effect-imports the `.wc.svelte` to register the element, forwards only set attributes, and can drive internal interactions (e.g. `openmenu` clicks the tooltip button in the shadow DOM on mount). `argTypes.ts` defines the Storybook controls.

### Visual regression testing (VRT)

- Powered by **storycap** (Puppeteer screenshots) + **reg-suit** (diffing). Config in `regconfig.json` (`matchingThreshold: 0.05`, `thresholdRate: 0.01`). Baseline images are committed under `.reg/expected/`; fresh captures land in `__screenshots__/`.
- **Environment matters: always run VRT in the container.** The baseline must come from the same image+arch as CI. `Dockerfile.vrt` bakes deps into an image based on `ghcr.io/puppeteer/puppeteer:25.0.4` (Docker layer cache + a BuildKit npm cache mount handle reinstalls — only on `package*.json` change); `docker-compose.vrt.yml` runs it pinned to `platform: linux/amd64` (matching `ubuntu-latest`), bind-mounts the repo and masks the host's macOS-native `node_modules` with the image's baked Linux ones (an empty anonymous volume on `/work/node_modules`). Keep the base image tag in `Dockerfile.vrt` in sync with the two workflow files. The bundled Inter font (`packages/lib/src/fonts.ts`) fixes the typeface but **not** the rasterizer — macOS CoreText vs Linux FreeType anti-alias differently, so a natively-captured baseline shows false text diffs against CI.
- `.storybook/preview.ts` registers a global `waitForFonts` (resolving `document.fonts.ready`) referenced via `parameters.screenshot.waitFor`, so captures block on web-font loading and don't flake on `font-display: swap` falling back.
- `scripts/storycap.mjs` resolves the pinned Chromium via `puppeteer.executablePath()` and passes it as `--chromiumPath` (storycap v4's `--chromiumChannel puppeteer` is broken against puppeteer 25). It captures against the **static** Storybook build served on :6006 (not `storybook dev`, whose client redirect breaks Puppeteer's context).
- Per-story screenshot params (`viewports`, `fullPage`, `layout: fullscreen`) live in each `.stories.ts` `parameters`. The `.story.svelte` stage padding (40px) is intentional so box-shadows fall inside the captured box and VRT catches shadow regressions.
- CI (`.github/workflows/main.yml`): lint → build → screenshot job runs `npm run vrt` in the `ghcr.io/puppeteer/puppeteer:25.0.4` container and uploads the `.reg` report artifact. `update-baseline.yml` is a manual `workflow_dispatch` that re-captures, promotes to baseline, and commits.

### Web component conventions (from README)

- Only `.wc.svelte` files are exported as web components; ordinary `.svelte` files are for internal/child use.
- HTML attributes are lowercase only — declare props in lowercase (`export let myvalue`), not camelCase.
- Svelte's `on:event` syntax does not work on custom elements (sveltejs/svelte#3119). Dispatch via `get_current_component()` + `new CustomEvent(...)` as shown in the README.
- No polyfills are bundled; the host app is expected to provide them if needed.

## TypeScript

`tsconfig.json` extends `@tsconfig/svelte` with `allowJs: true` and `checkJs: true` (see README "Why enable allowJs" for rationale — disabling `allowJs` would also force `checkJs: false` and weaken checking inside `.svelte` files).
