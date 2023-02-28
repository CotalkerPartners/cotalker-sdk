import { COTSurvey, SurveysQueryParams, surveysQueryParams } from '@customTypes/COTTypes/COTSurvey'
import { ObjectId } from '@customTypes/custom'
import { QueryHandler } from '@utils/QueryHandler'
import { queryValidator } from '@utils/QueryValidator'
import { AxiosInstance } from 'axios'

export default class COTSurveyClient {
  protected readonly _instance: AxiosInstance

  private queryHandler

  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('surveys', this._instance)
  }

  public async getSurvey(surveyId: ObjectId): Promise<COTSurvey> {
    return (await this._instance.get<{ data: COTSurvey }>(`/api/v2/surveys/${surveyId}?populate=true`))?.data
  }

  public async getSurveys(): Promise<COTSurvey[]> {
    return this.queryHandler.getAllInQuery({})
  }

  public async getSurveyQuery(query:SurveysQueryParams): Promise<COTSurvey> {
    queryValidator(surveysQueryParams, query)
    return (await this.queryHandler.getQuery(query)).surveys[0]
  }
  
  public async getAllSurveysInQuery(query:SurveysQueryParams): Promise<COTSurvey[]> {
    queryValidator(surveysQueryParams, query)
    return this.queryHandler.getAllInQuery(query)
  }
  
  public async getSurveysCodes(): Promise<COTSurvey[]> {
    return this.queryHandler.getAllInQuery({ select: 'code' })
  }
  
  public async getSurveysByAnswer(answerUuid: string | string[]): Promise<COTSurvey[]> {
    return this.queryHandler.getAllInQuery({ answer: answerUuid })
  }
}
