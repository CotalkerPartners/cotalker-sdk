import { COTBot } from "@customTypes/COTTypes/COTBot";
import { AxiosInstance } from "axios";

/**
 * Client for managing Cotalker bots through the API.
 */
export class COTBotClient {
	/** Axios instance used to perform HTTP requests. */
	protected readonly AxiosInstance: AxiosInstance;

	/**
	 * Creates a new instance of the bot client.
	 * @param instance - A preconfigured Axios instance for making HTTP requests.
	 */
	constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
	}

	/**
	 * Executes a bot by its ID.
	 *
	 * Sends a POST request to trigger the specified bot. An optional body can be
	 * provided with execution parameters.
	 *
	 * @param botId - The unique identifier of the bot to run.
	 * @param body - Optional request payload to be sent when running the bot.
	 * @returns A promise that resolves to the executed {@link COTBot} result.
	 */
	public async runBotById(
		botId: string,
		body: Record<string, unknown> = {}
	): Promise<COTBot> {
		const endpoint = `/api/v1/bots/run/${botId}`;
		const response = await this.AxiosInstance.post(endpoint, body);
		return response;
	}
}

export default COTBotClient;
