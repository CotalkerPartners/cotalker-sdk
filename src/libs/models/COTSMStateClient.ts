import { COTSMState } from '@customTypes/COTTypes/COTSMState'
import { ObjectId } from '@customTypes/custom'
import { AxiosInstance } from 'axios'

export default class COTSMStateClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getSmStates(taskGroup: ObjectId): Promise<COTSMState[]> {
    const smState = await (this._instance.get(`/api/v1/tasks/${taskGroup}/sm/smstate/all`))
    return smState
  }
}
