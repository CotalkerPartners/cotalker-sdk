import { AnswersQueryParams, answersQueryParams, COTAnswer } from '@customTypes/COTTypes/COTAnswer'
import { ObjectId } from '@customTypes/custom'
import { QueryHandler } from '@utils/QueryHandler'
import { queryValidator } from '@utils/QueryValidator'
import { AxiosInstance } from 'axios'

export default class COTAnswerClient {
  protected readonly _instance: AxiosInstance

  private queryHandler
  
  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('answers', this._instance)
  }
  
  public async getAnswer(answerId: ObjectId): Promise<COTAnswer> {
    return (await this._instance.get<{ data: COTAnswer }>(`/api/v2/answers/${answerId}`))?.data
  }

  public async getAnswersQuery(query:AnswersQueryParams): Promise<COTAnswer[]> {
    queryValidator(answersQueryParams, query)
    return (await this.queryHandler.getQuery(query)).answers
  }

  public async getAnswersfromSurvey(surveyId:string): Promise<COTAnswer[]> {
    return (await this.queryHandler.getQuery({ surveyId })).answers
  }  
}
