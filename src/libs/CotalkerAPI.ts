/* eslint-disable no-param-reassign */
import {
	IsActiveOptions,
	JSONPatchBody
} from "@customTypes/COTTypes/APIGenerics";
import { AccessRolesQueryParams } from "@customTypes/COTTypes/COTAccessRole";
import { AnswersQueryParams } from "@customTypes/COTTypes/COTAnswer";
import {
	ChannelsQueryParams,
	COTChannel
} from "@customTypes/COTTypes/COTChannel";
import { EditMsgBody, SendMsgBody } from "@customTypes/COTTypes/COTMessage";
import {
	COTProperty,
	PropertiesQueryParams,
	SearchPropertyQueryOptions
} from "@customTypes/COTTypes/COTProperty";
import { PropertyTypesQueryParams } from "@customTypes/COTTypes/COTPropertyType";
import { SurveysQueryParams } from "@customTypes/COTTypes/COTSurvey";
import {
	COTTaskPatchData,
	COTTaskPostData,
	COTTaskQuery,
	MultiTaskBody,
	QueryTaskFilterOptions
} from "@customTypes/COTTypes/COTTask";
import { ScheduleBody } from "@customTypes/COTTypes/scheduler";
import { ObjectId } from "@customTypes/custom";
import COTTaskClient from "@libs/models/COTTaskClient";
import COTUserClient, { AllowedRelation } from "@libs/models/COTUserClient";
import COTAnswerClient from "@models/COTAnswerClient";
import COTChannelClient from "@models/COTChannelClient";
import COTFileClient from "@models/COTFileClient";
import COTMessageClient from "@models/COTMessageClient";
import COTPropertyClient from "@models/COTPropertyClient";
import COTPropertyTypeClient from "@models/COTPropertyTypeClient";
import COTSchedulerClient from "@models/COTSchedulerClient";
import COTSMStateClient from "@models/COTSMStateClient";
import COTSurveyClient from "@models/COTSurveyClient";
import COTTaskClient from "@models/COTTaskClient";
import COTUserClient from "@models/COTUserClient";
import HttpClient from "@utils/HttpClient";
import { InternalAxiosRequestConfig } from "axios";

import COTAccessRolesClient from "./models/COTAccessRolesClient";

export class CotalkerAPI extends HttpClient {
	private _cotfileClient: COTFileClient;

	private _cottaskClient: COTTaskClient;

	private _cotuserClient: COTUserClient;

	private _cotsurveyClient: COTSurveyClient;

	private _cotanswerClient: COTAnswerClient;

	private _cotmessageClient: COTMessageClient;

	private _cotchannelClient: COTChannelClient;

	private _cotsmStateClient: COTSMStateClient;

	private _cotpropertyClient: COTPropertyClient;

	private _cotschedulerClient: COTSchedulerClient;

	private _cotaccessRolesClient: COTAccessRolesClient;

	private _cotpropertyTypeClient: COTPropertyTypeClient;

	private _cotalkerToken: string;

	public constructor(token: string, baseURL?: string) {
		super(baseURL ?? "https://staging.cotalker.com", false);
		this._cotalkerToken = (
			token ??
			process.env.COTALKER_TOKEN ??
			""
		).replace(/^Bearer /g, "");
		this._initializeRequestInterceptor();
		this._cotfileClient = new COTFileClient(this.instance);
		this._cottaskClient = new COTTaskClient(this.instance);
		this._cotuserClient = new COTUserClient(this.instance);
		this._cotsurveyClient = new COTSurveyClient(this.instance);
		this._cotanswerClient = new COTAnswerClient(this.instance);
		this._cotmessageClient = new COTMessageClient(this.instance);
		this._cotchannelClient = new COTChannelClient(this.instance);
		this._cotsmStateClient = new COTSMStateClient(this.instance);
		this._cotpropertyClient = new COTPropertyClient(this.instance);
		this._cotschedulerClient = new COTSchedulerClient(this.instance);
		this._cotaccessRolesClient = new COTAccessRolesClient(this.instance);
		this._cotpropertyTypeClient = new COTPropertyTypeClient(this.instance);
	}

	private readonly _initializeRequestInterceptor = () => {
		this.instance.interceptors.request.use(
			this._handleRequest,
			this._handleError
		);
	};

	// eslint-disable-next-line require-await, @typescript-eslint/require-await
	private readonly _handleRequest = async (
		config: InternalAxiosRequestConfig
	) => {
		if (!config.headers) return;
		config.headers.Authorization = `Bearer ${this._cotalkerToken}`;
		config.headers["Content-Type"] = "application/json";
		config.headers.admin = "true";
		// eslint-disable-next-line consistent-return
		return config;
	};

	/* COTLogin*/
	static async login(email: string, password: string): Promise<string> {
		return (
			await super.post<{ token: string }>(
				`${process.env.BASE_URL}/auth/local`,
				{ "Content-Type": "application/json" },
				{ email, password }
			)
		).token;
	}

	/* COTScheduler*/
	async runSchedule(body: ScheduleBody) {
		const schedule = await this._cotschedulerClient.runSchedule(body);
		return schedule;
	}

	async postSchedule(body: ScheduleBody) {
		const schedule = await this._cotschedulerClient.postSchedule(body);
		return schedule;
	}

	/* COTAnswer */
	async getAnswer(answerId: ObjectId) {
		const answer = await this._cotanswerClient.getAnswer(answerId);
		return answer;
	}

	/* COTAccessRole */
	async searchAccessRole(search: string) {
		const accessRole =
			await this._cotaccessRolesClient.searchAccessRoles(search);
		return accessRole;
	}

	getCOTTaskClient(): COTTaskClient {
		return this._cottaskClient;
	}

	/* COTUser */

	getCOTUserClient(): COTUserClient {
		return this._cotuserClient;
	}

	/* COTSMStates */
	async getSmStates(taskGroup: ObjectId) {
		const smState = await this._cotsmStateClient.getSmStates(taskGroup);
		return smState;
	}

	/* COTChannels */
	getCOTChannelClient(): COTChannelClient {
		return this._cotchannelClient;
	}

	getCOTFileClient(): COTFileClient {
		return this._cotfileClient;
	}

	/* COTMessages */
	async sendMessage(body: SendMsgBody) {
		const message = await this._cotmessageClient.sendMessage(body);
		return message;
	}

	async removeMessage(_messageId: ObjectId) {
		const message = await this._cotmessageClient.removeMessage(_messageId);
		return message;
	}

	async editMessage(_messageId: ObjectId, body: EditMsgBody) {
		const message = await this._cotmessageClient.editMessage(
			_messageId,
			body
		);
		return message;
	}

	/* COTSurvey */
	getCOTSurveyClient(): COTSurveyClient {
		return this._cotsurveyClient;
	}

	/* COTProperty */
	async getProperty(id: ObjectId) {
		const property = await this._cotpropertyClient.getProperty(id);
		return property;
	}

	async getPropertyByCode(code: string) {
		const property = await this._cotpropertyClient.getPropertyByCode(code);
		return property;
	}

	async getSubproperties(
		property: COTProperty | COTProperty,
		isActive?: IsActiveOptions
	) {
		const subproperty = await this._cotpropertyClient.getSubproperties(
			property,
			isActive
		);
		return subproperty;
	}

	async postPropety(_property: COTProperty) {
		const property = await this._cotpropertyClient.postProperty(_property);
		return property;
	}

	async patchPropety(propertyId: ObjectId, body: Partial<COTProperty>) {
		const property = await this._cotpropertyClient.patchProperty(
			propertyId,
			body
		);
		return property;
	}

	async jsonPatchPropety(propertyId: ObjectId, body: JSONPatchBody) {
		const property = await this._cotpropertyClient.jsonPatchProperty(
			propertyId,
			body
		);
		return property;
	}

	/* COTPropertyType */

	async getPropertyTypeByCode(code: string) {
		const property =
			await this._cotpropertyTypeClient.getPropertyTypeByCode(code);
		return property;
	}

	async getAllFromPropertyType(propertyType: string) {
		const property =
			await this._cotpropertyTypeClient.getAllFromPropertyType(
				propertyType
			);
		return property;
	}

	async getExtensionProperty(taskId: ObjectId, extensionKey: string) {
		const property = await this._cotpropertyTypeClient.getExtensionProperty(
			taskId,
			extensionKey
		);
		return property;
	}

	async searchProperty(
		search: string,
		propertyType?: string,
		options?: SearchPropertyQueryOptions
	) {
		const property = await this._cotpropertyTypeClient.searchProperty(
			search,
			propertyType,
			options
		);
		return property;
	}

	/* QUERIES */

	//accessRoles
	async getAccessRoleQuery(query: AccessRolesQueryParams) {
		const accessRoles =
			await this._cotaccessRolesClient.getAccessRoleQuery(query);
		return accessRoles;
	}

	async getAllAccessRolesInQuery(query: AccessRolesQueryParams) {
		const accessRoles =
			await this._cotaccessRolesClient.getAllAccessRolesInQuery(query);
		return accessRoles;
	}

	//channels

	//properties
	async getPropertiesQuery(query: PropertiesQueryParams) {
		const property =
			await this._cotpropertyClient.getPropertiesQuery(query);
		return property;
	}

	//propertyTypes
	async getPropertyTypeQuery(query: PropertyTypesQueryParams) {
		const property =
			await this._cotpropertyTypeClient.getPropertyTypeQuery(query);
		return property;
	}

	async getAllPropertyTypesInQuery(query: PropertyTypesQueryParams) {
		const property =
			await this._cotpropertyTypeClient.getAllPropertyTypesInQuery(query);
		return property;
	}

	//users

	//answers
	async getAnswersQuery(query: AnswersQueryParams) {
		const answers = await this._cotanswerClient.getAnswersQuery(query);
		return answers;
	}
}
