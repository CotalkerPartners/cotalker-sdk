import { genericQueryParams, ObjectId, objectId } from '@customTypes/custom'
import { z } from 'zod'

export declare interface COTAccessRole {
  _id: ObjectId;
  active: boolean;
  permissions: string[];
  name: string;
  description: string;
  company: ObjectId;
}

const accessRolesQueryParamsSpecific = z.object({
  ids: objectId,
  search: z.string(),
  debug: z.literal('true'),
}).partial().strict()

export const accessRolesQueryParams = accessRolesQueryParamsSpecific.merge(genericQueryParams)
export type AccessRolesQueryParams = z.infer<typeof accessRolesQueryParams>
