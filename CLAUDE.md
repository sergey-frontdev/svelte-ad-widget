# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` / `npm run dev` — Start Vite dev server for the demo app (uses `vite.demo.config.ts`, default at http://localhost:5173).
- `npm run build` — Build the web components library to `dist/lib/` (uses `vite.config.ts`).
- `npm run build:demo` — Build the demo app to `dist/demo/`.
- `npm run preview` — Preview the built demo.
- `npm run check` — Type-check Svelte + TS with `svelte-check`.
- `npm run lint` / `npm run format` — Prettier check / write across the repo.

There is no test runner configured.

## Architecture

This is a Svelte 3 + Vite + TypeScript template that compiles Svelte components into framework-agnostic **custom elements (web components)**. The repo uses two parallel Vite configs and a `packages/` split:

- `packages/lib/` — Library source. Entry is `packages/lib/index.ts`, which re-exports every component intended for distribution. Components destined to become custom elements use the `.wc.svelte` extension and declare their tag via `<svelte:options tag="..." />` (e.g. `MyComponent.wc.svelte` → `<my-component>`).
- `packages/demo/` — A Svelte SPA used to develop/test the library. It imports `../../lib` directly so changes are picked up live.

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

### Web component conventions (from README)

- Only `.wc.svelte` files are exported as web components; ordinary `.svelte` files are for internal/child use.
- HTML attributes are lowercase only — declare props in lowercase (`export let myvalue`), not camelCase.
- Svelte's `on:event` syntax does not work on custom elements (sveltejs/svelte#3119). Dispatch via `get_current_component()` + `new CustomEvent(...)` as shown in the README.
- No polyfills are bundled; the host app is expected to provide them if needed.

## TypeScript

`tsconfig.json` extends `@tsconfig/svelte` with `allowJs: true` and `checkJs: true` (see README "Why enable allowJs" for rationale — disabling `allowJs` would also force `checkJs: false` and weaken checking inside `.svelte` files).
