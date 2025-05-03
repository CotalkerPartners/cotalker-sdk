import { EditMsgBody, SendMsgBody } from "@customTypes/COTTypes/COTMessage";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import { addDays } from "date-fns";

/**
 * Client to handle operations related to Cotalker messages.
 */
export default class COTMessageClient {
	/**
	 * Axios instance used for HTTP requests.
	 * @protected
	 */
	protected readonly axiosInstance: AxiosInstance;

	/**
	 * Creates a new instance of the message client.
	 * @param instance An Axios instance to perform HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	/**
	 * Sends a new message.
	 * @typeParam T - Expected response data type.
	 * @param body The body of the message to send.
	 * @returns A promise resolving to the response data.
	 */
	async sendMessage<T>(body: SendMsgBody): Promise<T> {
		return (
			await this.axiosInstance.post<{ data: T }>("/api/v1/messages", body)
		).data;
	}

	/**
	 * Edits an existing message.
	 * @typeParam T - Expected response data type.
	 * @param _messageId - The ID of the message to edit.
	 * @param body - The new content for the message.
	 * @returns A promise that resolves to the updated message.
	 */
	async editMessage<T>(_messageId: ObjectId, body: EditMsgBody): Promise<T> {
		return (
			await this.axiosInstance.patch<{ data: T }>(
				`/api/v1/messages/${_messageId}`,
				body
			)
		).data;
	}

	/**
	 * Removes a message by marking it as removed.
	 * @typeParam T - Expected response data type.
	 * @param _messageId - The ID of the message to remove.
	 * @returns A promise that resolves to the removed message object.
	 */
	async removeMessage<T>(_messageId: ObjectId): Promise<T> {
		return (
			await this.axiosInstance.patch<{ data: T }>(
				`/api/v1/messages/${_messageId}/remove`
			)
		).data;
	}

	/**
	 * Retrieves messages from a given channel.
	 * @param channel - The ID of the channel to fetch messages from.
	 * @param modifiedAt - Optional date to filter messages modified since that date. Defaults to one day ago.
	 * @returns A promise resolving to an array of messages.
	 * @remarks
	 * The method fetches messages modified after the provided `modifiedAt` date.
	 */
	public async getMessages(
		channel: ObjectId,
		modifiedAt?: Date
	): Promise<SendMsgBody[]> {
		const dateStr = (modifiedAt ?? addDays(new Date(), -1)).toISOString();
		const url = `/api/v1/messages/channel/${channel}/modified/${dateStr}`;
		return this.axiosInstance.get(url);
	}
}
