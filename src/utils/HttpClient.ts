import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import * as http from 'http'
import * as https from 'https'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosResponse<T> extends Promise<T> {}
}

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance

  private waitTime

  public constructor(baseURL: string, keepAlive?: boolean) {
    if (keepAlive) {
      const httpAgent = new http.Agent({ keepAlive: true })
      const httpsAgent = new https.Agent({ keepAlive: true })
      this.instance = axios.create({
        baseURL, httpAgent, httpsAgent,
      })
    } else {
      this.instance = axios.create({
        baseURL,
      })
    }

    this._initializeResponseInterceptor()
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    )
  }

  static async post<T>(url: string, headers: Record<string, string>, body: Record<string, unknown>): Promise<T> {
    return (await axios({ url, data: body, method: 'post', headers }))?.data
  }

  static async get<T>(url: string, headers: Record<string, string>): Promise<T> {
    return (await axios({ url, method: 'get', headers }))?.data
  }

  // eslint-disable-next-line class-methods-use-this
  private _handleResponse = ({ data }: AxiosResponse) => data

  protected _handleError = async (axiosError: AxiosError): Promise<any> => {
    const { config, response } = axiosError
    switch (response.status) {
      case 429:
        console.error(`Retrying ${config.method} ${config.url}`)
        this.waitTime = Number(response.headers['retry-after'] ?? response.headers['Retry-After']) * 1000
        await new Promise(resolve => setTimeout(resolve, this.waitTime))
        return (axios(config))
      case 401:
        throw new Error('Bad authorization token. Your token has expired.')
      case 403:
        throw new Error('You do not have permissions to do this action! ')
      case 404:
        console.error('ID not found', config.url)
        return Promise.resolve({ data: null })
      case 500:
        console.error(' Cotalker API replied with internal error', response.data)
        return Promise.resolve({ data: null })
      default:
        break
    }
    return Promise.reject(axiosError)
  }
}
