import type { Preview } from "@storybook/svelte";
import { withScreenshot } from "storycap";

// storycap calls this global in the page context before capturing (referenced
// by name via `parameters.screenshot.waitFor`). The widgets bundle Inter as
// data-URI woff2 with `font-display: swap`, so without waiting for the faces to
// finish loading the screenshot can land on a fallback font — slightly
// different glyphs and a flaky text diff. `document.fonts.ready` resolves once
// all pending faces are loaded.
const WAIT_FOR_FONTS = "waitForFonts";
if (typeof window !== "undefined") {
	(window as unknown as Record<string, () => Promise<unknown>>)[WAIT_FOR_FONTS] = () =>
		typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve();
}

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		// Storycap (visual regression) capture settings, applied to every story.
		// Widgets are inline-block with a fixed width, so a single viewport is
		// enough; override per-meta via `parameters.screenshot` if a story needs
		// a different size. `waitFor` blocks the capture on web-font loading (see
		// WAIT_FOR_FONTS above); `delay` is a small extra settle for images.
		screenshot: {
			viewports: ["1280x800"],
			waitFor: WAIT_FOR_FONTS,
			delay: 300,
			fullPage: false
		}
	},
	// storycap's capture trigger — must be a global decorator so every story
	// signals "ready" to the crawler.
	decorators: [withScreenshot]
};

export default preview;
