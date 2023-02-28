import { COTFileUploaded } from '@customTypes/COTTypes/COTFile'
import { ObjectId } from '@customTypes/custom'
import { AxiosInstance } from 'axios'

export default class COTFileClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
    const file = await this._instance.get(`/api/v3/media/file/${fileId}`)
    return file
  }
}
