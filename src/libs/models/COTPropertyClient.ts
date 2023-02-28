import { IsActiveOptions, JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTProperty, PropertiesQueryParams, propertiesQueryParams } from '@customTypes/COTTypes/COTProperty'
import { ObjectId } from '@customTypes/custom'
import { QueryHandler } from '@utils/QueryHandler'
import { queryValidator } from '@utils/QueryValidator'
import { AxiosInstance } from 'axios'
import { URLSearchParams } from 'url'

export default class COTPropertyClient {
  protected readonly _instance: AxiosInstance

  private queryHandler

  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('properties', this._instance)

  }

  public async getPropertiesQuery(query: PropertiesQueryParams): Promise<unknown[]> {
    queryValidator(propertiesQueryParams, query)
    return (await this.queryHandler.getQuery(query)).properties[0]
  }

  public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
    return (await this._instance.get<{ data: T }>(`/api/v2/properties/${_id}`)).data
  }

  public async getPropertyByCode<T extends COTProperty>(code: string): Promise<T> {
    return (await this._instance.get(`/api/v2/properties/code/${code}`)).data
  }

  public async getSubproperties<T extends COTProperty>(property: ObjectId | COTProperty, isActive?: IsActiveOptions): Promise<T[]> {
    if (typeof property === 'string') {
      return (await this._instance.get<{ data: { properties: T[] } }>(
        `/api/v2/properties/relations?property=${property}&relation=child&isActive=${isActive ?? 'all'}`,
      )).data?.properties
    }
    if (!property.subproperty?.length) return []
    const qParams = new URLSearchParams({ ids: property.subproperty, limit: '100' })
    return (await this._instance.get<{ data: { properties: T[] } }>(
      `/api/v2/properties?${qParams.toString()}`,
    )).data?.properties
  }

  public async postProperty<T extends COTProperty>(property: COTProperty): Promise<T> {
    return (await this._instance.post<{ data: T }>('/api/v2/properties', property)).data
  }

  public async patchProperty<T extends COTProperty>(propertyId: ObjectId, body: Partial<COTProperty>): Promise<T> {
    return (await this._instance.patch<{ data: T }>(`/api/v2/properties/${propertyId}`, body)).data
  }

  public async jsonPatchProperty<T extends COTProperty>(propertyId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this._instance.patch<{ data: T }>(`/api/v2/properties/jsonpatch/${propertyId}`, body)).data
  }
}
