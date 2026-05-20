// Mock knowledge base for the car-selection chatbot widget.
// `keywords` are matched (case-insensitive) against the user's free-text input.
// If nothing matches, the widget offers to connect a human specialist.

export interface QAItem {
	id: string;
	/** Text shown on the quick-reply chip and inserted into the input when clicked. */
	question: string;
	/** Lowercase tokens used to match against free-text questions. */
	keywords: string[];
	answer: string;
}

export const greeting =
	"Здравствуйте! Я виртуальный помощник по подбору автомобиля. Выберите вопрос ниже или напишите свой — постараюсь помочь.";

export const faq: QAItem[] = [
	{
		id: "budget",
		question: "Какую машину выбрать до 1,5 млн ₽?",
		keywords: ["бюджет", "до 1", "1.5", "1,5", "млн", "недорог", "дешев", "цена", "стоит", "сколько"],
		answer:
			"В бюджете до 1,5 млн ₽ хорошо себя показывают компактные кроссоверы и седаны B/C-класса с пробегом 3–5 лет. Подскажите, важнее экономичность, простор салона или клиренс — и я сужу варианты."
	},
	{
		id: "new-or-used",
		question: "Новый автомобиль или с пробегом?",
		keywords: ["новый", "с пробегом", "пробег", "бу", "б/у", "подержан", "вторич"],
		answer:
			"Новый — это гарантия и предсказуемость, но он теряет до 20% стоимости в первый год. Авто с пробегом 2–4 лет выгоднее по цене, но требует диагностики. Если бюджет ограничен — обычно берут проверенный вариант с пробегом."
	},
	{
		id: "body-type",
		question: "Какой тип кузова выбрать?",
		keywords: ["кузов", "седан", "кроссовер", "хэтчбек", "универсал", "внедорожник", "suv", "тип"],
		answer:
			"Для города и парковок удобнее хэтчбек или компактный седан. Для семьи и поездок за город — кроссовер или универсал: больше багажник и клиренс. Расскажите про сценарии использования, и я подскажу класс."
	},
	{
		id: "engine",
		question: "Бензин, дизель или электро?",
		keywords: ["бензин", "дизель", "электро", "гибрид", "двигатель", "мотор", "топлив", "расход"],
		answer:
			"Бензин — универсально и дёшево в обслуживании. Дизель выгоден при больших пробегах (от 25–30 тыс. км в год). Электро и гибрид экономичны в городе, но зависят от инфраструктуры зарядок. Сколько вы проезжаете в год?"
	},
	{
		id: "transmission",
		question: "Автомат или механика?",
		keywords: ["автомат", "механика", "коробка", "акпп", "мкпp", "мкпп", "вариатор", "робот", "трансмисс"],
		answer:
			"Классический автомат (гидротрансформатор) — самый комфортный и надёжный для города. Механика дешевле в ремонте и экономичнее. Вариатор плавный, но не любит агрессивную езду. Для пробок рекомендую автомат."
	},
	{
		id: "inspection",
		question: "Как проверить авто перед покупкой?",
		keywords: ["проверить", "проверка", "диагностик", "осмотр", "битый", "юридическ", "вин", "vin", "история"],
		answer:
			"Минимум: проверка по VIN (история ДТП, залоги, ограничения), толщиномер по кузову, компьютерная диагностика и тест-драйв. Лучше заехать на подъёмник к независимому эксперту — это окупается."
	}
];

// Used when bot answers but wants confirmation.
export const feedbackPrompt = "Этот ответ помог вам?";

// Shown when free-text input doesn't match any keywords.
export const fallbackAnswer =
	"Хм, я не нашёл точного ответа на этот вопрос в своей базе. Могу подключить живого специалиста — он ответит детально.";

export const specialistName = "Сергей";
export const specialistGreeting =
	"Здравствуйте, меня зовут Сергей, я эксперт по подбору авто. Расскажите подробнее, что вы ищете, и я помогу с выбором!";

export const waitingForSpecialist = "Подключаю специалиста, пожалуйста, ожидайте…";

/**
 * Find the best-matching QA item for a free-text query.
 * Returns the item with the most keyword hits, or null if none match.
 */
export function matchQuestion(text: string): QAItem | null {
	const normalized = text.toLowerCase();
	let best: QAItem | null = null;
	let bestScore = 0;

	for (const item of faq) {
		const score = item.keywords.reduce((acc, kw) => (normalized.includes(kw) ? acc + 1 : acc), 0);
		if (score > bestScore) {
			bestScore = score;
			best = item;
		}
	}

	return bestScore > 0 ? best : null;
}
