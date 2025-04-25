import COTOpenAIClient from "../../src/libs/models/COTOpenAIClient";
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

	test("debe generar resumen correctamente", async () => {
		const mockAxios = {} as AxiosInstance;
		const client = new COTOpenAIClient(mockAxios);

		client.setToken("test-token");

		const resumen = await client.generateSummary({
			channelId: "id_123"
		});

		expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
		expect(resumen).toBe("resumen generado");
	});
	test("lanza error si no se ha seteado el token", async () => {
		const mockAxios = {} as AxiosInstance;
		const client = new COTOpenAIClient(mockAxios);

		await expect(
			client.generateSummary({ channelId: "id_123" })
		).rejects.toThrow("Debes setear un token de OpenAI");
	});
});
