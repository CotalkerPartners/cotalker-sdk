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

export interface State {
	_id: string;
	property: {
		_id: string;
		name: string;
		translations?: Record<string, string>;
	};
	stateMachine: string;
	subtask?: any;
	next?: any[];
}

/**
 * Managing tasks through the API.
 */
export default class COTTaskClient {
	protected readonly axiosInstance: AxiosInstance;

	/**
	 * Constructs a new instance of the COTTaskClient.
	 * @param instance Axios instance used for HTTP requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.axiosInstance = instance;
	}

	/**
	 * Retrieves a task by ID or serial number within a task group.
	 * @param params Object containing either taskId or taskSerial.
	 * @param taskGroupId The ID of the task group.
	 * @returns The matched task or undefined if not found.
	 */
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

	public async getTasksGroupedByProperty(
		filters: Record<string, any>,
		taskGroupId: string,
		groupBy: string
	): Promise<any[]> {
		const response = await this.axiosInstance.post(
			`/api/tasks/${taskGroupId}/task/group`,
			{
				filters,
				groupBy
			}
		);
		return response?.data?.tasks ?? [];
	}

	/**
	 * Retrieves filtered tasks by filter ID and optional query options.
	 * @param taskGroupId The ID of the task group.
	 * @param filterId The filter ID to apply.
	 * @param options Optional limit and limitBy parameters.
	 * @returns An array of filtered tasks.
	 */
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

	/**
	 * Updates a task with new data.
	 * @param taskId The ID of the task to update.
	 * @param taskGroupId The task group the task belongs to.
	 * @param body Patch data for the task.
	 * @returns The updated task or undefined if the operation failed.
	 */
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

	/**
	 * Retrieves tasks filtered by standard parameters like assignedTo, state, etc.
	 * @param filters Filters for retrieving tasks (assignedTo, state, etc.)
	 * @param taskGroupId Optional task group ID (if known). If not provided, throws.
	 */
	/*
	public async getTasks(
		query: COTTaskQuery,
		taskGroupId: string
	): Promise<COTTask[]> {
		const response = await this.axiosInstance.post(
			`/api/tasks/${taskGroupId}/task`,
			query
		);
		return response?.data?.tasks ?? [];
	}*/
	public async getTasks(
		filters: Record<string, any>,
		taskGroupId: string
	): Promise<COTTask[]> {
		const limit = 1000;
		let page = 1;
		const allTasks: COTTask[] = [];

		try {
			let hasMore = true;

			do {
				const response = await this.axiosInstance.get(
					`/api/v2/task-groups/${taskGroupId}/tasks`,
					{
						params: {
							limit,
							page,
							isActive: true,
							orderBy: "desc",
							...filters
						}
					}
				);

				const rawData = response.data;
				const data = rawData?.data || rawData; // por si "data" viene al nivel superior
				const values: COTTask[] = data?.values ?? [];

				console.debug(`📦 Página ${page}: ${values.length} tareas`);
				allTasks.push(...values);

				hasMore = values.length === limit;
				page++;
			} while (hasMore);

			console.debug(`✅ Total tareas encontradas: ${allTasks.length}`);
			return allTasks;
		} catch (error) {
			console.error("❌ Error en getTasks:", error?.message || error);
			return [];
		}
	}

	public async getStates(taskGroupId: string): Promise<State[]> {
		try {
			const response = await this.axiosInstance.get(
				`/api/tasks/${taskGroupId}/sm/smstate/`
			);
			//console.debug("📦 Estados recibidos del endpoint:", response);

			return response;
		} catch (error) {
			console.error("Error al obtener estados del taskGroup:", error);
			return [];
		}
	}

	/**
	 * Finds multiple tasks by query within a task group.
	 * @param taskGroupId The ID of the task group.
	 * @param query Query parameters to filter tasks.
	 * @returns An array of matched tasks.
	 */
	public async findTasks<T extends COTTask>(
		taskGroupId: ObjectId,
		query: COTTaskQuery
	): Promise<T[]> {
		const task = await this.axiosInstance.post<T[]>(
			`/api/tasks/${taskGroupId}/task/`,
			query
		);
		return task;
	}

	/**
	 * Creates a new task.
	 * @param taskData The data used to create the task.
	 * @returns The newly created task.
	 */
	public async postTask<T extends COTTask>(
		taskData: COTTaskPostData
	): Promise<T> {
		const { task } = await this.axiosInstance.post<{ task: T }>(
			`/api/tasks/${taskData.taskGroup}/task/create?requiredSurvey=false`,
			taskData
		);
		return task;
	}

	/**
	 * Updates multiple tasks at once.
	 * @param taskGroupId The ID of the task group.
	 * @param body Data for batch updating multiple tasks.
	 * @returns An array of updated tasks.
	 */
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

	/**
	 * Gets the state machine (SM) state changes for a specific task.
	 * @param taskId The ID of the task.
	 * @param taskGroupId The ID of the task group.
	 * @returns An array of state change values or an empty array if none found.
	 */
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

	/**
	 * Gets the next possible state transitions for a task.
	 * @param taskGroupId The ID of the task group.
	 * @param taskId The ID of the task.
	 * @returns An array of the next possible state machine states.
	 */
	public async getNextSmStates(
		taskGroupId: ObjectId,
		taskId: ObjectId
	): Promise<[]> {
		return this.axiosInstance.get(
			`/api/tasks/${taskGroupId}/sm/nextsmstate?taskId=${taskId}`
		);
	}
}
