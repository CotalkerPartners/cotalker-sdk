import { COTProperty, SearchPropertyQueryOptions } from '@customTypes/COTTypes/COTProperty'
import { COTPropertyType, PropertyTypesQueryParams, propertyTypesQueryParams } from '@customTypes/COTTypes/COTPropertyType'
import { ObjectId } from '@customTypes/custom'
import { QueryHandler } from '@utils/QueryHandler'
import { queryValidator } from '@utils/QueryValidator'
import { AxiosInstance } from 'axios'
import { URLSearchParams } from 'url'

export default class COTPropertyTypeClient {
  protected readonly _instance: AxiosInstance

  private queryHandler

  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('propertyTypes', this._instance)
  }

  public async getPropertyTypeQuery(query: PropertyTypesQueryParams): Promise<COTPropertyType> {
    queryValidator(propertyTypesQueryParams, query)
    return (await this.queryHandler.getQuery(query)).propertyTypes[0]
  }

  public async getAllPropertyTypesInQuery(query:PropertyTypesQueryParams): Promise<COTPropertyType[]> {
    queryValidator(propertyTypesQueryParams, query)
    return this.queryHandler.getAllInQuery(query)
  }

  public async getPropertyTypeByCode<T extends COTPropertyType>(code: string): Promise<T> {
    return (await this._instance.get(`/api/v2/propertyTypes/code/${code}`)).data
  }

  public async getPropertyTypeById<T extends COTPropertyType>(_id: string): Promise<T> {
    return (await this._instance.get(`/api/v2/propertyTypes/${_id}`)).data
  }

  public async getAllFromPropertyType<T extends COTProperty>(propertyType: string): Promise <T[]> {
    let count = 1
    let page = 1
    const properties: T[] = []
    do {
      const response = (await this._instance.get<{ data: { count: number; properties: T[] } }>(
        `/api/v2/properties?page=${page}&propertyTypes=${propertyType}&limit=100&isActive=true&count=true`,
      ))
      properties.push(...(response.data?.properties ?? []))
      count = response.data?.count ?? properties.length
      page += 1
    } while (properties.length < count)
    return properties
  }

  public async getExtensionProperty<T extends COTProperty>(taskId: ObjectId, extensionKey: string) {
    const { data } = (await this._instance.get<{ data: T }>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`))
    if (Array.isArray(data) && data[0]) return data[0]
    throw new Error('Oops. Something went wrong')
  }

  public async searchProperty<T extends COTProperty>(
    search: string,
    propertyType?: string,
    options?: SearchPropertyQueryOptions,
  ): Promise<T> {
    const query: Record<string, string | string[]> = { search, ...(options ?? {}) }
    if (propertyType) query.propertyTypes = propertyType
    return (await this._instance.get(`/api/v2/properties?${new URLSearchParams(query).toString()}`)).data?.properties ?? []
  }
}
