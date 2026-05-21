import type { Meta, StoryObj } from "@storybook/svelte";
import ChatWidget from "./ChatWidget.story.svelte";

const meta = {
	title: "Widgets/ChatWidget",
	component: ChatWidget,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen"
	},
	argTypes: {
		username: { control: "text" }
	}
} satisfies Meta<ChatWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { username: "Эдвард Сноуден" }
};

export const CustomUser: Story = {
	args: { username: "Иван Петров" }
};
