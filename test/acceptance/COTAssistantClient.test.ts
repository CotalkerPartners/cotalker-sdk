import { COTAssistantClient } from "../../src/libs/models/COTAssistantClient";
import { AxiosInstance } from "axios";
import { CotalkerAPI } from "../../src/libs/CotalkerAPI";

// Mock de OpenAI
const mockOpenAI = {
	chat: {
		completions: {
			create: jest.fn().mockResolvedValue({
				choices: [{ message: { content: "resumen generado" } }]
			})
		}
	}
};

jest.mock("openai", () => ({
	__esModule: true,
	OpenAI: jest.fn(() => mockOpenAI)
}));

// Mock de COTMessageClient
jest.mock("../../src/libs/models/COTMessageClient", () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => ({
		getMessages: jest
			.fn()
			.mockResolvedValue([
				{ contentType: "text/plain", content: "Mensaje de prueba" }
			]),
		sendMessage: jest.fn().mockResolvedValue({})
	}))
}));

describe("COTAssistantClient", () => {
	let mockAxios: AxiosInstance;
	let mockAPI: CotalkerAPI;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxios = {} as AxiosInstance;
		mockAPI = {} as CotalkerAPI;
	});

	test("debe generar resumen correctamente", async () => {
		const client = new COTAssistantClient(mockAPI, {
			openaiKey: "test-token",
			axiosInstance: mockAxios
		});

		const resumen = await client.generateSummary({
			channelId: "id_123",
			openaiToken: "sk-xxxx"
		});

		expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
		expect(resumen).toBe("resumen generado");
	});
});
