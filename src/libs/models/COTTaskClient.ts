import { COTTask, COTTaskPatchData, COTTaskPostData, COTTaskQuery,
  FilteredTasks, MultiTaskBody, QueryTaskFilterOptions } from '@customTypes/COTTypes/COTTask'
import { ObjectId } from '@customTypes/custom'
import { AxiosInstance } from 'axios'

export default class COTTaskClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }
  
  public async getTask<T extends COTTask>(taskId: ObjectId, taskGroupId: ObjectId): Promise<COTTask> {
    const task = await (this._instance.get<T>(`/api/tasks/${taskGroupId}/task/${taskId}`))
    return task
  }
  
  public async getTaskBySerial(taskSerial: number, taskGroupId: ObjectId): Promise<COTTask> {
    const task = await (this._instance.get<COTTask>(`/api/tasks/${taskGroupId}/task/serial/${taskSerial}`))
    return task
  }

  public async queryTasksFilter(taskGroupId: string, filterId: string, options?: QueryTaskFilterOptions): Promise<FilteredTasks[]> {
    const qParams: Partial<Record<keyof QueryTaskFilterOptions, string>> = {}
    if (options) {
      if (options.limit) qParams.limit = String(options.limit)
      if (options.limitBy) qParams.limitBy = options.limitBy
    }
    const queryParams = (options && new URLSearchParams(qParams).toString()) || {}
    const task = await (this._instance.get<FilteredTasks[]>(`/api/tasks/${taskGroupId}/task?filter=${filterId}&${queryParams}`))
    return task
  }

  public async patchTask(taskId: ObjectId, taskGroupId: ObjectId, body: COTTaskPatchData): Promise<COTTask> {
    const task = await (this._instance.patch<COTTask>(`/api/tasks/${taskGroupId}/task/${taskId}`, body))
    return task
  }

  public async findTasks<T extends COTTask>(taskGroupId: ObjectId, query: COTTaskQuery): Promise<T[]> {
    const task = await (this._instance.post<T[]>(`/api/tasks/${taskGroupId}/task/all`, query))
    return task 
  }

  public async postTask<T extends COTTask>(taskData: COTTaskPostData): Promise<T> {
    const { task } = await this._instance.post<{ task: T }>(
      `/api/tasks/${taskData.taskGroup}/task/create?requiredSurvey=false`,
      taskData,
    )
    return task
  }

  public async patchMultiTasks(taskGroupId: ObjectId, body: MultiTaskBody): Promise<COTTask[]> {
    const task = await (this._instance.post<COTTask[]>(`/api/tasks/${taskGroupId}/task/multi`, body))
    return task
  }
}
