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

export interface AdContent {
	/** Square creative used on mobile. */
	mobileImage: string;
	/** Two stacked creatives used by the desktop "double" layout (variant v1). */
	desktopImagesV1: [string, string];
	/** Single creative used by the desktop layout variant v2. */
	desktopImageV2: string;
	/** Short marketing line (mobile). */
	title: string;
	/** Price / offer line. */
	price: string;
	/** Call-to-action label. */
	cta: string;
	/** Landing page. */
	href: string;
	advertiser: Advertiser;
}

export const adContent: AdContent = {
	mobileImage: "https://avatars.mds.yandex.net/get-yabs_performance/10229198/hat238f11be14deb4bc5e005310c9a689c9/huge",
	desktopImagesV1: [
		"https://avatars.mds.yandex.net/get-yabs_performance/4489610/hatfadb75175441d05ce1e76a0d3054e318/huge",
		"https://avatars.mds.yandex.net/get-yabs_performance/15059243/hat991f3c7846491e0ed95a1d82878597eb/huge"
	],
	desktopImageV2: "https://avatars.mds.yandex.net/get-direct-picture/4012098/Pxlfd9luDHPjWEHhTkNJPQ/optimize",
	title: "Кредитная карта «120 дней без процентов»",
	price: "Кэшбэк до 30% · 0 ₽ обслуживание",
	cta: "Перейти на сайт",
	href: "https://example.com",
	advertiser: {
		legal: "Финансовые услуги оказывает ООО «Тут могла быть ваша компания Общество с ограниченной ответственностью»",
		inn: "00000000001",
		id: "#000000001"
	}
};
