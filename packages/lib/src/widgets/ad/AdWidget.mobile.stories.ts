import type { Meta, StoryObj } from "@storybook/svelte";
import AdWidget from "./AdWidget.story.svelte";
import { mobileArgTypes } from "./argTypes";

const meta = {
	title: "Widgets/AdWidget/Mobile",
	component: AdWidget,
	tags: ["autodocs"],
	args: { variant: "mobile" },
	argTypes: mobileArgTypes
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
