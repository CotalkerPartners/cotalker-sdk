import { COTAnswer } from "@customTypes/COTTypes/COTAnswer";
import {
	COTChannel,
	COTChannelPostBody
} from "@customTypes/COTTypes/COTChannel";
import { COTFile } from "@customTypes/COTTypes/COTFile";
import COTFilesAPI from "@customTypes/COTTypes/COTFilesAPI";
import { ObjectId } from "@customTypes/custom";
import HttpClient from "@utils/HttpClient";
import { AxiosInstance } from "axios";
import * as querystring from "querystring";

export class COTChannelAPI extends HttpClient {
	private readonly _filesAPI: COTFilesAPI;

	protected _axiosinstance: AxiosInstance;

	private queryHandler;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(baseURL: string) {
		super(baseURL);
	}

	async createChannel<T extends COTChannel>(
		body: COTChannelPostBody
	): Promise<T> {
		return (await this.instance.post<{ data: T }>("/api/v2/channels", body))
			.data;
	}

	async getChannelAnswers(
		surveyId: ObjectId,
		channelId: ObjectId
	): Promise<COTAnswer[]> {
		const data = {
			query: {
				channel: channelId
			},
			queryType: "find"
		};
		const url = `/api/answers/find/${surveyId}`;
		return (await this.instance.post(url, data)).data;
	}
	//hay una función en COTChannelClient que ocupa otro constuctor y tambien ocupa queryValidator.

	async getChannelsByGroup(group: ObjectId): Promise<COTChannel[]> {
		let count = true;
		let page = 1;
		let channels = [];
		let totalCount = 0;
		do {
			const query = { group, count, page, limit: 1000 };
			const response = (
				await this.instance.get(
					`/api/v2/channels?${querystring.encode(query)}`
				)
			).data;
			if (!response) break;
			channels = channels.concat(response.channels ?? []);
			if (!totalCount && response.count) {
				totalCount = response.count;
				count = false;
			}
			page++;
		} while (channels.length < totalCount);
		return channels;
	}

	async getChannelFiles(
		channelId: ObjectId,
		contentType: "image" | "video" | "document"
	): Promise<COTFile[]> {
		return this._filesAPI.getChannelFiles(channelId, contentType);
	}
}
