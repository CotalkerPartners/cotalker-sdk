import {
	ScheduleBody,
	SchedulePostResponse
} from "@customTypes/COTTypes/scheduler";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";

export default class COTSchedulerClient {
	protected readonly _instance: AxiosInstance;

	constructor(instance: AxiosInstance) {
		this._instance = instance;
	}

	public async postSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this._instance.post(
			"/api/uservices/scheduler",
			body
		);
		return data;
	}

	public async runSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this._instance.post(
			"/api/uservices/scheduler/run",
			body
		);
		return data;
	}

	public async getScheduleById(scheduleId: ObjectId) {
		const { data } = await this._instance.get(
			`/api/v3/scheduler/schedule/${scheduleId}`
		);
		return data;
	}

	public async getSchedules() {
		const { data } = await this._instance.get("/api/v3/scheduler/schedule");
		return data;
	}

	public async runByCode(code: string) {
		const { data } = await this._instance.post(
			`/api/v3/schedules/run/${code}`
		);
		return data;
	}

	public async getDetailsByCode(code: string) {
		const { data } = await this._instance.get(
			`/api/v3/schedules/details/${code}`
		);
		return data;
	}

	public async getScheduleHistory() {
		const { data } = await this._instance.get("/api/v3/schedules/history");
		return data;
	}

	public async getSchedulePriority(code: string) {
		const { data } = await this._instance.get(
			`/api/v3/schedules/priority/${code}`
		);
		return data;
	}

	public async getMaxIterations(code: string) {
		const { data } = await this._instance.get(
			`/api/v3/schedules/max-iterations/${code}`
		);
		return data;
	}

	public async getScheduleConfig(code: string) {
		const { data } = await this._instance.get(
			`/api/v3/schedules/config/${code}`
		);
		return data;
	}

	public async getScheduleLogs(scheduleIds: ObjectId[], limit = 100) {
		const query = scheduleIds.join(",");
		const url = `/log?schedule=${query}&limit=${limit}`;
		const { data } = await this._instance.get(url);
		return data;
	}
}
