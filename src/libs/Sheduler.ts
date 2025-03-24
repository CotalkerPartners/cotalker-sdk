import { cotalkerAPI } from "./CotalkerAPI";
import { ScheduleBody, SchedulePostResponse } from "@customTypes/scheduler"; // Asegúrate de tener estas interfaces
import { ObjectId } from "@customTypes/custom";

export const Scheduler = {
	async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
		return await cotalkerAPI.postSchedule(body);
	},

	async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
		return await cotalkerAPI.runSchedule(body);
	},

	async getScheduleById(scheduleId: ObjectId) {
		return await cotalkerAPI.getScheduleById(scheduleId);
	},

	async getSchedules() {
		return await cotalkerAPI.getSchedules();
	},

	async runByCode(code: string) {
		return await cotalkerAPI.runByCode(code);
	},

	async getDetailsByCode(code: string) {
		return await cotalkerAPI.getDetailsByCode(code);
	},

	async getScheduleHistory() {
		return await cotalkerAPI.getScheduleHistory();
	},

	async getSchedulePriority(code: string) {
		return await cotalkerAPI.getSchedulePriority(code);
	},

	async getMaxIterations(code: string) {
		return await cotalkerAPI.getMaxIterations(code);
	},

	async getScheduleConfig(code: string) {
		return await cotalkerAPI.getScheduleConfig(code);
	},

	async getScheduleLegacyById(scheduleId: ObjectId) {
		return await cotalkerAPI.getScheduleLegacyById(scheduleId);
	},

	async getScheduleByCodeLegacy(code: string) {
		return await cotalkerAPI.getScheduleByCodeLegacy(code);
	},

	async runLegacySchedule(body: Record<string, unknown>) {
		return await cotalkerAPI.runLegacySchedule(body);
	},

	async getScheduleLogs(scheduleIds: ObjectId[], limit = 100) {
		return await cotalkerAPI.getScheduleLogs(scheduleIds, limit);
	}
};
