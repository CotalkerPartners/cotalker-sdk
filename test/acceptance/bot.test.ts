import { COTBotClient } from "../../src/libs/models/COTBotClient";
import { AxiosInstance } from "axios";

const mockAxios: Partial<AxiosInstance> = {
	post: jest.fn()
};

describe("🧪 COTBotClient", () => {
	let botClient: COTBotClient;

	beforeEach(() => {
		jest.clearAllMocks();
		botClient = new COTBotClient(mockAxios as AxiosInstance);
	});

	it("✅ runBot - con body", async () => {
		const botId = "bot123";
		const input = { param1: "value1" };
		const mockResponse = { status: true, code: "ok", owner: "BOT" };

		(mockAxios.post as jest.Mock).mockResolvedValue({
			data: mockResponse
		});

		console.debug("[TEST] runBot - input botId:", botId);
		console.debug("[TEST] runBot - input body:", input);

		const result = await botClient.runBotById(botId, input);

		console.debug("[TEST] runBot - result:", result);
		expect(result.data.status).toBe(true);
		expect(result.data.code).toBe("ok");
		expect(result.data.owner).toBe("BOT");
	});

	it("✅ runBot - sin body", async () => {
		const botId = "bot456";
		const mockResponse = { status: true };

		(mockAxios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

		console.debug("[TEST] runBot (sin body) - input botId:", botId);

		const result = await botClient.runBotById(botId);

		console.debug("[TEST] runBot (sin body) - result:", result);
		expect(result.data.status).toBe(true);
	});
});
