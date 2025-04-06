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

/**
 * Manages requests related to the encounters.
 */
export default class COTSurveyClient {
	protected readonly axiosInstance: AxiosInstance;

	private queryHandler;

	/**
	 * Constructs a new instance of the COTSurveyClient.
	 * @param instance Axios instance used for HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("surveys", this.axiosInstance);
	}

	/**
	 * Fetches a survey by its ID.
	 * @param surveyId The ID of the survey.
	 * @returns The survey object.
	 */
	public async getSurvey(surveyId: ObjectId): Promise<COTSurvey> {
		return (
			await this.axiosInstance.get<{ data: COTSurvey }>(
				`/api/v2/surveys/${surveyId}?populate=true`
			)
		)?.data;
	}

	/**
	 * Fetches surveys matching query params or returns all active surveys.
	 * @param query Optional search filters.
	 * @returns An array of surveys.
	 */
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

	/**
	 * Fetches a single survey using a query.
	 * @param query Query parameters to find the survey.
	 * @returns The matched survey.
	 */
	public async getSurveyQuery(query: SurveysQueryParams): Promise<COTSurvey> {
		queryValidator(surveysQueryParams, query);
		return (await this.queryHandler.getQuery(query)).surveys[0];
	}

	/**
	 * Fetches all surveys matching a given query.
	 * @param query Query parameters to filter surveys.
	 * @returns An array of matching surveys.
	 */
	public async getAllSurveysInQuery(
		query: SurveysQueryParams
	): Promise<COTSurvey[]> {
		queryValidator(surveysQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

	/**
	 * Fetches only survey codes.
	 * @returns An array of surveys containing only their code.
	 */
	public async getSurveysCodes(): Promise<COTSurvey[]> {
		return this.queryHandler.getAllInQuery({ select: "code" });
	}

	/**
	 * Fetches surveys related to a specific answer UUID.
	 * @param answerUuid The UUID of the answer(s).
	 * @returns Surveys linked to the answer.
	 */
	public async getSurveysByAnswer(
		answerUuid: string | string[]
	): Promise<COTSurvey[]> {
		return this.queryHandler.getAllInQuery({ answer: answerUuid });
	}

	/**
	 * Searches surveys by their name.
	 * @param name The name or pattern to search for.
	 * @returns An array of surveys matching the name.
	 */
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

	/**
	 * Retrieves all chat messages related to a given survey.
	 * @param surveyID The ID of the survey.
	 * @returns An array of survey chats.
	 */
	public async getSurveyChats(surveyID: ObjectId): Promise<COTSurveyChat[]> {
		const surveyChats = (
			await this.axiosInstance.get(
				`/api/v2/surveychats?survey=${surveyID}`
			)
		).data?.surveyChats;
		return surveyChats;
	}

	/**
	 * Creates a new chat entry for a survey.
	 * @param surveyChat The survey chat data (content, order, and survey reference).
	 * @returns The created survey chat.
	 */
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
