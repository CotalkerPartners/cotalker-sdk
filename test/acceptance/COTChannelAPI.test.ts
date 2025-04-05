import COTChannelClient from "../../src/libs/models/COTChannelClient";
import axios from "axios";
jest.mock("../../src/libs/models/COTChannelClient", () => {
	return {
		default: jest.fn().mockImplementation(() => ({
			createChannel: jest.fn(),
			getChannelAnswers: jest.fn(),
			getChannelsByGroup: jest.fn(),
			getChannelFiles: jest.fn(),
			_filesAPI: {
				getChannelFiles: jest.fn()
			}
		}))
	};
});

describe("Channel model", () => {
	let channel: COTChannelClient;
	const mockAxios = axios.create();
	beforeEach(() => {
		jest.clearAllMocks();
		channel = new COTChannelClient(mockAxios);
	});
	test("Debe crear un nuevo canal", async () => {
		const channelData = {
			group: "group123",
			nameCode: "canal-prueba",
			nameDisplay: "Canal de Prueba",
			userIds: ["user1", "user2"]
		};
		const mockChannel = { channelId: "123", ...channelData };
		(channel.createChannel as jest.Mock).mockResolvedValue(mockChannel);
		const newChannel = await channel.createChannel(channelData);
		expect(newChannel).toHaveProperty("channelId");
	});
	test("Debe obtener respuestas asociadas a un canal", async () => {
		const surveryId = "123";
		const channelId = "456";
		const mockAnswers = [
			{ answerId: "1", response: "Sí" },
			{ answerId: "2", response: "No" }
		];
		(channel.getChannelAnswers as jest.Mock).mockResolvedValue(mockAnswers);
		const answers = await channel.getChannelAnswers(surveryId, channelId);
		expect(answers).toBeInstanceOf(Array);
	});
	test("Debe obtener todos los canales asociados a un grupo", async () => {
		const group = "789";
		const mockChannels = [
			{ channelId: "123", name: "Canal 1" },
			{ channelId: "456", name: "Canal 2" }
		];
		(channel.getChannelsByGroup as jest.Mock).mockResolvedValue(
			mockChannels
		);
		const channels = await channel.getChannelsByGroup(group);
		expect(channels).toBeInstanceOf(Array);
	});
	test("Debe obtener archivos asociados a un canal", async () => {
		const channelId = "456";
		const contentType = "image";
		const mockFiles = [
			{ fileId: "file1", contentType: "image" },
			{ fileId: "file2", contentType: "image" }
		];
		(channel.getChannelFiles as jest.Mock).mockResolvedValue(mockFiles);
		const files = await channel.getChannelFiles(channelId, contentType);
		files.forEach((file) => {
			expect(file).toHaveProperty("fileId");
			expect(file.contentType).toBe(contentType);
		});
	});
});
