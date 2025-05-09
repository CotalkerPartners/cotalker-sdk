import { COTSMState } from "@customTypes/COTTypes/COTSMState";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";

/**
 * Client for interacting with SMState-related endpoints.
 */
export default class COTSMStateClient {
	protected readonly AxiosInstance: AxiosInstance;

	/**
	 * Initializes a new instance of the COTSMStateClient.
	 * @param instance - The configured Axios instance to use for requests.
	 */
	public constructor(instance: AxiosInstance) {
		this.AxiosInstance = instance;
	}

	/**
	 * Retrieves all SMState entries associated with a specific task group.
	 * @param taskGroup - The ID of the task group.
	 * @returns A list of SMState objects.
	 */
	public async getSmStates(taskGroup: ObjectId): Promise<COTSMState[]> {
		const smState = await this.AxiosInstance.get(
			`/api/v1/tasks/${taskGroup}/sm/smstate/all`
		);
		return smState;
	}
}
