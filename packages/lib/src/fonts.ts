// Self-hosted Inter, registered once at the document level so it applies inside
// every widget's shadow DOM (font faces are document-global). Bundling the font
// removes the dependency on whatever `system-ui` resolves to per OS, which is
// what made VRT screenshots diverge between macOS (SF Pro) and the Linux CI
// container (DejaVu). The woff2 are inlined as data URIs (`?inline`) so the
// widget stays a self-contained bundle with no external asset requests.
import cyr400 from "./assets/fonts/inter-cyrillic-400-normal.woff2?inline";
import cyr600 from "./assets/fonts/inter-cyrillic-600-normal.woff2?inline";
import cyr700 from "./assets/fonts/inter-cyrillic-700-normal.woff2?inline";
import lat400 from "./assets/fonts/inter-latin-400-normal.woff2?inline";
import lat600 from "./assets/fonts/inter-latin-600-normal.woff2?inline";
import lat700 from "./assets/fonts/inter-latin-700-normal.woff2?inline";

const CYRILLIC_RANGE = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";
const LATIN_RANGE =
	"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const face = (weight: number, src: string, range: string) =>
	`@font-face{font-family:"Inter";font-style:normal;font-weight:${weight};font-display:swap;src:url(${src}) format("woff2");unicode-range:${range};}`;

const STYLE_ID = "svelte-ad-widget-inter-font";

export function registerFonts(): void {
	if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;

	const style = document.createElement("style");
	style.id = STYLE_ID;
	style.textContent = [
		face(400, lat400, LATIN_RANGE),
		face(400, cyr400, CYRILLIC_RANGE),
		face(600, lat600, LATIN_RANGE),
		face(600, cyr600, CYRILLIC_RANGE),
		face(700, lat700, LATIN_RANGE),
		face(700, cyr700, CYRILLIC_RANGE)
	].join("");
	document.head.appendChild(style);
}

registerFonts();
