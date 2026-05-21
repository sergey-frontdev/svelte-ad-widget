// Storybook controls for the AdWidget stories.
// Each docs page only exposes the props that actually affect that layout.

const hidden = { table: { disable: true } } as const;

// Tooltip ("О рекламодателе") + link — shared by both layouts.
const common = {
	theme: {
		control: "inline-radio",
		options: ["light", "dark"],
		description: "Цветовая тема карточки."
	},
	href: {
		control: "text",
		description: "URL сайта, куда ведёт переход по карточке."
	},
	legal: {
		control: "text",
		description: "Текст тултипа «О рекламодателе» целиком (юр. текст + ИНН + ID; переносы строк сохраняются)."
	}
} as const;

// Desktop product card — promo (image/title/description/cta) props don't apply.
export const desktopArgTypes = {
	...common,
	variant: {
		control: "inline-radio",
		options: ["long", "short"],
		description: "Раскладка десктопной карточки: «long» — два автобуса, «short» — один."
	},
	domain: {
		control: "text",
		description: "Домен сайта рекламодателя (показывается в шапке карточки)."
	},
	image: hidden,
	title: hidden,
	description: hidden,
	cta: hidden
} as const;

// Mobile promo card (Audi) — desktop-only `domain` doesn't apply.
export const mobileArgTypes = {
	...common,
	variant: {
		control: "inline-radio",
		options: ["mobile"],
		description: "Мобильная промо-карточка (креатив Audi)."
	},
	image: {
		control: "text",
		description: "Картинка креатива."
	},
	title: {
		control: "text",
		description: "Заголовок карточки."
	},
	description: {
		control: "text",
		description: "Подзаголовок под заголовком (например, цена и условия кредита)."
	},
	cta: {
		control: "text",
		description: "Надпись на кнопке-призыве к действию."
	},
	domain: hidden
} as const;
