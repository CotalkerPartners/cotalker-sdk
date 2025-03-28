import {
	COTSurvey,
	COTSurveyChat,
	SurveysQueryParams,
	surveysQueryParams
} from "@customTypes/COTTypes/COTSurvey";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";

export default class COTSurveyClient {
	protected readonly axiosInstance: AxiosInstance;

	private queryHandler;

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("surveys", this.axiosInstance);
	}

	public async getSurvey(surveyId: ObjectId): Promise<COTSurvey> {
		return (
			await this.axiosInstance.get<{ data: COTSurvey }>(
				`/api/v2/surveys/${surveyId}?populate=true`
			)
		)?.data;
	}

	public async getSurveys(query?: SurveysQueryParams): Promise<COTSurvey[]> {
		if (query) {
			queryValidator(surveysQueryParams, query);
			return this.queryHandler.getAllInQuery(query);
		}

		let count = 1;
		let page = 1;
		const surveys: COTSurvey[] = [];

		do {
			const response = await this.axiosInstance.get<{
				data: { count: number; surveys: COTSurvey[] };
			}>(
				`/api/v2/surveys?count=true&limit=100&page=${page}&isActive=true`
			);
			surveys.push(...response.data.surveys);
			count = response.data.count;
			page++;
		} while (surveys.length < count);

		return surveys;
	}

	public async getSurveyQuery(query: SurveysQueryParams): Promise<COTSurvey> {
		queryValidator(surveysQueryParams, query);
		return (await this.queryHandler.getQuery(query)).surveys[0];
	}

	public async getAllSurveysInQuery(
		query: SurveysQueryParams
	): Promise<COTSurvey[]> {
		queryValidator(surveysQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

	public async getSurveysCodes(): Promise<COTSurvey[]> {
		return this.queryHandler.getAllInQuery({ select: "code" });
	}

	public async getSurveysByAnswer(
		answerUuid: string | string[]
	): Promise<COTSurvey[]> {
		return this.queryHandler.getAllInQuery({ answer: answerUuid });
	}

	public async getSurveysByName(name: string): Promise<COTSurvey[]> {
		const queryParams = name ? `?search=.*${name}` : "";
		return (
			(
				await this.axiosInstance.get<{
					data: { surveys: COTSurvey[] };
				}>(`/api/v3/surveys${queryParams}`)
			)?.data?.surveys || []
		);
	}

	public async getSurveyChats(surveyID: ObjectId): Promise<COTSurveyChat[]> {
		const surveyChats = (
			await this.axiosInstance.get(
				`/api/v2/surveychats?survey=${surveyID}`
			)
		).data?.surveyChats;
		return surveyChats;
	}

	public async postSurveyChat(
		surveyChat: Pick<COTSurveyChat, "contentArray" | "order" | "survey">
	): Promise<COTSurveyChat> {
		const body: Partial<COTSurveyChat> & { isNew: true } = {
			survey: surveyChat.survey,
			contentArray: surveyChat.contentArray,
			order: surveyChat.order,
			contentType: "application/vnd.cotalker.survey",
			sender: "#system",
			isNew: true
		};
		return (
			await this.axiosInstance.post(
				"/api/v2/surveychats?debug=true",
				body
			)
		).data;
	}
}
