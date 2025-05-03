import { COTAnswer } from "@customTypes/COTTypes/COTAnswer";
import {
	ChannelsQueryParams,
	COTChannel,
	COTChannelPostBody
} from "@customTypes/COTTypes/COTChannel";
import { COTFile } from "@customTypes/COTTypes/COTFile";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";
import * as querystring from "querystring";

/**
 * Client for handling channel-related operations in Cotalker.
 */
export default class COTChannelClient {
	protected axiosInstance: AxiosInstance;

	/**
	 * Creates a new instance of the channel client.
	 * @param instance - Axios instance used to perform HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	/**
	 * Retrieves channels based on optional query parameters.
	 * @param query - An object containing search filters (optional).
	 * @returns A promise that resolves to a {@link COTChannel} object.
	 */
	async getChannelsByQuery(
		query: ChannelsQueryParams = {}
	): Promise<COTChannel> {
		const queryString = querystring.encode(query);
		return (await this.axiosInstance.get(`/api/v2/channels?${queryString}`))
			.data;
	}

	/**
	 * Creates a new channel in the system.
	 * @param body - The channel creation payload.
	 * @returns A promise that resolves to the newly created channel.
	 */
	async createChannel<T extends COTChannel>(
		body: COTChannelPostBody
	): Promise<T> {
		return (
			await this.axiosInstance.post<{ data: T }>("/api/v2/channels", body)
		).data;
	}

	/**
	 * Retrieves answers associated with a channel within a given survey.
	 * @param surveyId - The ID of the survey.
	 * @param channelId - The ID of the channel.
	 * @returns A promise that resolves to a list of {@link COTAnswer} objects.
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
	 * Retrieves all channels that belong to a specific group using pagination.
	 * @param group - The group ID.
	 * @returns A promise that resolves to a list of {@link COTChannel} objects.
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
	 * Retrieves files from a channel based on content type.
	 * @param channelId - The ID of the channel.
	 * @param contentType - The type of content to filter (image, video, or document).
	 * @returns A promise that resolves to a list of {@link COTFile} objects.
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

	/**
	 * Retrieves a single channel by its ID.
	 * @param channelId - The ID of the channel to retrieve.
	 * @returns A promise that resolves to the {@link COTChannel} object.
	 */
	async getChannelById(channelId: ObjectId): Promise<COTChannel> {
		return (await this.axiosInstance.get(`/api/v2/channels/${channelId}`))
			.data;
	}
}
