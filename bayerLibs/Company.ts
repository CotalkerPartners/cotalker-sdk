import * as company_config from "../data/company-config.json";

type smConfig = {
	_id: string;
	name: string;
	smStates: Record<string, string>;
	stateProperties: Record<string, string>;
	taskGroupId: string;
	groupId: string;
};
type systemUserConfig = {
	_id: string;
	email: string;
};
type groupConfig = {
	_id: string;
	code: string;
	number: number;
};

export default class CompanyConfig {
	_id: string;
	subdomain: string;
	stateMachines: Record<keyof typeof company_config.stateMachines, smConfig>;
	surveys: Record<keyof typeof company_config.surveys, string | string[]>;
	accessRoles: Record<keyof typeof company_config.accessRoles, string>;
	messages: Record<keyof typeof company_config.messages, string>;
	properties: Record<
		keyof typeof company_config.properties,
		Record<string, string>
	>;
	jobTitles: Record<keyof typeof company_config.jobTitles, string[]>;
	systemUser: systemUserConfig;
	adminUser: systemUserConfig;
	groups: Record<keyof typeof company_config.groups, groupConfig> = {};
	private static _instance: CompanyConfig;
	private constructor(json: typeof company_config) {
		this._id = json._id;
		this.subdomain = json.subdomain;
		this.surveys = json.surveys;
		this.stateMachines = json.stateMachines;
		this.accessRoles = json.accessRoles;
		this.messages = json.messages;
		this.properties = json.properties;
		this.jobTitles = json.jobTitles;
		this.systemUser = json.systemUser;
		this.adminUser = json.adminUser;
	}
	private static from(json: typeof company_config) {
		console.info(`...Initalizing Company 🏢 ${json.subdomain} - ${json._id}`);
		return new CompanyConfig(json);
	}
	public static getInstance(): CompanyConfig {
		if (!this._instance) this._instance = CompanyConfig.from(company_config);
		return this._instance;
	}
}
