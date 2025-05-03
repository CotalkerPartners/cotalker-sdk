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
 * Client to handle property-related operations through the Cotalker API.
 * Supports fetching, creating, updating and searching properties.
 */
export default class COTPropertyClient {
	private readonly AxiosInstance: AxiosInstance;

	/**
	 * Creates an instance of COTPropertyClient.
	 * @param instance - Configured Axios instance with authentication.
	 */
	constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
	}

	/**
	 * Retrieves a property by its ID.
	 * @param _id - The ObjectId of the property.
	 * @returns A promise that resolves to the property.
	 */
	public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
		return (
			await this.AxiosInstance.get<{ data: T }>(
				`/api/v2/properties/${_id}`
			)
		).data;
	}

	/**
	 * Retrieves a property by its code.
	 * @param code - The code assigned to the property.
	 * @returns A promise that resolves to the property.
	 */
	public async getPropertyByCode<T extends COTProperty>(
		code: string
	): Promise<T> {
		return (
			await this.AxiosInstance.get<{ data: T }>(
				`/api/v2/properties/code/${code}`
			)
		).data;
	}

	/**
	 * Creates a new property.
	 * @param property - Property body to be posted.
	 * @param debug - If true, activates debug mode (optional).
	 * @returns A promise that resolves to the created property.
	 */
	public async postProperty<T extends COTProperty>(
		property: COTPropertyPostBody,
		debug = false
	): Promise<T> {
		return (
			await this.AxiosInstance.post<{ data: T }>(
				`/api/v2/properties?debug=${debug}`,
				property
			)
		).data;
	}

	/**
	 * Updates a property using a partial property object.
	 * @param propertyId - The ID of the property to update.
	 * @param body - Partial property object with updated fields.
	 * @returns A promise that resolves to the updated property.
	 */
	public async patchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: Partial<COTProperty>
	): Promise<T> {
		return (
			await this.AxiosInstance.patch<{ data: T }>(
				`/api/v2/properties/${propertyId}`,
				body
			)
		).data;
	}

	/**
	 * Applies a JSON patch to a property.
	 * @param propertyId - The ID of the property to patch.
	 * @param body - A JSON Patch body.
	 * @returns A promise that resolves to the updated property.
	 */
	public async jsonPatchProperty<T extends COTProperty>(
		propertyId: ObjectId,
		body: JSONPatchBody
	): Promise<T> {
		return (
			await this.AxiosInstance.patch<{ data: T }>(
				`/api/v2/properties/jsonpatch/${propertyId}`,
				body
			)
		).data;
	}

	/**
	 * Retrieves all properties of a given type.
	 * @param propertyType - The type of the properties to retrieve.
	 * @returns A promise that resolves to an array of properties.
	 */
	public async getAllFromPropertyType<T extends COTProperty>(
		propertyType: string
	): Promise<T[]> {
		let count = 1;
		let page = 1;
		const properties: T[] = [];
		do {
			const response = await this.AxiosInstance.get<{
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

	/**
	 * Retrieves an extension property related to a task.
	 * @param taskId - The ID of the task.
	 * @param extensionKey - The extension key used to identify the property type.
	 * @returns A promise that resolves to the found extension property.
	 * @throws Error if no extension property is found.
	 */
	public async getExtensionProperty<T extends COTProperty>(
		taskId: ObjectId,
		extensionKey: string
	): Promise<T> {
		const { data } = await this.AxiosInstance.get<{
			data: { properties: T[] };
		}>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`);
		if (data?.properties?.[0]) return data.properties[0];
		throw new Error("No extension property found");
	}

	/**
	 * Searches properties by a search string and optional filters.
	 * @param search - Search query string.
	 * @param propertyType - Optional property type to filter results.
	 * @param options - Additional search options.
	 * @returns A promise that resolves to an array of matching properties.
	 */
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
				await this.AxiosInstance.get<{ data: { properties: T[] } }>(
					`/api/v2/properties?${queryStr}`
				)
			).data?.properties ?? []
		);
	}

	/**
	 * Retrieves all subproperties of a given property.
	 * @param property - The parent property ID or object.
	 * @param isActive - Whether to include active/inactive/all subproperties.
	 * @returns A promise that resolves to an array of subproperties.
	 */
	public async getSubproperties<T extends COTProperty>(
		property: ObjectId | COTProperty,
		isActive: IsActiveOptions = "all"
	): Promise<T[]> {
		if (typeof property === "string") {
			return (
				await this.AxiosInstance.get<{ data: { properties: T[] } }>(
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
			await this.AxiosInstance.get<{ data: { properties: T[] } }>(
				`/api/v2/properties?${queryStr}`
			)
		).data.properties;
	}

	/**
	 * Retrieves the properties assigned to a specific user.
	 * @param user - The user whose properties should be retrieved.
	 * @returns A promise that resolves to an array of user properties.
	 */
	public async getUserProperties(user: COTUser): Promise<COTProperty[]> {
		const propertyIds = user.properties ?? [];
		if (!propertyIds.length) return [];
		const qParams = querystring.encode({ ids: propertyIds, limit: "1000" });
		return (
			await this.AxiosInstance.get<{
				data: { properties: COTProperty[] };
			}>(`/api/v2/properties?${qParams}`)
		).data.properties;
	}
}
