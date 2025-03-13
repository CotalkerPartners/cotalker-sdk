import { AxiosRequestConfig } from 'axios'
import HttpClient from './HttpClient'

export class CotalkerAuthAPI extends HttpClient {
  private _cotalkerToken: string
  private static _resolveBaseUrl(baseURL?:string) {
    if (baseURL) return baseURL
    if (process.env.SVC_AUTH_SERVICE_HOST) {
      return `http://${process.env.SVC_AUTH_SERVICE_HOST}:${process.env.SVC_AUTH_SERVICE_PORT}/api`
    }
    if (process.env.BASE_URL) return `${process.env.BASE_URL}/api/v3/auth`
    throw Error('CotalkerAuthAPI: No BaseURL Provided')
  }
  public constructor(token?: string, baseURL?: string) {
    const resolvedBaseURL = CotalkerAuthAPI._resolveBaseUrl(baseURL)
    console.info(`CotalkerAuthAPI: BaseURL using ${resolvedBaseURL}`)
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
    if (!config.headers['Authorization']) config.headers['Authorization'] = `Bearer ${this._cotalkerToken}`
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json'
    config.headers['admin'] = 'true'
    return config
  }
  // AUTH
  public async getME(token?: string): Promise<COTUser> {
    const config = {} as any
    if (token) config.headers = { 'Authorization': `Bearer ${token.replace(/^Bearer /, '')}` }
    return (await this.instance.get<COTUser>('/auth', config)) 
  }
  public async local(email: string, password: string): Promise<{ token:  string }> {
    return (await this.instance.post<{token: string}>('/auth/local', { email, password }))
  }
}

export const authAPI = new CotalkerAuthAPI()
