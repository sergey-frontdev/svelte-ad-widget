import type { Meta, StoryObj } from "@storybook/svelte";
import AdWidget from "./AdWidget.story.svelte";
import { desktopArgTypes } from "./argTypes";

const meta = {
	title: "Widgets/AdWidget/Desktop",
	component: AdWidget,
	tags: ["autodocs"],
	argTypes: desktopArgTypes,
	parameters: {
		// Drop Storybook's canvas padding. Width = the stage width (240px card +
		// 40px padding each side); a real width keeps the widget's vw-based
		// styles (e.g. the tooltip's max-width: calc(100vw - 24px)) correct. The
		// short height + fullPage makes the capture auto-fit the card's height.
		// Card growth overflows → captured; shrink → whitespace; either way the
		// screenshot size changes and VRT flags it. Padding holds the shadows.
		layout: "fullscreen",
		screenshot: { viewports: ["320x64"], fullPage: true }
	}
} satisfies Meta<AdWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// "long" = both buses, "short" = a single bus.
export const LightLong: Story = {
	name: "Light Long",
	args: { theme: "light", variant: "long" }
};

export const LightShort: Story = {
	name: "Light Short",
	args: { theme: "light", variant: "short" }
};

export const DarkLong: Story = {
	name: "Dark Long",
	args: { theme: "dark", variant: "long" }
};

export const DarkShort: Story = {
	name: "Dark Short",
	args: { theme: "dark", variant: "short" }
};

// Tooltip ("О рекламодателе") opened — covers the menu/legal popover that the
// other stories never exercise. `long` keeps the card tall enough that the
// popover isn't clipped by the card's overflow:hidden.
export const TooltipLight: Story = {
	name: "Tooltip Light",
	args: { theme: "light", variant: "long", openmenu: true }
};

export const TooltipDark: Story = {
	name: "Tooltip Dark",
	args: { theme: "dark", variant: "long", openmenu: true }
};
