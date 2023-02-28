import { dateQueryParams, genericQueryParams, ObjectId, objectId } from '@customTypes/custom'
import { z } from 'zod'

export declare interface COTProperty {
  _id: ObjectId;
  subproperty: ObjectId[];
  name: { code: string; display: string };
  createdAt: string;
  modifiedAt: string;
  propertyType: string;
  extra?: Record<string, unknown>;
  schemaInstance?: Record<string, unknown>;
  owner?: Record<string, string>;
}

export interface SearchPropertyQueryOptions {
  parent?: string | string[];
}

const propertiesQueryParamsSpecific = z.object({
  search: z.string(),
  orderBy: z.string(),
  sortBy: z.string(),
  propertyTypes: z.array(z.string()),
  codes: z.array(z.string()),
  'owner[$ref]': z.union([z.literal('user'), z.literal('task')]),
  'owner[$id]': objectId,
  ids: objectId,
  parent: objectId,
  debug: z.literal('true'),
}).partial().strict()

export const propertiesQueryParams = propertiesQueryParamsSpecific.merge(genericQueryParams).merge(dateQueryParams)
export type PropertiesQueryParams = z.infer<typeof propertiesQueryParams>
