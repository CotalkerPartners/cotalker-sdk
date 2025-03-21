import { answersAPI } from "./Answer";
import { propertiesAPI } from "./Properties";

import { ObjectId } from "@customTypes/custom";
import {
	COTProperty,
	COTPropertyPostBody
} from "@customTypes/COTTypes/COTProperty";

import { COTPropertyType } from "@customTypes/COTTypes/COTPropertyType";
import { COTUser } from "@customTypes/COTTypes/COTUser";
import HttpClient from "@utils/HttpClient";

type IsActiveOptions = "true" | "false" | "all";
type JSONPatchBody = {
	op: "add" | "remove" | "replace" | "move" | "copy" | "test";
	path: `/${string}`;
	value?: unknown;
}[];
type SearchPropertyQueryOptions = {
	parent?: string | string[];
	limit?: number;
};

export class CotalkerAPI extends HttpClient {
	private _cotalkerToken: string;
	constructor(token?: string, baseURL?: string) {
		const resolveBaseURL = CotalkerAPI._resolveBaseURL(baseURL);
		super(resolveBaseURL, true);
		this._cotalkerToken = (
			token ??
			process.env.COTALKER_TOKEN ??
			""
		).replace(/^(Bearer|UServices) /g, "");
		this.instance.defaults.headers.common["Authorization"] =
			`Bearer ${this._cotalkerToken}`;
	}

	private static _resolveBaseURL(baseURL?: string): string {
		if (process.env.CORE_INTERNAL_SERVICE_HOST) {
			return `http://${process.env.CORE_INTERNAL_SERVICE_HOST}:${process.env.CORE_INTERNAL_SERVICE_PORT}`;
		}
		return (
			baseURL || process.env.BASE_URL || "https://staging.cotalker.com"
		);
	}

	// ANSWERS
	public async getAnswer(answerId: ObjectId) {
		return answersAPI.getAnswer(answerId);
	}

	public async getUser(userId: ObjectId): Promise<COTUser> {
		return answersAPI.getUser(userId);
	}

	// PROPERTIES

	public async getProperty<T extends COTProperty>(
		propertyId: ObjectId
	): Promise<T> {
		return propertiesAPI.getProperty(propertyId);
	}

	public async getPropertyByCode<T extends COTProperty>(
		code: string
	): Promise<T> {
		return propertiesAPI.getPropertyByCode(code);
	}

	public async getPropertiesByIds<T extends COTProperty>(
		propertyIds: ObjectId[],
		propertyType: string,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		return propertiesAPI.getPropertiesByIds(
			propertyIds,
			propertyType,
			isActive
		);
	}

	public async getSubproperties<T extends COTProperty>(
		property: ObjectId | COTProperty,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		return propertiesAPI.getSubproperties(property, isActive);
	}

	public async postProperty<T extends COTProperty>(
		property: COTPropertyPostBody
	): Promise<T> {
		return propertiesAPI.postProperty(property);
	}

	public async patchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: Partial<COTProperty>
	): Promise<T> {
		return propertiesAPI.patchProperty(propertyId, body);
	}

	public async jsonPatchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: JSONPatchBody
	): Promise<T> {
		return propertiesAPI.jsonPatchProperty(propertyId, body);
	}

	public async getAllFromPropertyType<T extends COTProperty>(
		propertyType: string
	): Promise<T[]> {
		return propertiesAPI.getAllFromPropertyType(propertyType);
	}

	public async searchProperty<T extends COTProperty>(
		search: string,
		propertyType?: string,
		options?: SearchPropertyQueryOptions
	): Promise<T[]> {
		return propertiesAPI.searchProperty(search, propertyType, options);
	}

	public async getPropertyTypeByCode<T extends COTPropertyType>(
		code: string
	): Promise<T> {
		return propertiesAPI.getPropertyTypeByCode(code);
	}

	public async searchPropertyType(
		search: string
	): Promise<COTPropertyType[]> {
		return propertiesAPI.searchPropertyType(search);
	}

	public async getExtensionProperty<T extends COTProperty>(
		taskId: ObjectId,
		extensionKey: string
	): Promise<T> {
		return propertiesAPI.getExtensionProperty(taskId, extensionKey);
	}
}

// ✅ Instancia exportada para usar globalmente
export const cotalkerAPI = new CotalkerAPI();
