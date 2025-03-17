import { cotalkerAPI } from "./CotalkerAPI";

export default abstract class SchedulePost {
	body: ScheduleBody;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(body: ScheduleBody) {
		this.body = body;
	}

	public async run(): Promise<SchedulePostResponse | void> {
		try {
			await this._prepare();
			const result: SchedulePostResponse = await cotalkerAPI.runSchedule(
				this.body
			);
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	public async post(datetime?: Date): Promise<SchedulePostResponse | void> {
		try {
			await this._prepare();
			const result: SchedulePostResponse = await cotalkerAPI.postSchedule({
				...this.body,
				time: datetime ?? new Date()
			});
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	protected async _prepare(): Promise<void> {
		return;
	}
}
