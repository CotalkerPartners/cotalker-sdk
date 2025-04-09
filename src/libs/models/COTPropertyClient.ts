import {
	IsActiveOptions,
	JSONPatchBody
} from "@customTypes/COTTypes/APIGenerics";
import {
	COTProperty,
	COTPropertyPostBody,
	SearchPropertyQueryOptions
} from "@customTypes/COTTypes/COTProperty";
import { COTUser } from "@customTypes/COTTypes/COTUser";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";
import * as querystring from "querystring";
import { URLSearchParams } from "url";

/**
 * Handling channel-related operations.
 * Uses Axios to make HTTP requests to the backend.
 */
export default class COTPropertyClient {
	private readonly _instance: AxiosInstance;

	constructor(instance: AxiosInstance) {
		this._instance = instance;
	}

	public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
		return (
			await this._instance.get<{ data: T }>(`/api/v2/properties/${_id}`)
		).data;
	}

	public async getPropertyByCode<T extends COTProperty>(
		code: string
	): Promise<T> {
		return (
			await this._instance.get<{ data: T }>(
				`/api/v2/properties/code/${code}`
			)
		).data;
	}

	public async postProperty<T extends COTProperty>(
		property: COTPropertyPostBody,
		debug = false
	): Promise<T> {
		return (
			await this._instance.post<{ data: T }>(
				`/api/v2/properties?debug=${debug}`,
				property
			)
		).data;
	}

	public async patchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: Partial<COTProperty>
	): Promise<T> {
		return (
			await this._instance.patch<{ data: T }>(
				`/api/v2/properties/${propertyId}`,
				body
			)
		).data;
	}

	public async jsonPatchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: JSONPatchBody
	): Promise<T> {
		return (
			await this._instance.patch<{ data: T }>(
				`/api/v2/properties/jsonpatch/${propertyId}`,
				body
			)
		).data;
	}

	public async getAllFromPropertyType<T extends COTProperty>(
		propertyType: string
	): Promise<T[]> {
		let count = 1;
		let page = 1;
		const properties: T[] = [];
		do {
			const response = await this._instance.get<{
				data: { count: number; properties: T[] };
			}>(
				`/api/v2/properties?page=${page}&propertyTypes=${propertyType}&limit=100&isActive=true&count=true`
			);
			properties.push(...(response.data?.properties ?? []));
			count = response.data?.count ?? properties.length;
			page += 1;
		} while (properties.length < count);
		return properties;
	}

	public async getExtensionProperty<T extends COTProperty>(
		taskId: ObjectId,
		extensionKey: string
	): Promise<T> {
		const { data } = await this._instance.get<{
			data: { properties: T[] };
		}>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`);
		if (data?.properties?.[0]) return data.properties[0];
		throw new Error("No extension property found");
	}

	public async searchProperty<T extends COTProperty>(
		search: string,
		propertyType?: string,
		options?: SearchPropertyQueryOptions
	): Promise<T[]> {
		const query: Record<string, string | string[]> = {
			search,
			...(options ?? {})
		};
		if (propertyType) query.propertyTypes = propertyType;
		const queryStr = new URLSearchParams(
			query as Record<string, string>
		).toString();
		return (
			(
				await this._instance.get<{ data: { properties: T[] } }>(
					`/api/v2/properties?${queryStr}`
				)
			).data?.properties ?? []
		);
	}

	public async getSubproperties<T extends COTProperty>(
		property: ObjectId | COTProperty,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		if (typeof property === "string") {
			return (
				await this._instance.get<{ data: { properties: T[] } }>(
					`/api/v2/properties/relations?property=${property}&relation=child&isActive=${isActive}`
				)
			).data.properties;
		}
		if (!property.subproperty?.length) return [];
		const queryStr = querystring.encode({
			ids: property.subproperty,
			limit: 1000
		});
		return (
			await this._instance.get<{ data: { properties: T[] } }>(
				`/api/v2/properties?${queryStr}`
			)
		).data.properties;
	}

	public async getUserProperties(user: COTUser): Promise<COTProperty[]> {
		const propertyIds = user.properties ?? [];
		if (!propertyIds.length) return [];
		const qParams = querystring.encode({ ids: propertyIds, limit: "1000" });
		return (
			await this._instance.get<{ data: { properties: COTProperty[] } }>(
				`/api/v2/properties?${qParams}`
			)
		).data.properties;
	}
}
