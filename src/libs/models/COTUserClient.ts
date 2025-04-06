import { JSONPatchBody } from "@customTypes/COTTypes/APIGenerics";
import {
	COTUser,
	COTUserActivity,
	UsersQueryParams,
	usersQueryParams
} from "@customTypes/COTTypes/COTUser";
import { ObjectId } from "@customTypes/custom";
import { QueryHandler } from "@utils/QueryHandler";
import { queryValidator } from "@utils/QueryValidator";
import { AxiosInstance } from "axios";
import * as querystring from "querystring";

/**
 * Manages user-related requests.
 */
export type AllowedRelation =
	| "boss"
	| "peers"
	| "subordinate"
	| "property"
	| "accessrole"
	| "relateduser";

export default class COTUserClient {
	protected readonly axiosInstance: AxiosInstance;

	private queryHandler;

	/**
	 * Constructs a new instance of the COTUserClient.
	 * @param instance Axios instance used for HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("users", this.axiosInstance);
	}

	/**
	 * Gets users based on query parameters
	 * @param query Query parameters for filtering users
	 * @returns Promise that resolves to an array of users
	 */

	public async getUsersQuery(query: UsersQueryParams): Promise<COTUser[]> {
		queryValidator(usersQueryParams, query);
		return (await this.queryHandler.getQuery(query)).users;
	}

	/**
	 * Gets all users that match the query parameters
	 * @param query Query parameters to filter users
	 * @returns Promise that resolves to an array of all matching users
	 */
	public async getAllUsersInQuery(
		query: UsersQueryParams
	): Promise<COTUser[]> {
		queryValidator(usersQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

	/**
	 * Gets users by job ID
	 * @param job Job ID
	 * @returns Promise that resolves to an array of users with that job
	 */
	public async getUsersByJob(job: ObjectId): Promise<COTUser[]> {
		let count = 1;
		let page = 1;
		const users: COTUser[] = [];
		do {
			const response = await this.axiosInstance.get<{
				data: { count: number; users: COTUser[] };
			}>(
				`/api/v2/users?job=${job}&count=true&limit=100&page=${page}&isActive=true`
			);
			users.push(...response.data.users);
			count = response.data.count;
			page++;
		} while (users.length < count);
		return users;
	}

	/**
	 * Gets users by email address
	 * @param email Email or array of emails to search for
	 * @returns Promise that resolves to an array of users with those emails
	 */
	public async getUsersByEmail(email: string[] | string): Promise<COTUser[]> {
		return this.getAllUsersInQuery({ email });
	}

	/**
	 * Gets users by relationship
	 * @param type Allowed relationship type
	 * @param _id ID of the related object
	 * @returns Promise that resolves to an array of users with that relationship
	 */
	public async getUsersByRelation(
		type: AllowedRelation,
		_id: ObjectId
	): Promise<COTUser[]> {
		return (
			(
				await this.axiosInstance.get(
					`/api/v2/users/relations/${type}/${_id}?limit=100&isActive=true`
				)
			)?.data?.users ?? ""
		);
	}

	/**
	 * Gets a user's activity
	 * @param _id User ID
	 * @returns Promise that resolves to the user's activity
	 */
	public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
		return (await this.axiosInstance.get(`/api/v2/user-activities/${_id}`))
			.data;
	}

	/**
	 * Applies JSON Patch operations to a user
	 * @param userId ID of the user to modify
	 * @param body Body with the JSON Patch operations
	 * @returns Promise that resolves to the modified user
	 */
	public async jsonPatchUser<T extends COTUser>(
		userId: ObjectId,
		body: JSONPatchBody
	): Promise<T> {
		return (
			await this.axiosInstance.patch<{ data: T }>(
				`/api/v2/users/jsonpatch/${userId}`,
				body
			)
		).data;
	}

	/**
	 * Gets users by their IDs
	 * @param ids Array of user IDs
	 * @returns Promise that resolves to an array of found users
	 */
	public async getUsersById(ids: ObjectId[]): Promise<COTUser[]> {
		const limit = 30;
		const chunks = [];
		for (let i = 0; i < ids.length; i += limit) {
			chunks.push(ids.slice(i, i + limit));
		}

		const results = await Promise.all(
			chunks.map(async (idChunk) => {
				const qParams = querystring.encode({ id: idChunk, limit });
				const response = await this.axiosInstance.get(
					`/api/v2/users?${qParams}`
				);
				return response?.data?.users ?? [];
			})
		);

		return results.flat();
	}

	/**
	 * Search for users with a custom query
	 * @param query Object with the search parameters
	 * @returns Promise that resolves to an array of found users
	 */
	public async findUsers(query): Promise<COTUser[]> {
		return this.axiosInstance.post(`/api/users/find?allFields=true`, {
			"companies.companyId": "627400d234b48d5b6667db18",
			isActive: true,
			...query
		});
	}

	/**
	 * Gets a user's superior users (bosses)
	 * @param userId User ID
	 * @returns Promise that resolves to an array of superior users
	 */
	public async getBossUsers(userId: ObjectId): Promise<COTUser[]> {
		return (
			(
				await this.axiosInstance.get(
					`/api/v2/users?relatedUser=${userId}`
				)
			).data?.users ?? []
		);
	}
}
