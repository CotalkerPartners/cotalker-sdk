import COTSchedulerClient from "../../src/libs/models/COTSchedulerClient";
import { AxiosInstance } from "axios";
import { ScheduleBody } from "../../src/customTypes/COTTypes/scheduler";

const mockAxios: Partial<AxiosInstance> = {
	get: jest.fn(),
	post: jest.fn(),
	patch: jest.fn()
};

describe("COTSchedulerClient API", () => {
	let client: COTSchedulerClient;
	const scheduleId = "123456789012345678901234";
	const fullSchedule: ScheduleBody = {
		code: "test-code",
		owner: "user123",
		execPath: "exec/path"
	};

	beforeEach(() => {
		jest.clearAllMocks();
		client = new COTSchedulerClient(mockAxios as AxiosInstance);
	});

	it("postSchedule", async () => {
		const response = { code: "created" };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.postSchedule(fullSchedule);
		expect(result).toEqual(response);
	});

	it("runSchedule", async () => {
		const response = { code: "executed" };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.runSchedule(fullSchedule);
		expect(result).toEqual(response);
	});

	it("getScheduleById", async () => {
		const response = { _id: scheduleId };
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.getScheduleById(scheduleId);
		expect(result._id).toBe(scheduleId);
	});

	it("getSchedules", async () => {
		const response = [{ code: "a" }, { code: "b" }];
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.getSchedules();
		expect(result.length).toBe(2);
	});

	it("getScheduleByCode", async () => {
		const response = { code: "by-code" };
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.getScheduleByCode("by-code");
		expect(result.code).toBe("by-code");
	});

	it("createSchedule", async () => {
		const response = { code: "new" };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.createSchedule(fullSchedule);
		expect(result).toEqual(response);
	});

	it("restartSchedule", async () => {
		const response = { restarted: true };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.restartSchedule(scheduleId);
		expect(result.restarted).toBe(true);
	});

	it("updateScheduleByCode", async () => {
		const response = { updated: true };
		const updateBody = { _code: "test-code", priority: "high" };
		(mockAxios.patch as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.updateScheduleByCode(updateBody);
		expect(result.updated).toBe(true);
	});

	it("updateScheduleById", async () => {
		const response = { updated: true };
		const updateBody = { execPath: "new/path" };
		(mockAxios.patch as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.updateScheduleById(scheduleId, updateBody);
		expect(result.updated).toBe(true);
	});

	it("deactivateSchedule", async () => {
		const response = { status: "deactivated" };
		(mockAxios.patch as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.deactivateSchedule(scheduleId);
		expect(result.status).toBe("deactivated");
	});

	it("activateSchedule", async () => {
		const response = { status: "activated" };
		(mockAxios.patch as jest.Mock).mockResolvedValue({ data: response });

		const result = await client.activateSchedule(scheduleId);
		expect(result.status).toBe("activated");
	});
});
