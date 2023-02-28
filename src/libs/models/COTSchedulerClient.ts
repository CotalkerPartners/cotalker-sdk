import { ScheduleBody, SchedulePostResponse } from '@customTypes/COTTypes/scheduler'
import { AxiosInstance } from 'axios'

export default class COTSchedulerClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    const schedule = await this._instance.post('/api/uservices/scheduler/run', body)
    return schedule
  }

  public async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    const schedule = await this._instance.post('/api/uservices/scheduler', body)
    return schedule
  }
}
