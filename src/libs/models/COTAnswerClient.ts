import {
	AnswersQueryParams,
	answersQueryParams,
	COTAnswer
} from "@customTypes/COTTypes/COTAnswer";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";

export default class COTAnswerClient {
	private readonly _instance: AxiosInstance;

	constructor(instance: AxiosInstance) {
		this._instance = instance;
	}

	async getAnswerById(id: ObjectId): Promise<COTAnswer> {
		const { data } = await this._instance.get<{ data: COTAnswer }>(
			`/api/v2/answers/${id}`
		);
		return data;
	}

	async getAnswersQuery(query: AnswersQueryParams): Promise<COTAnswer[]> {
		queryValidator(answersQueryParams, query);
		const handler = new QueryHandler<{ answers: COTAnswer[] }>(
			"answers",
			this._instance
		);
		const result = await handler.getQuery(query);
		return result[0].answers;
	}
}
