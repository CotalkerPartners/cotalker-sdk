import { COTFileUploaded } from "@customTypes/COTTypes/COTFile";
import { ObjectId } from "@customTypes/custom";
import axios, { AxiosInstance } from "axios";

/**
 * Manage file-related operations.
 */
export default class COTFileClient {
	/**
	 * Axios instance used to make HTTP requests.
	 * @protected
	 */
	protected readonly axiosInstance: AxiosInstance;

	/**
	 * Creates a new instance of the file client.
	 * @param instance - An Axios instance configured with base URL and auth headers.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	/**
	 * Retrieves a file object from the backend by its ID.
	 * @param fileId - The ID of the file to retrieve.
	 * @returns A promise that resolves to the file object metadata.
	 */
	public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
		const file = await this.axiosInstance.get(
			`/api/v3/media/file/${fileId}`
		);
		return file;
	}

	/**
	 * Uploads a file to the backend.
	 * @param payload - The file payload, typically a FormData object.
	 * @returns A promise resolving to the upload response.
	 */
	public async uploadFile(payload: any): Promise<any> {
		return this.axiosInstance.post(`/api/v3/media/file/upload`, payload, {
			headers: {
				...payload.getHeaders()
			}
		});
	}

	/**
	 * Downloads the binary content of a file using its ID.
	 * @param fileId - The ID of the file to download.
	 * @returns A promise that resolves to the file content as a buffer, or null if the file is not uploaded.
	 */
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
