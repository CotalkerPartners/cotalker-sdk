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

	// GET /api/v3/schedule/code/:code
	public async getScheduleByCode(code: string) {
		const { data } = await this._instance.get(
			`/api/v3/schedule/code/${code}`
		);
		return data;
	}

	// POST /api/v3/schedule/
	public async createSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this._instance.post("/api/v3/schedule/", body);
		return data;
	}

	// POST /api/v3/schedule/:scheduleId (restart a running cron)
	public async restartSchedule(scheduleId: ObjectId) {
		const { data } = await this._instance.post(
			`/api/v3/schedule/${scheduleId}`
		);
		return data;
	}

	// PATCH /api/v3/schedule/ (update by code)
	public async updateScheduleByCode(body: {
		_code: string;
		time?: Date;
		timeoutMinutes?: number;
		body?: any;
		endDate?: Date;
		cron?: string;
		priority?: string;
		cronTimeZone?: string;
		isSystem?: boolean;
		keepStatus?: boolean;
		execPath?: string;
		hooks?: any[];
		tags?: any[];
		exponentialBackoff?: any;
	}) {
		const { data } = await this._instance.patch("/api/v3/schedule/", body);
		return data;
	}

	// PATCH /api/v3/schedule/:scheduleId (update by ID)
	public async updateScheduleById(
		scheduleId: ObjectId,
		body: Partial<ScheduleBody>
	) {
		const { data } = await this._instance.patch(
			`/api/v3/schedule/${scheduleId}`,
			body
		);
		return data;
	}

	// PATCH /api/v3/schedule/deactivate/:scheduleId
	public async deactivateSchedule(scheduleId: ObjectId) {
		const { data } = await this._instance.patch(
			`/api/v3/schedule/deactivate/${scheduleId}`,
			{}
		);
		return data;
	}

	// PATCH /api/v3/schedule/activate/:scheduleId
	public async activateSchedule(scheduleId: ObjectId) {
		const { data } = await this._instance.patch(
			`/api/v3/schedule/activate/${scheduleId}`,
			{}
		);
		return data;
	}
}
