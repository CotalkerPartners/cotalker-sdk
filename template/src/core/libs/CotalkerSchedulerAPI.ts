import { AxiosRequestConfig } from 'axios'
import qs from 'querystring'
import HttpClient from './HttpClient'

export class CotalkerSchedulerAPI extends HttpClient {
  private _cotalkerToken: string
  private static _resolveBaseUrl(baseURL?:string) {
    if (baseURL) return baseURL
    if (process.env.SVC_SCHEDULER_API_SERVICE_HOST) {
      return `http://${process.env.SVC_SCHEDULER_API_SERVICE_HOST}:${process.env.SVC_SCHEDULER_API_SERVICE_PORT}/api`
    }
    if (process.env.BASE_URL) return `${process.env.BASE_URL}/api/v3/scheduler`
    throw Error('CotalkerSchedulerAPI: No BaseURL Provided')
  }
  public constructor(token?: string, baseURL?: string) {
    const resolvedBaseURL = CotalkerSchedulerAPI._resolveBaseUrl(baseURL)
    console.info(`CotalkerSchedulerAPI: BaseURL using ${resolvedBaseURL}`)
    super(resolvedBaseURL, true)
    this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? '').replace(/^Bearer/,'')
    this._initializeRequestInterceptor()
  }
  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest as any,
      this._handleError,
    )
  }
  private _handleRequest = async (config: AxiosRequestConfig) => {
    if (!(config  as any).metadata) (config  as any).metadata = { requestStartTime: Date.now() }
    if (!config.headers) return
    config.headers['Authorization'] = `Bearer ${this._cotalkerToken}`
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json'
    config.headers['admin'] = 'true'
    return config
  }
  // Schedules
  public async getSchedulesByCodePrefix(codePrefix: string): Promise<ScheduleBody[]> {
    const query = qs.encode({ codePrefix, type:'all', limit: 100 })
    return (await this.instance.get('/schedule?'+query))?.data
  }
  public async getSchedule(scheduleId: ObjectId): Promise<ScheduleBody> {
    return (await this.instance.get(`/schedule/${scheduleId}`))
  }
  public async getScheduleByCode(code: string): Promise<ScheduleBody> {
    return (await this.instance.get(`/schedule/code/${code}`))
  }
  public async patchSchedule(scheduleId: ObjectId, body: Partial<ScheduleBody>): Promise<ScheduleBody> {
    return (await this.instance.patch(`/schedule/${scheduleId}`, body))
  }
  public async patchScheduleByCode(code: string, body: Partial<ScheduleBody>): Promise<ScheduleBody> {
    const _body = { ...body, code }
    return (await this.instance.patch(`/schedule/`, _body))
  }
  public async postSchedule(schedule: ScheduleBody): Promise<ScheduleBody&{_id:ObjectId}> {
    console.info(`Posting schedule ${schedule.code}`)
    return (await this.instance.post(`/schedule`, schedule))
  }
  public async runSchedule(schedule: ScheduleBody): Promise<ScheduleBody&{_id:ObjectId}> {
    console.info(`Runnning schedule ${schedule.code}`)
    return (await this.instance.post(`/schedule/run`, schedule))
  }

  // ScheduleLogs
  async getLogsByScheduleIds(schedules: ObjectId[]): Promise<ScheduleLog[]> {
    if (schedules.length > 100) {
      console.warn('Requested logs for more than 100 schedules')
    }
    const query = qs.encode({ schedule: schedules.slice(0,100), limit: 100 })
    return (await this.instance.get(`/log?${query}`)).data
  }
}

export const schedulerAPI = new CotalkerSchedulerAPI()
