import Agent, { HttpsAgent } from 'agentkeepalive';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosResponse<T> extends Promise<T> {}
}
const timeout = 20000
const axiosErrorHandler = async (axiosError: AxiosError, axiosInstance: AxiosInstance): Promise<any> => {
  const { config, response } = axiosError
  let errorAfterTimestamp = ''
  if ((config as any).metadata?.requestStartTime) {
    errorAfterTimestamp =`🛜💀 Request failed after ${Date.now() - (config as any).metadata.requestStartTime}\n`
  }
  if (!response || axiosError.code === 'ECONNRESET' || response?.status === 502) {
    console.error(`${errorAfterTimestamp}VOID RESPONSE ERROR CODE ${axiosError.code} - ${config.baseURL}${config.url}`)
    console.info('CONFIG:', JSON.stringify({
      url: config.url, baseURL: config.baseURL,
      method: config.method, headers: config.headers,
      data: config.data
    }))
    await new Promise(resolve => setTimeout(resolve, 500))
    return await axiosInstance(config)
  }
  if (response?.status === 429) {
    console.info(`429 TOO MANY REQUESTS: Retrying ${config.method} ${config.url}`)
    const waitTime = Number(response.headers['retry-after'] ?? response.headers['Retry-After'])*1000
    await new Promise(resolve=>setTimeout(resolve, waitTime))
    return await axiosInstance(config)
  }
  if (response?.status === 404) {
    console.info(`404 NOT FOUND ${config.method} ${config.url}`)
    return Promise.resolve({ data: null })
  }
  const errorObj = {
    url: config.url, baseURL: config.baseURL,
    method: config.method, headers: config.headers,
    data: ((config.url !== '/file/upload') ? config.data: 'FILEDATA'),
  }
  console.error('❌HTTP Request Failed with status', response.status, JSON.stringify(errorObj, null, 2))
  if (response.data) {
    const rData = response.data as Record<string,unknown>
    if (rData.data) console.error('RESPONSE DATA:', rData.data)
    if (rData.error) console.error('RESPONSE ERROR:', rData.error)
    if (rData.debug) console.error('RESPONSE DEBUG:', JSON.stringify(rData.debug, null, 2))
  }
  return Promise.reject(new Error(`Request ${config.method} ${config.url} failed with status ${response.status}`))
}
export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string, keepAlive?: boolean) {
    if (keepAlive) {
      console.log('USING KEEP ALIVE IN HTTPClient ⚠️')
      const httpAgent = new Agent();
      const httpsAgent = new HttpsAgent();
      this.instance = axios.create({
        baseURL, httpAgent, httpsAgent, timeout
      })
    } else {
      console.log('HTTP AGENT NULL ≠')
      this.instance = axios.create({
        baseURL, timeout, httpAgent: null, httpsAgent: null
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
    const staticAxios = axios.create({})
    staticAxios.interceptors.response.use(({data}) => {
      return data;
    }, 
    async e=>(await axiosErrorHandler(e,staticAxios)))
    const response = (await staticAxios({ url, method: 'get', headers }));
    return response;
  }

  private _handleResponse = ({ data}: AxiosResponse) => {
    return data
  }

  protected _handleError = async (axiosError: AxiosError): Promise<any> => {
    return await axiosErrorHandler(axiosError, this.instance)
  }
}
