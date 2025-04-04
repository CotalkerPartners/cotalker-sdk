import { COTFile, COTFileUploaded } from "@customTypes/COTTypes/COTFile";
import { ObjectId } from "@customTypes/custom";
import HttpClient from "@utils/HttpClient";
import axios, { AxiosRequestConfig } from "axios";
import * as FormData from "form-data";

export default class COTFilesAPI extends HttpClient {
	private _cotalkerToken: string;

	private static _resolveBaseURL(baseURL?: string) {
		if (process.env.SVC_MEDIA_PROCESSING_SERVICE_HOST) {
			console.info("COTFilesAPI - USING INTERNAL URLs");
			return `http://${process.env.SVC_MEDIA_PROCESSING_SERVICE_HOST}:${process.env.SVC_MEDIA_PROCESSING_SERVICE_PORT}/api`;
		}
		if (baseURL) return baseURL;
		if (process.env.FILES_BASE_URL) return process.env.FILES_BASE_URL;
		if (process.env.BASE_URL) {
			return `${process.env.BASE_URL}/api/v3/scheduler`;
		}
		console.info("COTFiles URL not provided, using staging");
		return "https://staging.cotalker.com/api/v3/media";
	}

	public constructor(token: string, baseURL?: string) {
		const resolveBaseURL = COTFilesAPI._resolveBaseURL(baseURL);
		super(resolveBaseURL, true);
		console.info(`COTFilesAPI - BASE URL: ${resolveBaseURL}`);
		this._cotalkerToken = token.replace(/^Bearer /g, "");
		this._initializeRequestInterceptor();
	}

	private _initializeRequestInterceptor = () => {
		this.instance.interceptors.request.use(
			this._handleRequest as any,
			this._handleError
		);
	};

	private _handleRequest = async (config: AxiosRequestConfig) => {
		if (!(config as any).metadata) {
			(config as any).metadata = { requestStartTime: Date.now() };
		}
		if (!config.headers) return;
		config.headers.Authorization = `Bearer ${this._cotalkerToken}`;
		if (!config.headers["Content-Type"]) {
			config.headers["Content-Type"] = "application/json";
		}
		config.headers.admin = "true";
		return config;
	};

	public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
		return this.instance.get(`/file/${fileId}`);
	}

	public async getChannelFiles(
		channelId: ObjectId,
		contentType: "image" | "document" | "video"
	): Promise<COTFile[]> {
		const url = `/file?channel=${channelId}&contentType=${contentType}`;
		return (await this.instance.get(url)).data;
	}

	public async uploadFile(data: Buffer, filename: string): Promise<COTFile> {
		const body = new FormData();
		body.append("file", data, filename);
		body.append("uploadInput", '{ "public": true }');
		const result = await this.instance.post("/file/upload", body, {
			headers: body.getHeaders()
		});
		console.info(`UPLOAD`);
		return result;
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
