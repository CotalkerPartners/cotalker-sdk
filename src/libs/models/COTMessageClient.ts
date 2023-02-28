import { EditMsgBody, SendMsgBody } from '@customTypes/COTTypes/COTMessage'
import { ObjectId } from '@customTypes/custom'
import { AxiosInstance } from 'axios'

export default class COTMessageClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  async sendMessage<T>(body: SendMsgBody): Promise<T> {
    return (await this._instance.post<{ data: T }>('/api/v1/messages', body)).data
  }
  
  async editMessage<T>(_messageId: ObjectId, body: EditMsgBody): Promise<T> {
    return (await this._instance.patch<{ data:T }>(`/api/v1/messages/${_messageId}`, body)).data
  }
  
  async removeMessage<T>(_messageId: ObjectId): Promise<T> {
    return (await this._instance.patch<{ data:T }>(`/api/v1/messages/${_messageId}/remove`)).data
  }
} 
