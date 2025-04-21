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

	public constructor(axiosInstance: AxiosInstance) {
		this.messageClient = new COTMessageClient(axiosInstance);
	}

	async generateSummary({
		channelId,
		openaiToken,
		model = "gpt-3.5-turbo",
		systemPrompt = "Eres un asistente que resume conversaciones largas. Resume brevemente lo siguiente:"
	}: SummaryParams): Promise<void> {
		if (!channelId || !openaiToken) {
			throw new Error(
				"Missing required parameters: channelId and openaiToken are required"
			);
		}

		try {
			const messages = await this.messageClient.getMessages(channelId);
			const fullText = messages
				.filter((msg: MessageWithText) => msg.body?.text)
				.map((msg: MessageWithText) => msg.body.text)
				.join("\n");

			if (!fullText || fullText.trim() === "") {
				await this.messageClient.sendMessage({
					channel: channelId,
					content: "No hay mensajes de texto para resumir.",
					contentType: "text/plain"
				});
				return;
			}
			const openai = new OpenAI({ apiKey: openaiToken });

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
			const resumen =
				summaryResponse.choices[0]?.message?.content ??
				"No se generó resumen.";
			await this.messageClient.sendMessage({
				channel: channelId,
				content: `**Resumen del canal:**\n${resumen}`,
				contentType: "text/plain"
			});
		} catch (error) {
			console.error(
				"Error generating summary:",
				error instanceof Error ? error.message : String(error)
			);

			let errorMessage = "Error al generar el resumen del canal.";
			if (error instanceof OpenAI.APIError) {
				errorMessage += ` (${error.status}: ${error.message})`;
			}

			await this.messageClient.sendMessage({
				channel: channelId,
				content: errorMessage,
				contentType: "text/plain"
			});
			throw error;
		}
	}
}
