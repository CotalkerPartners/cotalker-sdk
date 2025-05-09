import {
	AnswersQueryParams,
	answersQueryParams,
	COTAnswer
} from "@customTypes/COTTypes/COTAnswer";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";

/**
 * Client for retrieving answers from the API.
 */
export default class COTAnswerClient {
	private readonly AxiosInstance: AxiosInstance;

	/**
	 * Creates an instance of the answers client.
	 * @param instance - The Axios instance used to perform HTTP requests.
	 */
	constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
	}

	/**
	 * Retrieves a single answer by its unique identifier.
	 * @param id - The ID of the answer to retrieve.
	 * @returns A promise that resolves to the corresponding answer.
	 */
	async getAnswerById(id: ObjectId): Promise<COTAnswer> {
		const { data } = await this.AxiosInstance.get<{ data: COTAnswer }>(
			`/api/v2/answers/${id}`
		);
		return data;
	}

	/**
	 * Retrieves a list of answers based on query parameters.
	 * @param query - The query parameters used to filter answers.
	 * @returns A promise that resolves to an array of matching answers.
	 */
	async getAnswersQuery(query: AnswersQueryParams): Promise<COTAnswer[]> {
		queryValidator(answersQueryParams, query);
		const handler = new QueryHandler<{ answers: COTAnswer[] }>(
			"answers",
			this.AxiosInstance
		);
		const result = await handler.getQuery(query);
		return result[0].answers;
	}
}
