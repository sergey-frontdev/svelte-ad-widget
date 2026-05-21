import type { Meta, StoryObj } from "@storybook/svelte";
import AdWidget from "./AdWidget.story.svelte";

const meta = {
	title: "Widgets/AdWidget",
	component: AdWidget,
	tags: ["autodocs"],
	argTypes: {
		theme: { control: "inline-radio", options: ["light", "dark"] },
		variant: {
			control: "inline-radio",
			options: ["v1", "v2"],
			description: 'Desktop layout: "v1" = two stacked creatives, "v2" = single creative.'
		},
		title: { control: "text" },
		price: { control: "text" },
		cta: { control: "text" }
	}
} satisfies Meta<AdWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightV1: Story = {
	name: "Light / v1",
	args: { theme: "light", variant: "v1" }
};

export const LightV2: Story = {
	name: "Light / v2",
	args: { theme: "light", variant: "v2" }
};

export const Dark: Story = {
	args: { theme: "dark", variant: "v1" }
};

export const CustomContent: Story = {
	args: {
		theme: "light",
		variant: "v2",
		title: "Новый кроссовер 2026",
		price: "от 2 490 000 ₽",
		cta: "Узнать больше"
	}
};
