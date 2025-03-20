import { URLSearchParams } from "url";
import * as querystring from "querystring";
import { AxiosRequestConfig } from "axios";
import HttpClient from "./HttpClient";
import SchedulerAPI from "./SchedulerAPI";
import COTFilesAPI from "./COTFilesAPI";

declare type SMStateChange = {
	task: string
	currentState: string
	createdAt: Date
}
type COTFileContentType = 'image' | 'audio' | 'video' | 'document'
type COTFileStatus = 'pending' | 'processing' | 'uploaded' | 'deleted' | 'error'
declare interface COTFile {
	[x: string]: any
	contentType: COTFileContentType
	company?: string
	status: COTFileStatus
	user?: string
	createdAt: string
	modifiedAt: string
	public: boolean
	url?: string
	extension?: string
	mimeType?: string
	fileName?: string
	size?: number
}

type isActiveOptions = "true" | "false" | "all";

export type JSONPatchBody = {
	op: "add" | "remove" | "replace" | "move" | "copy" | "test";
	path: `/${string}`;
	value?: unknown;
}[];

type searchPropertyQueryOptions = {
	parent?: string | string[];
};

type SendMsgBody = {
	channel: string;
	content: string;
	contentType: "text/system" | "text/plain";
	isSaved: 2;
	sentBy: string;
};

export class CotalkerAPI extends HttpClient {
	private _cotalkerToken: string;
	private _schedulerAPI: SchedulerAPI;
	private _filesAPI: COTFilesAPI;
	private static _resolveBaseURL(baseURL?: string) {
		if (process.env.CORE_SERVICE_HOST) {
			console.info("CotalkerAPI - USNG INTERNAL URLs");
			return `http://${process.env.CORE_SERVICE_HOST}:${process.env.CORE_SERVICE_PORT}`;
		}
		if (baseURL) return baseURL;
		if (process.env.BASE_URL) return process.env.BASE_URL;
		if (process.env.BASE_URL) return process.env.BASE_URL;
		console.info("CotalkerAPI: BASE URL NOT PROVIDED, USING STAGING");
		return "https://staging.cotalker.com";
	}
	public constructor(token?: string, baseURL?: string) {
		const resolveBaseURL = CotalkerAPI._resolveBaseURL(baseURL);
		console.info(`CotalkerAPI: BaseURL using ${resolveBaseURL}`);
		super(resolveBaseURL, false);
		this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? "").replace(
			/^Bearer /g,
			""
		);
		this._schedulerAPI = new SchedulerAPI(this._cotalkerToken);
		this._filesAPI = new COTFilesAPI(this._cotalkerToken);
		this._initializeRequestInterceptor();
	}

	private _initializeRequestInterceptor = () => {
		this.instance.interceptors.request.use(
			this._handleRequest as any,
			this._handleError
		);
	};
	private _handleRequest = async (config: AxiosRequestConfig) => {
		if (!config.headers) return;
		config.headers["Authorization"] = `Bearer ${this._cotalkerToken}`;
		if (!config.headers["Content-Type"])
			config.headers["Content-Type"] = "application/json";
		config.headers["admin"] = "true";
		return config;
	};
	/* COTTask */

	public async getTasksSMStateChanges(
		taskId: string,
		taskGroupId: string
	): Promise<any> {
		return (
			(
				await this.instance.get(
					`/api/v2/task-groups/${taskGroupId}/tasks/${taskId}/sm-state-changes`
				)
			)?.data?.values ?? []
		);
	}

	public async getStateChanges(
		taskId: string,
		taskGroupId: string
	): Promise<SMStateChange[]> {
		return (
			await this.instance.get(
				`/api/v2/task-groups/${taskGroupId}/tasks/${taskId}/sm-state-changes`
			)
		).data?.values;
	}

	/* files */
	public async uploadFile(data: Buffer, filename: string): Promise<COTFile> {
		return await this._filesAPI.uploadFile(data, filename);
	}
	public async downloadFile(fileId: string): Promise<Buffer | null> {
		return await this._filesAPI.downloadFileByFileId(fileId);
	}
}

export const cotalkerAPI = new CotalkerAPI();
