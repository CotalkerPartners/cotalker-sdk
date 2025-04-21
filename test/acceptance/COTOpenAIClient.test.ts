import COTOpenAIClient from "../../src/libs/models/COTOpenAiClient";
import { AxiosInstance } from "axios";

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
	default: jest.fn(() => mockOpenAI)
}));

jest.mock("../../src/libs/models/COTMessageClient", () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			getMessages: jest
				.fn()
				.mockResolvedValue([{ body: { text: "Mensaje de prueba" } }]),
			sendMessage: jest.fn().mockResolvedValue({})
		}))
	};
});

describe("COTOpenAIClient", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("debe generar y enviar resumen correctamente", async () => {
		const mockAxios = {} as AxiosInstance;
		const client = new COTOpenAIClient(mockAxios);

		await client.generateSummary({
			channelId: "id_123",
			openaiToken: "test-token"
		});

		expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
	});
});
