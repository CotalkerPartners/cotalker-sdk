import COTSurveyClient from "../../src/libs/models/COTSurveyClient";
import axios from "axios";
jest.mock("../../src/libs/models/COTSurveyClient", () => {
	return {
		default: jest.fn().mockImplementation(() => ({
			getSurvey: jest.fn(),
			getSurveys: jest.fn(),
			querySurveys: jest.fn(),
			getSurveyQuery: jest.fn(),
			getAllSurveysInQuery: jest.fn(),
			getSurveysCodes: jest.fn(),
			getSurveysByAnswer: jest.fn(),
			getSurveysByName: jest.fn(),
			getSurveyChats: jest.fn(),
			postSurveyChat: jest.fn()
		}))
	};
});

describe("Survey model", () => {
	let surveysAPI: COTSurveyClient;
	const surveyId = "507f1f77bcf86cd799439011";
	const surveyName = "Test Survey";
	const answerUuid = "550e8400-e29b-41d4-a716-446655440000";
	const mockSurvey = {
		_id: surveyId,
		name: surveyName,
		code: "TS001",
		isActive: true
	};
	const mockSurveyChat = {
		_id: "507f1f77bcf86cd799439012",
		survey: surveyId,
		contentArray: ["Test content"],
		order: 1
	};
	const mockAxios = axios.create();

	beforeEach(() => {
		jest.clearAllMocks();
		surveysAPI = new COTSurveyClient(mockAxios);
	});

	test("Debe obtener un survey por su ID", async () => {
		(surveysAPI.getSurvey as jest.Mock).mockResolvedValue(mockSurvey);

		const result = await surveysAPI.getSurvey(surveyId);

		expect(result).toEqual(mockSurvey);
	});

	test("Debe obtener surveys con paginación cuando no hay query", async () => {
		const mockSurveys = [
			mockSurvey,
			{
				_id: "507f1f77bcf86cd799439022",
				name: "Another Survey"
			}
		];

		(surveysAPI.getSurveys as jest.Mock).mockResolvedValue(mockSurveys);

		const result = await surveysAPI.getSurveys();

		expect(result).toEqual(mockSurveys);
	});

	test("✅ Debe obtener surveys con query parameters", async () => {
		const query: { isActive: "true" } = { isActive: "true" };
		const mockSurveys = [mockSurvey];

		(surveysAPI.getSurveys as jest.Mock).mockResolvedValue(mockSurveys);

		console.debug("[TEST] getSurveys - input query:", query);
		const result = await surveysAPI.getSurveys(query);
		console.debug("[TEST] getSurveys - output result:", result);

		expect(result).toEqual(mockSurveys);
	});

	test("✅ Debe obtener un survey usando query parameters", async () => {
		const query: { search?: string; code?: string } = { code: "TS001" };

		(surveysAPI.getSurveyQuery as jest.Mock).mockResolvedValue(mockSurvey);

		console.debug("[TEST] getSurveyQuery - input query:", query);
		const result = await surveysAPI.getSurveyQuery(query);
		console.debug("[TEST] getSurveyQuery - output result:", result);

		expect(result).toEqual(mockSurvey);
	});

	test("Debe obtener todos los surveys que coincidan con un query", async () => {
		const query: { isActive: "true" } = { isActive: "true" };
		const mockSurveys = [
			mockSurvey,
			{
				_id: "507f1f77bcf86cd799439033",
				name: "Active Survey"
			}
		];

		(surveysAPI.getAllSurveysInQuery as jest.Mock).mockResolvedValue(
			mockSurveys
		);

		const result = await surveysAPI.getAllSurveysInQuery(query);

		expect(result).toEqual(mockSurveys);
	});

	test("Debe obtener solo los códigos de los surveys", async () => {
		const mockCodes = [{ code: "TS001" }, { code: "TS002" }];

		(surveysAPI.getSurveysCodes as jest.Mock).mockResolvedValue(mockCodes);

		const result = await surveysAPI.getSurveysCodes();

		expect(result).toEqual(mockCodes);
	});

	test("Debe obtener surveys por respuesta UUID", async () => {
		const mockSurveys = [mockSurvey];

		(surveysAPI.getSurveysByAnswer as jest.Mock).mockResolvedValue(
			mockSurveys
		);

		const result = await surveysAPI.getSurveysByAnswer(answerUuid);

		expect(result).toEqual(mockSurveys);
	});

	test("Debe buscar surveys por nombre", async () => {
		const mockSurveys = [mockSurvey];

		(surveysAPI.getSurveysByName as jest.Mock).mockResolvedValue(
			mockSurveys
		);

		const result = await surveysAPI.getSurveysByName(surveyName);

		expect(result).toEqual(mockSurveys);
	});

	test("Debe obtener los chats de un survey", async () => {
		const mockChats = [mockSurveyChat];

		(surveysAPI.getSurveyChats as jest.Mock).mockResolvedValue(mockChats);

		const result = await surveysAPI.getSurveyChats(surveyId);

		expect(result).toEqual(mockChats);
	});

	test("Debe crear un nuevo chat para un survey", async () => {
		const newChat = {
			...mockSurveyChat,
			_id: "507f1f77bcf86cd799439044"
		};

		(surveysAPI.postSurveyChat as jest.Mock).mockResolvedValue(newChat);

		const result = await surveysAPI.postSurveyChat({
			survey: surveyId,
			contentArray: ["New content"],
			order: 2
		});

		expect(result).toEqual(newChat);
	});
});
