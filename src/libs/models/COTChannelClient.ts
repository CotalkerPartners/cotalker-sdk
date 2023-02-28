import { ChannelsQueryParams, channelsQueryParams, COTChannel } from '@customTypes/COTTypes/COTChannel'
import { QueryHandler } from '@utils/QueryHandler'
import { queryValidator } from '@utils/QueryValidator'
import { AxiosInstance } from 'axios'

export default class COTChannelClient {
  protected _instance: AxiosInstance

  private queryHandler

  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('channels', this._instance)

  }

  public async getChannelsQuery(query:ChannelsQueryParams): Promise<COTChannel[]> {
    queryValidator(channelsQueryParams, query)
    return (await this.queryHandler.getQuery(query)).channels
  }

  public async createChannel<T extends COTChannel>(body: COTChannel): Promise<T> {
    return (await this._instance.post<{ data: T }>('/api/v2/channels', body)).data
  }
}
