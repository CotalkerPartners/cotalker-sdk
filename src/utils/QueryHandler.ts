/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'

type AllowedEntities = 'properties' | 'propertyTypes' | 'users' | 'surveys' | 'answers' | 'channels' | 'accessroles' | 'accessRoles' 

type CotalkerQueryAPIResponse<T> = {
  [K in AllowedEntities]: T[]
} & { count: number }

const isInvalidQueryValue = qVal => ([null, undefined, ''].includes(qVal))

export class QueryHandler<T> { 

  protected readonly instance: AxiosInstance

  entity: AllowedEntities
  
  public constructor(_entity, _instance:AxiosInstance) {
    this.instance = _instance 
    this.entity = _entity
  }

  public async getQuery(query): Promise<CotalkerQueryAPIResponse<T>> {
    const queryEntries = Object.entries(query)
    const invalidEntry = queryEntries.find(([_, v])=>isInvalidQueryValue(v))
    if (invalidEntry) {

      console.info(`Invalid empty query value for key ${invalidEntry[0]} in GET /${this.entity}`)
    }
    const response = (await this.instance.get(`/api/v2/${this.entity}?${querystring.encode(query)}`))?.data
    return response as CotalkerQueryAPIResponse<T>
  }

  public async getAllInQuery(query): Promise<T[]>  {
    const paginationQuery = {
      ...query, page: 1, limit: 100, count: true,
    }
    let count = 0
    const result: T[] = []
    do {
      const response = await this.getQuery(paginationQuery)
      count = response[count]
      result.push(...(response[this.entity] || []))
      paginationQuery.page++
      paginationQuery.count = false
    } while (result.length < count)
    return result
  }
}
