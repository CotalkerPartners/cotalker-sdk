import { AxiosRequestConfig } from "axios";
import HttpClient from "./HttpClient";

export default class SchedulerAPI extends HttpClient {
	private _cotalkerToken: string;
	private static _resolveBaseURL(baseURL?: string) {
		if (process.env.SVC_SCHEDULER_API_SERVICE_HOST) {
			console.info("SchedulerAPI - USING INTERNAL URLs");
			return `http://${process.env.SVC_SCHEDULER_API_SERVICE_HOST}:${process.env.SVC_SCHEDULER_API_SERVICE_PORT}/api`;
		}
		if (process.env.SCHEDULER_BASE_URL) return process.env.SCHEDULER_BASE_URL;
		if (baseURL) return baseURL;
		console.info(`Scheduler URL not provided, using staging`);
		return "https://staging.cotalker.com/api/v3/scheduler";
	}
	public constructor(token: string, baseURL?: string) {
		const resolveBaseURL = SchedulerAPI._resolveBaseURL(baseURL);
		super(resolveBaseURL, false);
		console.info(`Scheduler API BASE URL : ${resolveBaseURL}`);
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
		if (!config.headers) return;
		config.headers["Authorization"] = `Bearer ${this._cotalkerToken}`;
		if (!config.headers["Content-Type"])
			config.headers["Content-Type"] = "application/json";
		config.headers["admin"] = "true";
		return config;
	};
	public async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
		return await this.instance.post("/schedule", body);
	}
	public async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
		const time = new Date();
		return await this.postSchedule({ ...body, time });
	}
}
