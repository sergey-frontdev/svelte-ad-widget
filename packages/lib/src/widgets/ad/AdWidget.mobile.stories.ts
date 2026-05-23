import type { Meta, StoryObj } from "@storybook/svelte";
import AdWidget from "./AdWidget.story.svelte";
import { mobileArgTypes } from "./argTypes";

const meta = {
	title: "Widgets/AdWidget/Mobile",
	component: AdWidget,
	tags: ["autodocs"],
	args: { variant: "mobile" },
	argTypes: mobileArgTypes,
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

// Mobile promo card (Audi creative).
export const Light: Story = {
	name: "Light Mobile",
	args: { theme: "light" }
};

export const Dark: Story = {
	name: "Dark Mobile",
	args: { theme: "dark" }
};

// Tooltip ("О рекламодателе") opened on the mobile promo card.
export const TooltipLight: Story = {
	name: "Tooltip Light",
	args: { theme: "light", openmenu: true }
};

export const TooltipDark: Story = {
	name: "Tooltip Dark",
	args: { theme: "dark", openmenu: true }
};

export const Custom: Story = {
	name: "Custom",
	args: {
		theme: "light",
		image: "https://avatars.mds.yandex.net/get-yabs_performance/10229198/hat238f11be14deb4bc5e005310c9a689c9/huge",
		title: "Новый кроссовер 2026",
		description: "от 2 490 000 ₽ · кредит 16,01%",
		cta: "Узнать больше",
		domain: "tech-expo.ru",
		href: "https://example.com",
		legal: "Финансовые услуги оказывает ООО «Тут могла быть ваша компания»\nИНН — 00000000001, ID: #000000001"
	}
};
