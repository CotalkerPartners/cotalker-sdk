import {
	COTProperty,
	SearchPropertyQueryOptions
} from "@customTypes/COTTypes/COTProperty";
import {
	COTPropertyType,
	PropertyTypesQueryParams,
	propertyTypesQueryParams
} from "@customTypes/COTTypes/COTPropertyType";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";
import { URLSearchParams } from "url";

/**
 * Client for handling property type operations through the Cotalker API.
 * This client allows fetching property types by ID or code, executing validated queries,
 * and retrieving related properties.
 */
export default class COTPropertyTypeClient {
	protected readonly AxiosInstance: AxiosInstance;

	private queryHandler;

	/**
	 * Constructs an instance of COTPropertyTypeClient.
	 * @param instance - A configured Axios instance with authentication headers.
	 */
	public constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
		this.queryHandler = new QueryHandler(
			"propertyTypes",
			this.AxiosInstance
		);
	}

	/**
	 * Fetches a single property type using validated query parameters.
	 * @param query - Parameters to filter property types.
	 * @returns A promise that resolves to a COTPropertyType object.
	 */
	public async getPropertyTypeQuery(
		query: PropertyTypesQueryParams
	): Promise<COTPropertyType> {
		queryValidator(propertyTypesQueryParams, query);
		return (await this.queryHandler.getQuery(query)).propertyTypes[0];
	}

	/**
	 * Fetches all property types that match the provided validated query.
	 * @param query - Query parameters to filter property types.
	 * @returns A promise that resolves to an array of property types.
	 */
	public async getAllPropertyTypesInQuery(
		query: PropertyTypesQueryParams
	): Promise<COTPropertyType[]> {
		queryValidator(propertyTypesQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

	/**
	 * Retrieves a property type by its unique code.
	 * @param code - The code assigned to the property type.
	 * @returns A promise that resolves to the corresponding property type.
	 */
	public async getPropertyTypeByCode<T extends COTPropertyType>(
		code: string
	): Promise<T> {
		return (
			await this.AxiosInstance.get(`/api/v2/propertyTypes/code/${code}`)
		).data;
	}

	/**
	 * Retrieves a property type by its ID.
	 * @param _id - The ID of the property type.
	 * @returns A promise that resolves to the corresponding property type.
	 */
	public async getPropertyTypeById<T extends COTPropertyType>(
		_id: string
	): Promise<T> {
		return (await this.AxiosInstance.get(`/api/v2/propertyTypes/${_id}`))
			.data;
	}

	/**
	 * Retrieves all properties associated with a specific property type.
	 * @param propertyType - The property type identifier.
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
	 * Retrieves an extension property related to a specific task.
	 * @param taskId - The ID of the task associated with the extension.
	 * @param extensionKey - The property type key of the extension.
	 * @returns A promise that resolves to the extension property.
	 * @throws If no property is found or the response is invalid.
	 */
	public async getExtensionProperty<T extends COTProperty>(
		taskId: ObjectId,
		extensionKey: string
	) {
		const { data } = await this.AxiosInstance.get<{ data: T }>(
			`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`
		);
		if (Array.isArray(data) && data[0]) return data[0];
		throw new Error("Oops. Something went wrong");
	}

	/**
	 * Searches properties based on a search term, with optional filters.
	 * @param search - The search keyword to match against properties.
	 * @param propertyType - (Optional) Filter by property type.
	 * @param options - (Optional) Additional search parameters.
	 * @returns A promise that resolves to an array of matched properties.
	 */
	public async searchProperty<T extends COTProperty>(
		search: string,
		propertyType?: string,
		options?: SearchPropertyQueryOptions
	): Promise<T> {
		const query: Record<string, string | string[]> = {
			search,
			...(options ?? {})
		};
		if (propertyType) query.propertyTypes = propertyType;
		return (
			(
				await this.AxiosInstance.get(
					`/api/v2/properties?${new URLSearchParams(query).toString()}`
				)
			).data?.properties ?? []
		);
	}
}
