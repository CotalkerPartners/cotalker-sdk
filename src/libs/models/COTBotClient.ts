import { AxiosInstance } from "axios";

export class COTBotClient {
	protected readonly _instance: AxiosInstance;

	constructor(instance: AxiosInstance) {
		this._instance = instance;
	}

	public async runBotById(
		botId: string,
		body: Record<string, unknown> = {}
	): Promise<any> {
		const endpoint = `/api/v1/bots/run/${botId}`;
		const { data } = await this._instance.post(endpoint, body);
		return data;
	}
}

export default COTBotClient;
