import {
	dateQueryParams,
	genericQueryParams,
	ObjectId,
	objectId
} from "@customTypes/custom";
import { z } from "zod";

export interface COTPropertyType {
	_id: ObjectId;
	code: string;
	company: string;
	createdAt: string;
	isActive: boolean;
	modifiedAt: string;
	display: string;
	schemaNodes: COTPropertyTypeSchemaNode[];
	viewPermissions: string[];
}

export interface COTPropertyTypeSchemaNode {
	validators: COTPropertyTypeValidator;
	isArray: boolean;
	weight: number;
	isActive: boolean;
	key: string;
	display: string;
	description: string;
	basicType: string;
	subType: string;
}

export interface COTPropertyTypeValidator {
	required: boolean;
}

const propertyTypesQueryParamsSpecific = z
	.object({
		search: z.string(),
		orderBy: z.string(),
		sortBy: z.string(),
		propertyTypes: z.array(z.string()),
		codes: z.string().or(z.array(z.string())),
		ids: z.string().or(z.array(objectId)),
		viewPermissions: z.boolean(),
		debug: z.literal("true")
	})
	.partial()
	.strict();

export const propertyTypesQueryParams = propertyTypesQueryParamsSpecific
	.merge(genericQueryParams)
	.merge(dateQueryParams);

export type PropertyTypesQueryParams = z.infer<typeof propertyTypesQueryParams>;
