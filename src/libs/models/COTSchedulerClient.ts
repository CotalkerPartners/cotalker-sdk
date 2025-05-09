import {
	ScheduleBody,
	SchedulePostResponse
} from "@customTypes/COTTypes/scheduler";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";

/**
 * Client for interacting with the Scheduler API.
 */
export default class COTSchedulerClient {
	protected readonly AxiosInstance: AxiosInstance;

	/**
	 * Initializes a new instance of the COTSchedulerClient.
	 * @param instance - The configured Axios instance to use for requests.
	 */
	constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
	}

	/**
	 * Creates a new schedule using the legacy scheduler endpoint.
	 * @param body - The schedule configuration payload.
	 * @returns The created schedule response.
	 */
	public async postSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this.AxiosInstance.post(
			"/api/uservices/scheduler",
			body
		);
		return data;
	}

	/**
	 * Immediately executes a schedule.
	 * @param body - The schedule configuration payload.
	 * @returns The response of the schedule execution.
	 */
	public async runSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this.AxiosInstance.post(
			"/api/uservices/scheduler/run",
			body
		);
		return data;
	}

	/**
	 * Retrieves a schedule by its ID.
	 * @param scheduleId - The ID of the schedule.
	 * @returns The schedule data.
	 */
	public async getScheduleById(scheduleId: ObjectId) {
		const { data } = await this.AxiosInstance.get(
			`/api/v3/scheduler/schedule/${scheduleId}`
		);
		return data;
	}

	/**
	 * Retrieves all schedules.
	 * @returns A list of all schedules.
	 */
	public async getSchedules() {
		const { data } = await this.AxiosInstance.get(
			"/api/v3/scheduler/schedule"
		);
		return data;
	}

	/**
	 * Retrieves a schedule by its code.
	 * @param code - The unique schedule code.
	 * @returns The schedule matching the given code.
	 */
	public async getScheduleByCode(code: string) {
		const { data } = await this.AxiosInstance.get(
			`/api/v3/schedule/code/${code}`
		);
		return data;
	}

	/**
	 * Creates a new schedule using the current scheduler endpoint.
	 * @param body - The schedule configuration payload.
	 * @returns The created schedule response.
	 */
	public async createSchedule(
		body: ScheduleBody
	): Promise<SchedulePostResponse> {
		const { data } = await this.AxiosInstance.post(
			"/api/v3/schedule/",
			body
		);
		return data;
	}

	/**
	 * Restarts an existing schedule (e.g. a running cron job).
	 * @param scheduleId - The ID of the schedule to restart.
	 * @returns The updated schedule data.
	 */
	public async restartSchedule(scheduleId: ObjectId) {
		const { data } = await this.AxiosInstance.post(
			`/api/v3/schedule/${scheduleId}`
		);
		return data;
	}

	/**
	 * Updates a schedule using its code.
	 * @param body - The schedule update payload. Must include `_code`.
	 * @returns The updated schedule data.
	 */
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
		const { data } = await this.AxiosInstance.patch(
			"/api/v3/schedule/",
			body
		);
		return data;
	}

	/**
	 * Updates a schedule using its ID.
	 * @param scheduleId - The ID of the schedule to update.
	 * @param body - The partial update payload.
	 * @returns The updated schedule data.
	 */
	public async updateScheduleById(
		scheduleId: ObjectId,
		body: Partial<ScheduleBody>
	) {
		const { data } = await this.AxiosInstance.patch(
			`/api/v3/schedule/${scheduleId}`,
			body
		);
		return data;
	}

	/**
	 * Deactivates a schedule by its ID.
	 * @param scheduleId - The ID of the schedule to deactivate.
	 * @returns The updated schedule data.
	 */
	public async deactivateSchedule(scheduleId: ObjectId) {
		const { data } = await this.AxiosInstance.patch(
			`/api/v3/schedule/deactivate/${scheduleId}`,
			{}
		);
		return data;
	}

	/**
	 * Activates a schedule by its ID.
	 * @param scheduleId - The ID of the schedule to activate.
	 * @returns The updated schedule data.
	 */
	public async activateSchedule(scheduleId: ObjectId) {
		const { data } = await this.AxiosInstance.patch(
			`/api/v3/schedule/activate/${scheduleId}`,
			{}
		);
		return data;
	}
}
