// Demo content for the ad widget. In a real ad network these values arrive from
// the ad server; here they are bundled as sensible defaults so the widget renders
// out of the box. Images are referenced by their CDN URL directly (standard
// practice for ad creatives — the network serves the asset, the creative links it).

export interface Advertiser {
	/** Legal disclaimer shown at the top of the tooltip. */
	legal: string;
	inn: string;
	/** Public ad identifier, e.g. "#000000001". */
	id: string;
}

/** Product card creative: framed image + price (heading) + description. */
export interface Creative {
	image: string;
	price: string;
	title: string;
}

/** Promo card creative: image + text + call-to-action (a separate card subtype). */
export interface PromoCard {
	image: string;
	title: string;
	price: string;
	cta: string;
}

export interface AdContent {
	/** Advertiser site shown in the product-card header. */
	domain: string;
	/** Landing page. */
	href: string;
	/**
	 * Product creatives (variant "v1"): shown as a double card on desktop and
	 * collapsed to a single card on mobile.
	 */
	products: Creative[];
	/** Promo card (variant "v2") — a different card subtype, e.g. the Audi creative. */
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
			price: "25 843 567,50 ₽",
			title: "Дизельная электростанция Caterpillar DE715 GC (520 кВт)"
		},
		{
			image: IMG.weichai,
			price: "14 556 523,07 ₽",
			title: "Дизельная электростанция Weichai WPG825 B7 (600 кВт)"
		}
	],
	promo: {
		image: IMG.audi,
		title: "Audi A7 Sportback — в наличии у дилера",
		price: "от 5 990 000 ₽ · кредит 0,01%",
		cta: "Перейти на сайт"
	},
	advertiser: {
		legal: "Финансовые услуги оказывает ООО «Тут могла быть ваша компания Общество с ограниченной ответственностью»",
		inn: "00000000001",
		id: "#000000001"
	}
};
