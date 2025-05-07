import {
	dateQueryParams,
	genericQueryParams,
	ObjectId,
	objectId
} from "@customTypes/custom";
import { z } from "zod";

export declare interface COTChannel {
	_id: ObjectId;
	group: ObjectId;
	nameCode: string;
	nameDisplay: string;
	userIds: string[];
}

const channelsQueryParamsSpecific = z
	.object({
		search: z.string(),
		orderBy: z.string(),
		sortBy: z.string(),
		group: objectId,
		user: objectId,
		userIsAdmin: z.boolean(),
		directChannels: z.string(),
		debug: z.literal("true")
	})
	.partial()
	.strict();

<<<<<<< HEAD
const channelsQuery = z.object({
	extra: z.array(z.string().optional()),
	user: z.array(objectId.optional()),
	survey: objectId,
	surveyIds: z.array(objectId),
	properties: z.array(objectId),
	answerUuids: z.array(objectId),
	modifiedAtGte: z.string().optional(),
	modifiedAtLte: z.string().optional(),
	fullMatchProperties: z.boolean().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	count: z.boolean(),
	ordenBy: z.string().optional(),
	sortBy: z.string().optional(),
	debug: z.string().optional()
});
export const channelsQueryParams = channelsQueryParamsSpecific
	.merge(genericQueryParams)
	.merge(dateQueryParams);
export type ChannelsQueryParams = z.infer<typeof channelsQuery>;
=======
export const channelsQueryParams = channelsQueryParamsSpecific
	.merge(genericQueryParams)
	.merge(dateQueryParams);
export type ChannelsQueryParams = z.infer<typeof channelsQueryParams>;
>>>>>>> feature/AssistantClient
export type COTChannelPostBody = Omit<COTChannel, "_id">;
