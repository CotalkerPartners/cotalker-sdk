import COTMessageClient from "../../src/libs/models/COTMessageClient";
import axios from "axios";
import {
	SendMsgBody,
	EditMsgBody
} from "../../src/customTypes/COTTypes/COTMessage";

jest.mock("../../src/libs/models/COTMessageClient", () => {
	return {
		default: jest.fn().mockImplementation(() => ({
			sendMessage: jest.fn(),
			editMessage: jest.fn(),
			removeMessage: jest.fn(),
			getMessages: jest.fn()
		}))
	};
});

describe("Messages model", () => {
	let messagesAPI: COTMessageClient;
	const mockMessageId = "message123";
	const mockChannelId = "channel123";
	const mockSendMsgBody: SendMsgBody = {
		channel: mockChannelId,
		content: "Test message",
		contentType: "text/plain",
		isSaved: 2,
		sentBy: "user123"
	};

	const mockEditMsgBody: EditMsgBody = {
		channel: mockChannelId,
		content: "Edited message",
		isSaved: 2
	};

	const mockMessage = {
		_id: mockMessageId,
		channel: mockChannelId,
		content: "Test message",
		type: "text",
		createdAt: new Date().toISOString(),
		modifiedAt: new Date().toISOString(),
		sender: "user123",
		status: "sent",
		contentType: "text/plain",
		isSaved: 2
	};
	const mockMessages = [mockMessage];
	const mockAxios = axios.create();

	beforeEach(() => {
		jest.clearAllMocks();
		messagesAPI = new COTMessageClient(mockAxios);
	});

	test("Debe enviar un mensaje correctamente", async () => {
		(messagesAPI.sendMessage as jest.Mock).mockResolvedValue(mockMessage);
		const result = await messagesAPI.sendMessage(mockSendMsgBody);
		expect(result).toEqual(mockMessage);
	});

	test("Debe editar un mensaje existente", async () => {
		(messagesAPI.editMessage as jest.Mock).mockResolvedValue(mockMessage);
		const result = await messagesAPI.editMessage(
			mockMessageId,
			mockEditMsgBody
		);
		expect(result).toEqual(mockMessage);
	});

	test("Debe eliminar un mensaje correctamente", async () => {
		const deletedMessage = {
			...mockMessage,
			status: "deleted"
		};

		(messagesAPI.removeMessage as jest.Mock).mockResolvedValue(
			deletedMessage
		);

		const result = (await messagesAPI.removeMessage(
			mockMessageId
		)) as typeof deletedMessage;
		expect(result.status).toBe("deleted");
	});

	test("Debe obtener mensajes de un canal con fecha por defecto", async () => {
		(messagesAPI.getMessages as jest.Mock).mockResolvedValue(mockMessages);
		const result = await messagesAPI.getMessages(mockChannelId);
		expect(result).toEqual(mockMessages);
	});

	test("Debe obtener mensajes de un canal con fecha específica", async () => {
		const testDate = new Date();
		(messagesAPI.getMessages as jest.Mock).mockResolvedValue(mockMessages);
		const result = await messagesAPI.getMessages(mockChannelId, testDate);
		expect(result).toEqual(mockMessages);
	});
});
