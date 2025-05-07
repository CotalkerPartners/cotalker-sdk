// eslint-disable-next-line import/no-extraneous-dependencies
import { OpenAI } from "openai";

export type AssistantIntent =
	| "tasks_today"
	| "team_tasks_today"
	| "tasks_overdue"
	| "tasks_by_state"
	| "summary"
	| "summary_by_assignee"
	| "tasks_without_property"
	| "tasks_grouped_by_property"
	| "tasks_stale"
	| "unknown";

export interface IntentResult {
	intent: AssistantIntent;
	date?: Date;
}

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!
});

/**
 * GPT-powered resolver
 */
async function resolveIntentGPT(message: string): Promise<IntentResult> {
	const systemPrompt = `
Eres un clasificador de intenciones para un asistente en Cotalker.
Basado en el mensaje del usuario, debes identificar qué acción se desea realizar.

Responde SOLO con el intent ID (sin explicación), de esta lista:
- tasks_today
- team_tasks_today
- tasks_overdue
- tasks_by_state
- summary
- summary_by_assignee
- tasks_without_property
- tasks_grouped_by_property
- tasks_stale

Si no entiendes la intención, responde: unknown
`.trim();

	const response = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: message }
		],
		max_tokens: 10,
		temperature: 0
	});

	const content =
		response.choices[0].message.content?.trim() as AssistantIntent;

	return {
		intent: content || "unknown"
	};
}

/**
 * Resolver principal usando SOLO GPT
 */
export async function resolveIntent(message: string): Promise<IntentResult> {
	return resolveIntentGPT(message);
}
