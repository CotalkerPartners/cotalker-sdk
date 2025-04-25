import { ObjectId } from "@customTypes/custom";
import COTMessageClient from "@models/COTMessageClient";
import { AxiosInstance } from "axios";
import OpenAI from "openai";

type SummaryParams = {
	channelId: ObjectId;
	openaiToken: string;
	model?: string;
	systemPrompt?: string;
};

type MessageWithText = {
	body: {
		text: string;
	};
};

export default class COTOpenAIClient {
	private readonly messageClient: COTMessageClient;

	private openaiToken?: string;

	public constructor(axiosInstance: AxiosInstance) {
		this.messageClient = new COTMessageClient(axiosInstance);
	}

	public setToken(token: string) {
		this.openaiToken = token;
	}

	async generateSummary({
		channelId,
		model = "gpt-3.5-turbo",
		systemPrompt = "Eres un asistente que resume conversaciones largas. Resume brevemente lo siguiente:"
	}: Omit<SummaryParams, "openaiToken">): Promise<string | undefined> {
		if (!this.openaiToken) {
			throw new Error(
				"Debes setear un token de OpenAI con setToken() antes de llamar a generateSummary()."
			);
		}
		try {
			const messages = await this.messageClient.getMessages(channelId);
			const fullText = messages
				.filter((msg: MessageWithText) => msg.body?.text)
				.map((msg: MessageWithText) => msg.body.text)
				.join("\n");

			if (!fullText.trim()) return undefined;

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
						content: fullText
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
