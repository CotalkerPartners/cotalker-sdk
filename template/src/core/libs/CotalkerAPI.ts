import { URLSearchParams } from 'url'
import querystring from 'querystring'
import { AxiosRequestConfig } from 'axios'
import HttpClient from './HttpClient'
import COTFilesAPI from './COTFilesAPI'
import { CotalkerSchedulerAPI } from './CotalkerSchedulerAPI'
import { authAPI } from './CotalkerAuthAPI'
import { addDays } from 'date-fns'

type isActiveOptions = 'true'|'false'|'all'

export type JSONPatchBody = {
  op: 'add'|'remove'|'replace'|'move'|'copy'|'test'
  path: `/${string}`, value?: unknown
}[]

type searchPropertyQueryOptions = {
  parent?: string | string[]
}

type SendMsgBody = {
  channel: ObjectId,
  content: string,
  contentType: 'text/system' | 'text/plain',
  isSaved: 2,
  sentBy: ObjectId
}

export class CotalkerAPI extends HttpClient {
  private _cotalkerToken: string
  private _schedulerAPI : CotalkerSchedulerAPI
  private _filesAPI : COTFilesAPI
  //private _authAPI : CotalkerAuthAPI
  private static _resolveBaseURL(baseURL?: string) {
    if (process.env.CORE_INTERNAL_SERVICE_HOST) {
      console.info('CotalkerAPI - USNG INTERNAL URLs')
      return `http://${process.env.CORE_INTERNAL_SERVICE_HOST}:${process.env.CORE_INTERNAL_SERVICE_PORT}`
    }
    if (baseURL) return baseURL
    if (process.env.BASE_URL) return process.env.BASE_URL
    if (process.env.BASE_URL) return process.env.BASE_URL
    console.info('CotalkerAPI: BASE URL NOT PROVIDED, USING STAGING')
    return 'https://staging.cotalker.com'
  }
  public constructor(token?: string, baseURL?: string) {
    const resolveBaseURL = CotalkerAPI._resolveBaseURL(baseURL)
    console.info(`CotalkerAPI: BaseURL using ${resolveBaseURL}`)
    super(resolveBaseURL, true)
    this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? '').replace(/^Bearer /g, '')
    this._schedulerAPI = new CotalkerSchedulerAPI(this._cotalkerToken)
    this._filesAPI = new COTFilesAPI(this._cotalkerToken)
    //this._authAPI = new CotalkerAuthAPI(this._cotalkerToken)
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

  public static async login(email: string, password: string): Promise<string> {
    return (await authAPI.local(email, password)).token
  }

  public async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this._schedulerAPI.runSchedule(body)
  }
  public async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this._schedulerAPI.postSchedule(body)
  }

  public async executeBot(botID: ObjectId, data: Record<string, unknown>) {
    return await this.instance.post<{ status: boolean, code: string }>(
      `/api/v1/bots/run/${botID}`, data
    )
  }
  /* COTProperty */
  public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
    return (await this.instance.get<{data: T}>(`/api/v2/properties/${_id}`)).data
  }
  public async getPropertyByCode<T extends COTProperty>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/properties/code/${code}`)).data
  }

  /* COTPropertyType */
  public async getPropertyTypeByCode<T extends COTPropertyType>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/propertyTypes/code/${code}`)).data
  }
  public async searchPropertyType(search: string): Promise<COTPropertyType[]> {
    const propertyTypes = (await this.instance.get(`/api/v2/propertyTypes?search=${search}&limit=100`)).data?.propertyTypes
    return propertyTypes
  }

  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions)
  : Promise<T> {
    const query: Record<string, string|string[]> = { search, ...(options??{}) }
    if (propertyType) query.propertyTypes = propertyType
    return (await this.instance.get(`/api/v2/properties?${new URLSearchParams(query).toString()}`)).data?.properties ?? []
  }
  public async getSubproperties<T extends COTProperty>(property: COTProperty, isActive?: isActiveOptions): Promise<T[]>
  public async getSubproperties<T extends COTProperty>(property: ObjectId,isActive?: isActiveOptions): Promise<T[]>
  public async getSubproperties<T extends COTProperty>(
    property: ObjectId | COTProperty, isActive?: isActiveOptions): Promise<T[]> {
    if (typeof property === 'string') return (await this.instance.get<{ data: { properties: T[] } }>(
      `/api/v2/properties/relations?property=${property}&relation=child&isActive=${isActive ?? 'all'}`)).data?.properties
    if (!property.subproperty?.length) return []
    const qParams = querystring.encode({ ids: property.subproperty, limit: '1000' }) 
    return (await this.instance.get<{ data: { properties: T[] } }>(
      `/api/v2/properties?${qParams.toString()}`)).data?.properties
  }
  public async getUserProperties(user: COTUser) {
    const propertyIds = user.properties ?? []
    if (!propertyIds.length) return []
    const qParams = querystring.encode({ ids: propertyIds, limit: '1000' }) 
    return (await this.instance.get<{ data: { properties: COTProperty[] } }>(`/api/v2/properties?${qParams.toString()}`)).data?.properties
  }
  public async postProperty<T extends COTProperty>(property: COTPropertyPostBody, debugOpt=false): Promise<T> {
    return (await this.instance.post<{data: T}>(`/api/v2/properties?debug=${debugOpt}`, property)).data
  }
  public async patchProperty<T extends COTProperty>(propertyId: ObjectId, body: Partial<COTProperty>): Promise<T> {
    return (await this.instance.patch<{data: T}>(`/api/v2/properties/${propertyId}`, body)).data
  }
  public async jsonPatchProperty<T extends COTProperty>(propertyId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/properties/jsonpatch/${propertyId}?debug=true`, body)).data
  }
  public async getAllFromPropertyType<T extends COTProperty>(propertyType: string): Promise <T[]> {
    let count = 1
    let page = 1
    const properties: T[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, properties: T[] } }>(
        `/api/v2/properties?page=${page}&propertyTypes=${propertyType}&limit=200&isActive=true&count=true`)) 
      properties.push(...(response.data?.properties ?? []))
      count = response.data?.count ?? properties.length
      page++
    } while(properties.length < count)
    return properties
  }
  public async getExtensionProperty<T extends COTProperty>(taskId: ObjectId, extensionKey: string): Promise<COTProperty> {
    const { data } = (await this.instance.get<{ data: {properties: T[]} }>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`))
    if (Array.isArray(data?.properties) && data.properties[0]) return data.properties[0]
  }
  /* COTSurvey */
  public async getSurvey(surveyId: ObjectId): Promise<PopulatedCOTSurvey> {
    return (await this.instance.get<{data:PopulatedCOTSurvey}>(`/api/v2/surveys/${surveyId}?populate=true`))?.data
  }
  public async getSurveys(): Promise<COTSurvey[]> {
    let count = 1
    let page = 1
    const surveys: COTSurvey[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, surveys: COTSurvey[] } }>(
        `/api/v2/surveys?count=true&limit=100&page=${page}&isActive=true`)) 
      surveys.push(...response.data.surveys)
      count = response.data.count 
      page++
    } while(surveys.length < count)
    return surveys
  }
  public async getSurveyChats(surveyID: ObjectId): Promise<COTSurveyChat[]> {
    const surveyChats = (await this.instance.get(`/api/v2/surveychats?survey=${surveyID}`)).data?.surveyChats
    return surveyChats
  }
  public async postSurveyChat(surveyChat: Pick<COTSurveyChat,'contentArray'|'order'|'survey'>) {
    const body: Partial<COTSurveyChat> & {isNew:true} = {
      survey: surveyChat.survey,
      contentArray: surveyChat.contentArray,
      order: surveyChat.order,
      contentType: 'application/vnd.cotalker.survey',
      sender: '#system',
      isNew: true,
    }
    const newSurveyChat = (await this.instance.post('/api/v2/surveychats?debug=true', body)).data
    return newSurveyChat as COTSurveyChat
  }
  public async getQuestion(questionID: ObjectId) {
    const question = (await this.instance.get(`/api/v2/questions/${questionID}`)).data
    return question
  }
  public async postQuestion(question: Partial<COTQuestion>) {
    const newQuestion = (await this.instance.post('/api/v2/questions', question)).data
    return newQuestion as COTQuestion
  }
  public async patchQuestion(questionID: ObjectId, question: Omit<Partial<COTQuestion>, '_id'|'identifier'>) {
    const updatedQuestion = (await this.instance.patch(`/api/v2/questions/${questionID}`, question)).data
    return updatedQuestion
  }
  public async JSONPatchQuestion(questionID: ObjectId, body: JSONPatchBody) {
    const updatedQuestion = (await this.instance.patch(`/api/v2/questions/jsonpatch/${questionID}`, body)).data
    return updatedQuestion
  }
  /* COTAnswer */
  public async getAnswer(answerId: ObjectId): Promise<COTAnswer> {
    return (await this.instance.get<{data:COTAnswer}>(`/api/v2/answers/${answerId}`))?.data
  }
  public async getChannelAnswers(surveyId: ObjectId, channelId: ObjectId): Promise<COTAnswer[]> {
    const data = {
      query: {
          "channel": channelId
      },
      queryType: "find"
    }
    const url = `/api/answers/find/${surveyId}`
    return (await this.instance.post(url, data)).data
  }

  /* COTTask */
  public async getTask<T extends COTTask>(taskId: ObjectId, taskGroupId: ObjectId): Promise<COTTask> {
    return (await this.instance.get<T>(`/api/tasks/${taskGroupId}/task/${taskId}`))
  }
  public async getTaskBySerial(taskSerial: number, taskGroupId: ObjectId): Promise<COTTask> {
    return (await this.instance.get<COTTask>(`/api/tasks/${taskGroupId}/task/serial/${taskSerial}`))
  }
  public async patchTask(taskId: ObjectId, taskGroupId: ObjectId, body: COTTaskPatchData): Promise<COTTask> {
    return (await this.instance.patch<{task: COTTask}>(`/api/tasks/${taskGroupId}/task/${taskId}`, body)).task
  }
  public async findTasks<T extends COTTask>(taskGroupId: ObjectId, query: COTTaskQuery): Promise<T[]> {
    return (await this.instance.post<T[]>(`/api/tasks/${taskGroupId}/task/all`, query))
  }
  public async postTask<T extends COTTask>(taskData: COTTaskPostData): Promise<T> {
    return (await this.instance.post<{task: T}>(`/api/tasks/${taskData.taskGroup}/task/create?requiredSurvey=false`, taskData)).task
  }

  public async patchMultiTasks(taskGroupId: ObjectId, body: {cmd: {method: string, task: COTTask}[]}): Promise<COTTask[]> {
    return (await this.instance.post<COTTask[]>(`/api/tasks/${taskGroupId}/task/multi`, body))
  }
  public async getTasksSMStateChanges(taskId: ObjectId, taskGroupId: ObjectId): Promise<any> {
    return (await this.instance.get(`/api/v2/task-groups/${taskGroupId}/tasks/${taskId}/sm-state-changes?limit=100`))?.data?.values ?? []
  }

  public async getStateChanges(taskId: ObjectId, taskGroupId: ObjectId) : Promise<SMStateChange[]> {
    return (await this.instance.get(`/api/v2/task-groups/${taskGroupId}/tasks/${taskId}/sm-state-changes?limit=100`)).data?.values
  }

  /* Filter Tasks */
  public async queryTasksFilter(taskGroupId: string, filterId: string, options?: queryTaskFilterOptions): Promise<FilteredTasks[]> {
    const qParams: Partial<Record<keyof queryTaskFilterOptions, string>> = {}
    if (options) {
      if (options.limit) qParams.limit = String(options.limit)
      if (options.limitBy) qParams.limitBy = options.limitBy
    }
    const queryParams = (options && new URLSearchParams(qParams).toString()) || {}
    return (await this.instance.get<FilteredTasks[]>(`/api/tasks/${taskGroupId}/task?filter=${filterId}&${queryParams}`))
  }

  /* Users */
  public async getUsersByAccessRole(role: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, users: COTUser[] } }>(
        `/api/v2/users?accessRole=${role}&count=true&limit=100&page=${page}&isActive=true`)) 
      users.push(...response.data.users)
      count = response.data.count 
      page++
    } while(users.length < count)
    return users
  }

  public async getUsersByRelation(type: string, _id: ObjectId): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, users: COTUser[] } }>(
        `/api/v2/users/relations/${type}/${_id}?count=true&limit=100&page=${page}&isActive=true`)) 
      users.push(...response.data.users)
      count = response.data.count 
      page++
    } while(users.length < count)
    return users
  }
  public async getUser(_id: ObjectId): Promise<COTUser> {
    return (await this.instance.get(`/api/v2/users/${_id}`)).data
  }

  public async findUsers(query): Promise<COTUser[]> {
    return await this.instance.post(`/api/users/find?allFields=true`, {
      "companies.companyId": "627400d234b48d5b6667db18",
      isActive: true,
      ... query
    })
  }

  public async getBossUsers(userId: ObjectId): Promise<COTUser[]> {
    return (await this.instance.get(`/api/v2/users?relatedUser=${userId}`)).data?.users ?? []
  }

  public async getUsersByJob(job: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, users: COTUser[] } }>(
        `/api/v2/users?job=${job}&count=true&limit=100&page=${page}&isActive=true`)) 
      users.push(...response.data.users)
      count = response.data.count 
      page++
    } while(users.length < count)
    return users
  }

  public async getUsersByEmail(email: string): Promise<COTUser> {
    return (await this.instance.get(`/api/v2/users?email=${email}`))?.data?.users[0]
  }

  public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
    return (await this.instance.get(`/api/v2/user-activities/${_id}`)).data
  }

  public static async getUserMe(token: string): Promise<COTUser> {
    try {
      const _token = token.replace(/^Bearer /, '')
      const data = await authAPI.getME(_token)
      return data
    }
    catch (error) {
      console.log(error);
    }
  }

  public async jsonPatchUser<T extends COTUser>(userId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/users/jsonpatch/${userId}`, body)).data
  }

  public async getSubordiantes(user: COTUser): Promise<COTUser[]> {
    const ids = user.companies[0].hierarchy.subordinate
    return await this.getUsersById(ids)
  }
  public async getUsersById(ids: ObjectId[]): Promise<COTUser[]> {
    const limit = 30
    const chunks = []
    for(let i = 0; i < ids.length; i+=limit) {
      chunks.push(ids.slice(i,i+limit))
    }

    const results = await Promise.all(chunks.map( async (idChunk) => {
      const qParams = querystring.encode({ id: idChunk, limit })
      const response = await this.instance.get(`/api/v2/users?${qParams}`)
      return response?.data?.users ?? []
    }));
  
    return results.flat()
  }
  /* smStates */
  public async getSmStates(taskGroup: ObjectId): Promise<COTSMState[]> {
    return (await this.instance.get(`/api/v1/tasks/${taskGroup}/sm/smstate/all`))
  }

  /* channels */
  public async createChannel<T extends COTChannel>(body: COTChannelPostBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v2/channels', body)).data
  }
  public async getAllChannelsByGroup(group: ObjectId): Promise<COTChannel[]> {
    let count = true
    let page = 1
    let channels = []
    let totalCount = 0
    do {
      const query = { group, count, page, limit: 1000 }
      const response = (await this.instance.get(`/api/v2/channels?${querystring.encode(query)}`)).data
      if (!response) break
      channels = channels.concat(response.channels ?? [])
      if (!totalCount && response.count) {
        totalCount = response.count
        count = false
      }
      page++
    } while (channels.length < totalCount);
    return channels
  }

  /* jobTitles: Any porque no parece que este la interfaz de cotjobtitle */ 
  public async getAllJobTitles(): Promise <any[]> {
    let page = 1;
    let jobTitles = [];

    while ( true ) {
      const response = await this.instance.get(
        `/api/v2/jobtitles?page=${page}&limit=200`);
      const pageJobtitles = response.data.values;

      if ( !pageJobtitles.length ) {
        return jobTitles;
      };

      jobTitles = jobTitles.concat( pageJobtitles );
      page = page + 1;
    } 
  };

  /* messages */
  public async sendMessage<T>(body: SendMsgBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v1/messages', body)).data
  }
  public async getMessages(channel: ObjectId, modifiedAt?: Date) {
    const dateStr = (modifiedAt ?? addDays(new Date(),-1)).toISOString()
    const url = `/api/v1/messages/channel/${channel}/modified/${dateStr}`
    return (await this.instance.get(url)) 
  }

  /* files */
  public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
    return (await this._filesAPI.getFileObjectById(fileId))
  }
  public async getChannelFiles(channelId: ObjectId, contentType: 'image'|'video'|'document'): Promise<COTFile[]> {
    return (await this._filesAPI.getChannelFiles(channelId, contentType))
  }
  public async uploadFile(data: Buffer, filename: string): Promise<COTFile> {
    return (await this._filesAPI.uploadFile(data, filename))
  }

  // return all accessroles
  public async getAllAccessRoles(): Promise<COTAccessRole[]> {
    let page = 1;
    let accessRoles = [];

    while ( true ) {
      const response = await this.instance.get(
        `/api/v2/accessroles?page=${page}&limit=1000`);
      const pageAccessroles = response.data.accessRoles;
      
      if ( !pageAccessroles.length ) {
        return accessRoles;
      };

      accessRoles = accessRoles.concat( pageAccessroles );
      page = page + 1;
    } 
  };
}

export const cotalkerAPI = new CotalkerAPI()