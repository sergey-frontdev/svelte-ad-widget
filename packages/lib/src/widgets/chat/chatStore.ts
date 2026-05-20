// Chat flow / state machine for the chatbot widget, kept out of the .wc.svelte
// component so the component stays focused on markup + styles.
import { writable, get, type Writable } from "svelte/store";
import {
	greeting,
	faq,
	matchQuestion,
	feedbackPrompt,
	fallbackAnswer,
	specialistGreeting,
	waitingForSpecialist
} from "./carQA";

export type Sender = "user" | "bot" | "specialist";

export interface ChatMessage {
	id: number;
	sender: Sender;
	text: string;
}

export interface QuickReply {
	label: string;
	/** Echo the label as a user message before running the action. */
	asUser?: boolean;
	action: () => void;
}

export interface Chat {
	messages: Writable<ChatMessage[]>;
	quickReplies: Writable<QuickReply[]>;
	isTyping: Writable<boolean>;
	dotCount: Writable<number>;
	/** Seed the greeting + FAQ chips (idempotent). */
	start(): void;
	/** Send free-text input from the composer. */
	send(text: string): void;
	/** Handle a quick-reply chip click. */
	clickChip(reply: QuickReply): void;
	/** Register a callback fired whenever content changes (e.g. scroll to bottom). */
	onUpdate(fn: () => void): void;
	/** Clear all pending timers. */
	destroy(): void;
}

export function createChat(): Chat {
	const messages = writable<ChatMessage[]>([]);
	const quickReplies = writable<QuickReply[]>([]);
	const isTyping = writable(false);
	const dotCount = writable(1);

	let nextId = 1;
	let updateHandler: () => void = () => {};
	const timers = new Set<ReturnType<typeof setTimeout>>();
	let dotTimer: ReturnType<typeof setInterval> | undefined;

	function later(fn: () => void, ms: number) {
		const t = setTimeout(() => {
			timers.delete(t);
			fn();
		}, ms);
		timers.add(t);
	}

	function push(sender: Sender, text: string) {
		messages.update((list) => [...list, { id: nextId++, sender, text }]);
		updateHandler();
	}

	function startTyping() {
		isTyping.set(true);
		dotCount.set(1);
		dotTimer = setInterval(() => dotCount.update((n) => (n % 3) + 1), 450); // 1 -> 2 -> 3 -> 1
		updateHandler();
	}

	function stopTyping() {
		isTyping.set(false);
		if (dotTimer) {
			clearInterval(dotTimer);
			dotTimer = undefined;
		}
	}

	function showFaqChips() {
		quickReplies.set(
			faq.map((item) => ({
				label: item.question,
				asUser: true,
				action: () => respondTo(item.question)
			}))
		);
	}

	function respondTo(text: string) {
		quickReplies.set([]);
		startTyping();

		later(() => {
			stopTyping();
			const match = matchQuestion(text);

			if (match) {
				push("bot", match.answer);
				later(() => {
					push("bot", feedbackPrompt);
					quickReplies.set([
						{ label: "Ответ подходит", action: answerAccepted },
						{ label: "Нужен специалист", action: callSpecialist }
					]);
				}, 700);
			} else {
				push("bot", fallbackAnswer);
				quickReplies.set([
					{ label: "Подключить специалиста", action: callSpecialist },
					{ label: "Задать другой вопрос", action: showFaqChips }
				]);
			}
		}, 2000);
	}

	function answerAccepted() {
		quickReplies.set([]);
		push("bot", "Отлично, рад был помочь! 🚗 Могу ответить ещё на один вопрос:");
		showFaqChips();
	}

	function callSpecialist() {
		quickReplies.set([]);
		push("bot", waitingForSpecialist);
		startTyping();
		later(() => {
			stopTyping();
			push("specialist", specialistGreeting);
		}, 5000);
	}

	return {
		messages,
		quickReplies,
		isTyping,
		dotCount,
		start() {
			if (get(messages).length === 0) {
				push("bot", greeting);
				showFaqChips();
			}
		},
		send(text: string) {
			const trimmed = text.trim();
			if (!trimmed || get(isTyping)) return;
			quickReplies.set([]);
			push("user", trimmed);
			respondTo(trimmed);
		},
		clickChip(reply: QuickReply) {
			if (reply.asUser) push("user", reply.label);
			reply.action();
		},
		onUpdate(fn: () => void) {
			updateHandler = fn;
		},
		destroy() {
			timers.forEach(clearTimeout);
			timers.clear();
			stopTyping();
		}
	};
}
