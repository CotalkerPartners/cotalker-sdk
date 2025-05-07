/* eslint-disable no-param-reassign */
import COTAccessRolesClient from "@models/COTAccessRolesClient";
import COTAnswerClient from "@models/COTAnswerClient";
import { COTAssistantClient } from "@models/COTAssistantClient";
import COTBotClient from "@models/COTBotClient";
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

export class CotalkerAPI extends HttpClient {
	private _cotfileClient: COTFileClient;

	private _cottaskClient: COTTaskClient;

	private _cotuserClient: COTUserClient;

	private _cotsurveyClient: COTSurveyClient;

	private _cotassistantClient: COTAssistantClient;

	private _cotbotClient: COTBotClient;

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
		this._cotbotClient = new COTBotClient(this.instance);
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

	getCOTSchedulerClient(): COTSchedulerClient {
		return this._cotschedulerClient;
	}

	/* COTAccessRole */

	getCOTAccessRolesClient(): COTAccessRolesClient {
		return this._cotaccessRolesClient;
	}

	/* COTAnswerClient */

	getCOTAnswerClient(): COTAnswerClient {
		return this._cotanswerClient;
	}

	/* COTTaskClient */

	getCOTTaskClient(): COTTaskClient {
		return this._cottaskClient;
	}

	public getCOTAssistantClient(taskGroupId?: string): COTAssistantClient {
		const resolvedTaskGroupId = taskGroupId ?? process.env.TASK_GROUP_ID;
		const openaiKey = process.env.OPENAI_API_KEY;

		if (!resolvedTaskGroupId) {
			throw new Error(
				"Falta el taskGroupId para inicializar COTAssistantClient."
			);
		}

		if (!openaiKey) {
			throw new Error(
				"Falta OPENAI_API_KEY en las variables de entorno."
			);
		}

		if (!this._cotassistantClient) {
			this._cotassistantClient = new COTAssistantClient(this, {
				taskGroupId: resolvedTaskGroupId,
				openaiKey: openaiKey
			});
		}

		return this._cotassistantClient;
	}

	/* COTUser */
	getCOTUserClient(): COTUserClient {
		return this._cotuserClient;
	}

	/* COTSMStates */

	getCOTSMStateClient(): COTSMStateClient {
		return this._cotsmStateClient;
	}

	/* COTChannels */
	getCOTChannelClient(): COTChannelClient {
		return this._cotchannelClient;
	}

	getCOTFileClient(): COTFileClient {
		return this._cotfileClient;
	}

	/* COTMessages */
	getCOTMesaggeClient(): COTMessageClient {
		return this._cotmessageClient;
	}

	/* COTProperty */
	getCOTPropertyClient(): COTPropertyClient {
		return this._cotpropertyClient;
	}

	/* QUERIES */

	getCOTPropertyTypeClient(): COTPropertyTypeClient {
		return this._cotpropertyTypeClient;
	}

	//COTSurveyClient

	getCOTSurveyClient(): COTSurveyClient {
		return this._cotsurveyClient;
	}

	// COTBotClient

	getCOTBotClient(): COTBotClient {
		return this._cotbotClient;
	}
}
