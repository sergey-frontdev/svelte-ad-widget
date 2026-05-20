// Public entry point for the web-components library.
// Each widget lives in its own folder under src/widgets/ and registers a custom
// element via its <svelte:options tag="..."/>. Add new widgets by exporting them here.
export { default as ChatWidget } from "./src/widgets/chat/ChatWidget.wc.svelte";
export { default as AdWidget } from "./src/widgets/ad/AdWidget.wc.svelte";
