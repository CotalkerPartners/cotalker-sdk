import { ObjectId } from "@customTypes/custom";
import COTMessageClient from "@models/COTMessageClient";
import { AxiosInstance } from "axios";
import { subYears } from "date-fns";
import OpenAI from "openai";

/**
 * Parameters used to generate a summary from a channel.
 */
type SummaryParams = {
	channelId: ObjectId;
	openaiToken: string;
	date?: Date;
	limit_char?: number;
	model?: string;
	systemPrompt?: string;
};

/**
 * Client to generate summaries using OpenAI based on Cotalker channel messages.
 */
export default class COTOpenAIClient {
	/**
	 * Internal message client used to retrieve messages.
	 * @private
	 */
	private readonly messageClient: COTMessageClient;

	/**
	 * OpenAI API token.
	 * @private
	 */
	private openaiToken?: string;

	/**
	 * Initializes the COTOpenAIClient with an Axios instance.
	 * @param axiosInstance - Preconfigured Axios instance.
	 */
	public constructor(axiosInstance: AxiosInstance) {
		this.messageClient = new COTMessageClient(axiosInstance);
	}

	/**
	 * Sets the OpenAI API token.
	 * @param token - The OpenAI API key.
	 */
	public setToken(token: string) {
		this.openaiToken = token;
	}

	/**
	 * Generates a summary from messages in a Cotalker channel using OpenAI's Chat API.
	 * @param params - Parameters including channel ID, date, model, and system prompt.
	 * @returns A summary string or `undefined` if no valid messages exist.
	 * @throws Will throw an error if the OpenAI token is not set.
	 * @remarks
	 * Only plain text messages are included in the summary.
	 * The system prompt guides how the summary is structured.
	 */
	async generateSummary({
		channelId,
		date = subYears(new Date(), 1),
		limit_char = 100000,
		model = "gpt-3.5-turbo",
		systemPrompt = "Resume los siguientes mensajes de canal interno. Agrupa las ideas principales y expresa cada una como un bullet. Si hay ideas repetidas, fusiónalas. Ignora mensajes irrelevantes como saludos, links o imágenes. Destaca acciones importantes, decisiones tomadas o recomendaciones técnicas.:"
	}: Omit<SummaryParams, "openaiToken">): Promise<string | undefined> {
		if (!this.openaiToken) {
			throw new Error(
				"Debes setear un token de OpenAI con setToken() antes de llamar a generateSummary()."
			);
		}
		try {
			const messages = await this.messageClient.getMessages(
				channelId,
				date
			);
			const fullText = messages
				.filter((msg) => msg.contentType === "text/plain")
				.map((msg) => msg.content)
				.join("\n");

			if (!fullText.trim()) return undefined;
			const LimitText = fullText.slice(-limit_char);

			const openai = new OpenAI({ apiKey: this.openaiToken });

			const summaryResponse = await openai.chat.completions.create({
				model,
				messages: [
					{
						role: "system",
						content: systemPrompt
					},
					{
						role: "user",
						content: LimitText
					}
				]
			});

			const resumen = summaryResponse.choices[0]?.message?.content;
			return resumen?.trim() || undefined;
		} catch (error) {
			console.error(
				"Error generating summary:",
				error instanceof Error ? error.message : String(error)
			);
			return undefined;
		}
	}
}
