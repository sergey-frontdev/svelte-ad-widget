export interface Advertiser {
	/** Full disclosure text shown in the "О рекламодателе" tooltip (legal + ИНН + ID). */
	legal: string;
}

export interface Creative {
	image: string;
	price: string;
	title: string;
}

export interface PromoCard {
	image: string;
	title: string;
	price: string;
	cta: string;
}

export interface AdContent {
	domain: string;
	href: string;
	products: Creative[];
	promo: PromoCard;
	advertiser: Advertiser;
}

const IMG = {
	cat: "https://avatars.mds.yandex.net/get-yabs_performance/4489610/hatfadb75175441d05ce1e76a0d3054e318/huge",
	weichai: "https://avatars.mds.yandex.net/get-yabs_performance/15059243/hat991f3c7846491e0ed95a1d82878597eb/huge",
	audi: "https://avatars.mds.yandex.net/get-yabs_performance/10229198/hat238f11be14deb4bc5e005310c9a689c9/huge"
};

export const adContent: AdContent = {
	domain: "tech-expo.ru",
	href: "https://example.com",
	products: [
		{
			image: IMG.cat,
			price: "16 843 567,50 ₽",
			title: "Автобус Youtong ZK6116HG"
		},
		{
			image: IMG.weichai,
			price: "14 556 523,07 ₽",
			title: "Автобус Youtong ZK6112 H9"
		}
	],
	promo: {
		image: IMG.audi,
		title: "Audi A6 — в наличии у дилера",
		price: "от 4 990 000 ₽ · кредит 16,01%",
		cta: "Перейти на сайт"
	},
	advertiser: {
		legal: "Финансовые услуги оказывает ООО «Тут могла быть ваша компания - Общество с ограниченной ответственностью»\nИНН — 00000000001, ID: #000000001"
	}
};
