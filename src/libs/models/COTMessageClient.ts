import { EditMsgBody, SendMsgBody } from "@customTypes/COTTypes/COTMessage";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import { addDays } from "date-fns";

export default class COTMessageClient {
	protected readonly axiosInstance: AxiosInstance;

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	async sendMessage<T>(body: SendMsgBody): Promise<T> {
		return (
			await this.axiosInstance.post<{ data: T }>("/api/v1/messages", body)
		).data;
	}

	async editMessage<T>(_messageId: ObjectId, body: EditMsgBody): Promise<T> {
		return (
			await this.axiosInstance.patch<{ data: T }>(
				`/api/v1/messages/${_messageId}`,
				body
			)
		).data;
	}

	async removeMessage<T>(_messageId: ObjectId): Promise<T> {
		return (
			await this.axiosInstance.patch<{ data: T }>(
				`/api/v1/messages/${_messageId}/remove`
			)
		).data;
	}

	public async getMessages(channel: ObjectId, modifiedAt?: Date) {
		const dateStr = (modifiedAt ?? addDays(new Date(), -1)).toISOString();
		const url = `/api/v1/messages/channel/${channel}/modified/${dateStr}`;
		return this.axiosInstance.get(url);
	}
}
