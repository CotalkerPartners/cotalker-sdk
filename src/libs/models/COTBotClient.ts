import { COTBot } from "@customTypes/COTTypes/COTBot";
import { AxiosInstance } from "axios";

export class COTBotClient {
	protected readonly _instance: AxiosInstance;

	constructor(instance: AxiosInstance) {
		this._instance = instance;
	}

	public async runBotById(
		botId: string,
		body: Record<string, unknown> = {}
	): Promise<COTBot> {
		const endpoint = `/api/v1/bots/run/${botId}`;
		const response = await this._instance.post(endpoint, body);
		return response;
	}
}

export default COTBotClient;
