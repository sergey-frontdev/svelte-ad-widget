import type { Meta, StoryObj } from "@storybook/svelte";
import ChatWidget from "./ChatWidget.story.svelte";

const meta = {
	title: "Widgets/ChatWidget",
	component: ChatWidget,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		// Panel is position:fixed (fullPage can't measure it), so use a fixed
		// viewport. The panel anchors bottom-right (right/bottom: 24px), so we
		// size the viewport with extra room on top/left (~96px) to capture its
		// drop shadow (0 18px 50px). The bottom/right shadow stays against the
		// viewport edge — an accepted limitation (mirrors a real screen corner).
		screenshot: { viewports: ["480x680"] }
	},
	argTypes: {
		username: { control: "text" },
		// Story-only flag (opens the panel on mount) — not a widget attribute.
		open: { table: { disable: true } }
	}
} satisfies Meta<ChatWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// Closed: only the 60px launcher is visible. Capture a small viewport with
// extra top/left room so its shadow (0 6px 20px + ring) is included; the
// bottom/right shadow stays against the edge (accepted, as with the panel).
const launcherViewport = { screenshot: { viewports: ["124x124"] } };

export const Default: Story = {
	args: { username: "Эдвард Сноуден" },
	parameters: launcherViewport
};

export const CustomUser: Story = {
	args: { username: "Иван Петров" },
	parameters: launcherViewport
};

// Panel opened — covers the chat in its open state (greeting + FAQ chips),
// which the launcher-only stories never exercise.
export const Open: Story = {
	name: "Open",
	args: { username: "Эдвард Сноуден", open: true }
};
