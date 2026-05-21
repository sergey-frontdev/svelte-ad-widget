import type { Meta, StoryObj } from "@storybook/svelte";
import AdWidget from "./AdWidget.story.svelte";
import { desktopArgTypes } from "./argTypes";

const meta = {
	title: "Widgets/AdWidget/Desktop",
	component: AdWidget,
	tags: ["autodocs"],
	argTypes: desktopArgTypes
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
