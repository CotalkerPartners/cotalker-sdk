import {
	AccessRolesQueryParams,
	accessRolesQueryParams,
	COTAccessRole
} from "@customTypes/COTTypes/COTAccessRole";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";

/**
 * Client for handling access roles through the API.
 */
export default class COTAccessRolesClient {
	protected readonly AxiosInstance: AxiosInstance;

	private queryHandler;

	/**
	 * Creates an instance of the access roles client.
	 * @param instance - The Axios instance used to perform HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
		this.queryHandler = new QueryHandler("accessroles", this.AxiosInstance);
	}

	/**
	 * Retrieves a list of access roles based on provided query parameters.
	 * @param query - The query parameters used to filter access roles.
	 * @returns A promise that resolves to an array of access roles.
	 */
	public async getAccessRoleQuery(
		query: AccessRolesQueryParams
	): Promise<COTAccessRole[]> {
		queryValidator(accessRolesQueryParams, query);
		return (await this.queryHandler.getQuery(query)).accessRoles;
	}

	/**
	 * Retrieves all access roles that match the query parameters, handling pagination internally.
	 * @param query - The query parameters used to fetch all matching access roles.
	 * @returns A promise that resolves to an array of all matching access roles.
	 */
	public async getAllAccessRolesInQuery(
		query: AccessRolesQueryParams
	): Promise<COTAccessRole[]> {
		queryValidator(accessRolesQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

	/**
	 * Searches access roles by a given text string.
	 * @param search - The search string to filter access roles.
	 * @returns A promise that resolves to an array of access roles that match the search.
	 */
	public async searchAccessRoles(search: string): Promise<COTAccessRole[]> {
		return this.getAccessRoleQuery({ search });
	}

	/**
	 * Retrieves all available access roles without applying any filters.
	 * @returns A promise that resolves to an array of all access roles.
	 */
	public async getAccessRoles(): Promise<COTAccessRole[]> {
		return (await this.AxiosInstance.get("api/v2/accessroles?limit=100"))
			.data;
	}
}
