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

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
		this.queryHandler = new QueryHandler("users", this.axiosInstance);
	}

	public async getUsersQuery(query: UsersQueryParams): Promise<COTUser[]> {
		queryValidator(usersQueryParams, query);
		return (await this.queryHandler.getQuery(query)).users;
	}

	public async getAllUsersInQuery(
		query: UsersQueryParams
	): Promise<COTUser[]> {
		queryValidator(usersQueryParams, query);
		return this.queryHandler.getAllInQuery(query);
	}

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

	public async getUsersByEmail(email: string[] | string): Promise<COTUser[]> {
		return this.getAllUsersInQuery({ email });
	}

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

	public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
		return (await this.axiosInstance.get(`/api/v2/user-activities/${_id}`))
			.data;
	}

	public async getSubordinates(user: COTUser): Promise<COTUser[]> {
		const qParams = querystring.encode({
			id: user.companies[0].hierarchy.subordinate,
			limit: "100"
		});
		return (await this.axiosInstance.get(`/api/v2/users?${qParams}`)).data
			.users;
	}

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

	public async findUsers(query): Promise<COTUser[]> {
		return this.axiosInstance.post(`/api/users/find?allFields=true`, {
			"companies.companyId": "627400d234b48d5b6667db18",
			isActive: true,
			...query
		});
	}

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
