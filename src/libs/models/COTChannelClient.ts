import { COTAnswer } from "@customTypes/COTTypes/COTAnswer";
import {
	ChannelsQueryParams,
	channelsQueryParams,
	COTChannel,
	COTChannelPostBody
} from "@customTypes/COTTypes/COTChannel";
import { COTFile } from "@customTypes/COTTypes/COTFile";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";
import * as querystring from "querystring";

export default class COTChannelClient {
	protected axiosInstance: AxiosInstance;

	private queryHandler;

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("channels", this.axiosInstance);
	}

	public async getChannelsQuery(
		query: ChannelsQueryParams
	): Promise<COTChannel[]> {
		queryValidator(channelsQueryParams, query);
		return (await this.queryHandler.getQuery(query)).channels;
	}

	async createChannel<T extends COTChannel>(
		body: COTChannelPostBody
	): Promise<T> {
		return (
			await this.axiosInstance.post<{ data: T }>("/api/v2/channels", body)
		).data;
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
		return (await this.axiosInstance.post(url, data)).data;
	}

	async getChannelsByGroup(group: ObjectId): Promise<COTChannel[]> {
		let count = true;
		let page = 1;
		let channels = [];
		let totalCount = 0;
		do {
			const query = { group, count, page, limit: 1000 };
			const response = (
				await this.axiosInstance.get(
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
		const response = await this.axiosInstance.get<{ data: COTFile[] }>(
			`/api/v2/channels/${channelId}/files?type=${contentType}`
		);
		return response.data;
	}
}
