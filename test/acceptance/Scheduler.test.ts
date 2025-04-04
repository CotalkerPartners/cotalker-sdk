import COTSchedulerClient from "../../src/libs/models/COTSchedulerClient";
import { ScheduleBody } from "../../src/customTypes/COTTypes/scheduler";
import { AxiosInstance } from "axios";

// Simulación parcial de Axios
const mockAxios: Partial<AxiosInstance> = {
	get: jest.fn(),
	post: jest.fn(),
	patch: jest.fn()
};

describe("COTSchedulerClient API", () => {
	let schedulerClient: COTSchedulerClient;

	beforeEach(() => {
		jest.clearAllMocks();
		schedulerClient = new COTSchedulerClient(mockAxios as AxiosInstance);
	});

	// Datos base para ScheduleBody
	const fullSchedule: ScheduleBody = {
		code: "test-code",
		owner: "user123",
		execPath: "exec/path"
	};

	it("postSchedule", async () => {
		const mockResponse: any = { code: "new_schedule" };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] postSchedule - input:", fullSchedule);
		const result = await schedulerClient.postSchedule(fullSchedule);
		console.debug("[TEST] postSchedule - result:", result);
		result;
		expect(result.code).toBe("new_schedule");
	});

	it("runSchedule", async () => {
		const mockResponse = {
			code: "test2",
			status: "tick",
			execPath: "./../scripts/parametrizedBots/pb.controller.js"
		};

		(mockAxios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] runSchedule - input:", fullSchedule);
		const result = await schedulerClient.runSchedule(fullSchedule);
		console.debug("[TEST] runSchedule - result:", result);

		expect(result.code).toBe("test2");
		expect(result.status).toBe("tick");
		expect(result.execPath).toBe(mockResponse.execPath);
	});

	it("getScheduleById", async () => {
		const id = "schedule123";
		const mockResponse = { _id: id, name: "Test Schedule" };
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] getScheduleById - input:", id);
		const result = await schedulerClient.getScheduleById(id);
		console.debug("[TEST] getScheduleById - result:", result);

		expect(result._id).toBe(id);
	});

	it("getSchedules", async () => {
		const mockSchedules = [{ code: "s1" }, { code: "s2" }];
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockSchedules });

		console.debug("[TEST] getSchedules - expecting list");
		const result = await schedulerClient.getSchedules();
		console.debug("[TEST] getSchedules - result:", result);

		expect(result.length).toBe(2);
	});

	it("runByCode", async () => {
		const code = "run-code";
		const mockResponse = { executed: true };
		(mockAxios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] runByCode - input:", code);
		const result = await schedulerClient.runByCode(code);
		console.debug("[TEST] runByCode - result:", result);

		expect(result.executed).toBe(true);
	});

	it("getDetailsByCode", async () => {
		const code = "details-code";
		const mockResponse = { code, details: "info" };
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] getDetailsByCode - input:", code);
		const result = await schedulerClient.getDetailsByCode(code);
		console.debug("[TEST] getDetailsByCode - result:", result);

		expect(result.code).toBe(code);
	});

	it("getScheduleHistory", async () => {
		const mockHistory = [{ run: 1 }, { run: 2 }];
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockHistory });

		console.debug("[TEST] getScheduleHistory - expecting 2 items");
		const result = await schedulerClient.getScheduleHistory();
		console.debug("[TEST] getScheduleHistory - result:", result);

		expect(result.length).toBe(2);
	});

	it("getScheduleConfig", async () => {
		const code = "config-code";
		const mockResponse = { retries: 2 };
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] getScheduleConfig - input:", code);
		const result = await schedulerClient.getScheduleConfig(code);
		console.debug("[TEST] getScheduleConfig - result:", result);

		expect(result.retries).toBe(2);
	});

	it("getScheduleLogs", async () => {
		const ids = ["id1", "id2"];
		const mockLogs = [{ log: "line 1" }];
		(mockAxios.get as jest.Mock).mockResolvedValue({ data: mockLogs });

		console.debug("[TEST] getScheduleLogs - input:", ids);
		const result = await schedulerClient.getScheduleLogs(ids, 100);
		console.debug("[TEST] getScheduleLogs - result:", result);

		expect(result.length).toBe(1);
		expect(result[0].log).toBe("line 1");
	});
});
