import { COTFileUploaded } from "@customTypes/COTTypes/COTFile";
import { ObjectId } from "@customTypes/custom";
import axios, { AxiosInstance } from "axios";

export default class COTFileClient {
	protected readonly axiosInstance: AxiosInstance;

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
		const file = await this.axiosInstance.get(
			`/api/v3/media/file/${fileId}`
		);
		return file;
	}

	public async uploadFile(payload: any): Promise<any> {
		return this.axiosInstance.post(`/api/v3/media/file/upload`, payload, {
			headers: {
				...payload.getHeaders(),
				Authorization: `Bearer ${process.env.COTALKER_TOKEN}`
			}
		});
	}

	public async downloadFileByFileId(fileId: ObjectId): Promise<Buffer> {
		const cotfile = await this.getFileObjectById(fileId);
		if (cotfile.status === "uploaded") {
			const downloaded = (
				await axios.get(cotfile.url, { responseType: "arraybuffer" })
			).data;
			return downloaded;
		}
		return null;
	}
}
