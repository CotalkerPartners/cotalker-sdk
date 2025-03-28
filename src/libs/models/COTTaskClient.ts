import {
	COTTask,
	COTTaskPatchData,
	COTTaskPostData,
	COTTaskQuery,
	FilteredTasks,
	MultiTaskBody,
	QueryTaskFilterOptions
} from "@customTypes/COTTypes/COTTask";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";

export default class COTTaskClient {
	protected readonly axiosInstance: AxiosInstance;

	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	public async getTask(
		params: { taskId: ObjectId } | { taskSerial: number },
		taskGroupId: ObjectId
	): Promise<COTTask> {
		try {
			let endpoint: string;

			if ("taskId" in params) {
				endpoint = `/api/tasks/${taskGroupId}/task/${params.taskId}`;
			} else {
				endpoint = `/api/tasks/${taskGroupId}/task/serial/${params.taskSerial}`;
			}
			return await this.axiosInstance.get<COTTask>(endpoint);
		} catch (error) {
			return;
		}
	}

	public async queryTasksFilter(
		taskGroupId: string,
		filterId: string,
		options?: QueryTaskFilterOptions
	): Promise<FilteredTasks[]> {
		const qParams: Partial<Record<keyof QueryTaskFilterOptions, string>> =
			{};
		if (options) {
			if (options.limit) qParams.limit = String(options.limit);
			if (options.limitBy) qParams.limitBy = options.limitBy;
		}
		const queryParams =
			(options && new URLSearchParams(qParams).toString()) || {};
		const task = await this.axiosInstance.get<FilteredTasks[]>(
			`/api/tasks/${taskGroupId}/task?filter=${filterId}&${queryParams}`
		);
		return task;
	}

	public async patchTask(
		taskId: ObjectId,
		taskGroupId: ObjectId,
		body: COTTaskPatchData
	): Promise<COTTask> {
		try {
			return await this.axiosInstance.patch<COTTask>(
				`/api/tasks/${taskGroupId}/task/${taskId}`,
				body
			);
		} catch (error) {
			return;
		}
	}

	public async findTasks<T extends COTTask>(
		taskGroupId: ObjectId,
		query: COTTaskQuery
	): Promise<T[]> {
		const task = await this.axiosInstance.post<T[]>(
			`/api/tasks/${taskGroupId}/task/all`,
			query
		);
		return task;
	}

	public async postTask<T extends COTTask>(
		taskData: COTTaskPostData
	): Promise<T> {
		const { task } = await this.axiosInstance.post<{ task: T }>(
			`/api/tasks/${taskData.taskGroup}/task/create?requiredSurvey=false`,
			taskData
		);
		return task;
	}

	public async patchMultiTasks(
		taskGroupId: ObjectId,
		body: MultiTaskBody
	): Promise<COTTask[]> {
		const task = await this.axiosInstance.post<COTTask[]>(
			`/api/tasks/${taskGroupId}/task/multi`,
			body
		);
		return task;
	}

	public async getTasksSMStateChanges(
		taskId: string,
		taskGroupId: string
	): Promise<any> {
		return (
			(
				await this.axiosInstance.get(
					`/api/v2/task-groups/${taskGroupId}/tasks/${taskId}/sm-state-changes`
				)
			)?.data?.values ?? []
		);
	}

	public async getNextSmStates(
		taskGroupId: ObjectId,
		taskId: ObjectId
	): Promise<[]> {
		return this.axiosInstance.get(
			`/api/tasks/${taskGroupId}/sm/nextsmstate?taskId=${taskId}`
		);
	}
}
