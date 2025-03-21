import {
	COTProperty,
	COTPropertyPostBody
} from "@customTypes/COTTypes/COTProperty";

import { COTPropertyType } from "@customTypes/COTTypes/COTPropertyType";
import { ObjectId } from "@customTypes/custom";

import { cotalkerAPI } from "./CotalkerAPI";

export type JSONPatchBody = {
	op: "add" | "remove" | "replace" | "move" | "copy" | "test";
	path: `/${string}`;
	value?: unknown;
}[];

type IsActiveOptions = "true" | "false" | "all";

type SearchPropertyQueryOptions = {
	parent?: string | string[];
	limit?: number;
};

export const propertiesAPI = {
	async getProperty<T extends COTProperty>(propertyId: ObjectId): Promise<T> {
		return cotalkerAPI.getProperty(propertyId);
	},

	async getPropertyByCode<T extends COTProperty>(code: string): Promise<T> {
		return cotalkerAPI.getPropertyByCode(code);
	},

	async getPropertiesByIds<T extends COTProperty>(
		propertyIds: ObjectId[],
		propertyType: string,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		const result = [];
		for (let i = 0; i < propertyIds.length; i += 50) {
			const ids = propertyIds.slice(i, i + 50);
			const chunk =
				(await cotalkerAPI.getPropertiesByIds(
					ids,
					propertyType,
					isActive
				)) ?? [];
			result.push(...chunk);
		}
		return result;
	},

	async getSubproperties<T extends COTProperty>(
		property: ObjectId | COTProperty,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		return cotalkerAPI.getSubproperties(property, isActive);
	},

	async postProperty<T extends COTProperty>(
		property: COTPropertyPostBody
	): Promise<T> {
		return cotalkerAPI.postProperty(property);
	},

	async patchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: Partial<COTProperty>
	): Promise<T> {
		return cotalkerAPI.patchProperty(propertyId, body);
	},

	async jsonPatchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: JSONPatchBody
	): Promise<T> {
		return cotalkerAPI.jsonPatchProperty(propertyId, body);
	},

	async getAllFromPropertyType<T extends COTProperty>(
		propertyType: string
	): Promise<T[]> {
		return cotalkerAPI.getAllFromPropertyType(propertyType);
	},

	async searchProperty<T extends COTProperty>(
		search: string,
		propertyType?: string,
		options?: SearchPropertyQueryOptions
	): Promise<T[]> {
		return cotalkerAPI.searchProperty(search, propertyType, options);
	},

	async getPropertyTypeByCode<T extends COTPropertyType>(
		code: string
	): Promise<T> {
		return cotalkerAPI.getPropertyTypeByCode(code);
	},

	async searchPropertyType(search: string): Promise<COTPropertyType[]> {
		return cotalkerAPI.searchPropertyType(search);
	},

	async getExtensionProperty<T extends COTProperty>(
		taskId: ObjectId,
		extensionKey: string
	): Promise<T> {
		return cotalkerAPI.getExtensionProperty(taskId, extensionKey);
	}
};
