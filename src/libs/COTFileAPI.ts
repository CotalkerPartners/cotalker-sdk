import { COTFile, COTFileUploaded } from "@customTypes/COTTypes/COTFile";
import COTFilesAPI from "@customTypes/COTTypes/COTFilesAPI";
import { ObjectId } from "@customTypes/custom";
import HttpClient from "@utils/HttpClient";

export class COTFileAPI extends HttpClient {
	private readonly _filesAPI: COTFilesAPI;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(baseURL: string) {
		super(baseURL);
		this._filesAPI = new COTFilesAPI(baseURL);
	}

	public async getFileById(fileId: ObjectId): Promise<COTFileUploaded> {
		return this._filesAPI.getFileObjectById(fileId);
	}

	public async uploadFile(
		dataOrPayload: Buffer,
		filename: string
	): Promise<COTFile> {
		return this._filesAPI.uploadFile(dataOrPayload, filename);
	}

	public async downloadFile(fileId: string): Promise<Buffer | null> {
		return this._filesAPI.downloadFileByFileId(fileId);
	}
}
