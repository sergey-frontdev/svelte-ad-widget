import type { Preview } from "@storybook/svelte";
import { withScreenshot } from "storycap";

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
		// a different size. `delay` lets fonts/images settle before the snapshot.
		screenshot: {
			viewports: ["1280x800"],
			delay: 300,
			fullPage: false
		}
	},
	// storycap's capture trigger — must be a global decorator so every story
	// signals "ready" to the crawler.
	decorators: [withScreenshot]
};

export default preview;
