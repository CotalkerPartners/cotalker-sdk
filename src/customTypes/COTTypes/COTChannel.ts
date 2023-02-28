import { dateQueryParams, genericQueryParams, ObjectId, objectId } from '@customTypes/custom'
import { z } from 'zod'

export declare interface COTChannel {
  _id: ObjectId;
  group: ObjectId;
  nameCode: string;
  nameDisplay: string;
  userIds: string[];
}

const channelsQueryParamsSpecific = z.object({
  search: z.string(),
  orderBy: z.string(),
  sortBy: z.string(),
  group: objectId,
  user: objectId,
  userIsAdmin: z.boolean(),
  directChannels: z.string(),
  debug: z.literal('true'),
}).partial().strict()

export const channelsQueryParams = channelsQueryParamsSpecific.merge(genericQueryParams).merge(dateQueryParams)
export type ChannelsQueryParams = z.infer<typeof channelsQueryParams>
