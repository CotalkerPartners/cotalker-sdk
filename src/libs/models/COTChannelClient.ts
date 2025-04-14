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

/**
 * Handling channel-related operations.
 * Uses Axios to make HTTP requests to the backend.
 */
export default class COTChannelClient {
	protected axiosInstance: AxiosInstance;

	private queryHandler;

	/**
	 * Creates a new instance of the channel client.
	 * @param instance Axios instance to make HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("channels", this.axiosInstance);
	}

	/**
	 * Gets a list of channels based on the query parameters.
	 * @param query Parameters to filter channels.
	 * @returns List of channels.
	 */
	public async getChannelsQuery(
		query: ChannelsQueryParams
	): Promise<COTChannel[]> {
		queryValidator(channelsQueryParams, query);
		return (await this.queryHandler.getQuery(query)).channels;
	}

	/**
	 * Creates a new channel in the system.
	 * @param body with the details of the channel to be created.
	 * @returns The created channel.
	 */
	async createChannel<T extends COTChannel>(
		body: COTChannelPostBody
	): Promise<T> {
		return (
			await this.axiosInstance.post<{ data: T }>("/api/v2/channels", body)
		).data;
	}

	/**
	 * Gets the responses associated with a channel within a survey.
	 * @param surveyId Survey ID.
	 * @param channelId Channel ID.
	 * @returns List of responses.
	 */
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

	/**
	 * Gets all channels belonging to a specific group, using pagination.
	 * @param group group ID.
	 * @returns A list of channels in the group.
	 */
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

	/**
	 * Gets files associated with a channel based on its content type.
	 * @param channelId Channel ID.
	 * @param contentType Content type (image, video, or document).
	 * @returns List of files in the channel.
	 */
	async getChannelFiles(
		channelId: ObjectId,
		contentType: "image" | "video" | "document"
	): Promise<COTFile[]> {
		const response = await this.axiosInstance.get<{ data: COTFile[] }>(
			`/api/v2/channels/${channelId}/files?type=${contentType}`
		);
		return response.data;
	}

	async getChannelById(channelId: ObjectId): Promise<COTChannel> {
		return (await this.axiosInstance.get(`/api/v2/channels/${channelId}`))
			.data;
	}

	//revisar tipado
}
