import { COTUser } from "@customTypes/COTTypes/COTUser";

// Interfaces incluidas directamente en el archivo
export interface CotalkerApi {
	me(token: string): Promise<CotalkerUser>;
	getUserById(userId: string): Promise<COTUser>;
}

export interface CotalkerUser {
	_id: string;
	name: Name;
	notifications: Notifications;
	devices: Devices;
	lastLocation: LastLocation;
	properties: string[];
	accessRoles: string[];
	permissions: any[];
	emailIsVerified: boolean;
	requiredChanges: any[];
	isPhoneVerified: boolean;
	isActive: boolean;
	isReadOnly: boolean;
	termsConditions: boolean;
	search: string[];
	isOnline: boolean;
	role: string;
	needPasswordChange: boolean;
	hierarchyLevel: string;
	taskManager: boolean;
	email: string;
	phone: string;
	companies: CompanyElement[];
	messagesUnread: any[];
	lastRequestDate: Date;
	createdAt: Date;
	modifiedAt: Date;
	badge: any[];
	profileInfo: any[];
	provider: string;
	__v: number;
	avatar: Avatar;
	extra: Extra;
	job: string;
	jobTitle: string;
	settings: Settings;
	permissionsV2: string[];
	allAccessRoles: string[];
	company: PurpleCompany;
}

interface Avatar {
	small: string;
	original: string;
	square: string;
}

interface CompanyElement {
	hierarchy: Hierarchy;
	_id: string;
	companyId: string;
}

interface Hierarchy {
	boss: any[];
	peers: any[];
	subordinate: any[];
}

interface PurpleCompany {
	_id: string;
	displayName: string;
	legalName: string;
	branding: Branding;
	permissions: Permissions;
	isActive: boolean;
	plan: string;
	hierarchyLevel: string;
	createdAt: Date;
	modifiedAt: Date;
	[key: string]: any;
}

interface Branding {
	isActive: boolean;
	images: Extra;
	names: Names;
	urls: Urls;
	auth: Auth;
	style: Style;
	translations: Extra;
}

interface Auth {
	azureAD: AzureAD;
	googleSignIn: GoogleSignIn;
}

interface AzureAD {
	isActive: boolean;
	clientId: string;
	authority: string;
	redirectUri: string;
}

interface GoogleSignIn {
	isActive: boolean;
}

// O elimínalo si no se usa
type Extra = Record<string, unknown>;

interface Names {
	name: string;
	shortName: string;
}

interface Style {
	customCss: string;
}

interface Urls {
	app: string;
	api: string;
}

interface Permissions {
	showTos: ShowTos;
	readContacts: boolean;
	readLocation: boolean;
	receiveNotifications: boolean;
}

interface ShowTos {
	value: boolean;
}

interface Devices {
	iphone: any[];
	android: any[];
	web: boolean;
	web2: null;
}

interface LastLocation {
	lat: number;
	lon: number;
	timestamp: Date;
}

interface Name {
	displayName: string;
	names: string;
	lastName: string;
	secondLastName: string;
}

interface Notifications {
	general: string;
	turnOffGroup: any[];
	turnOffChannel: any[];
	work: Work[];
}

interface Work {
	_id: string;
	day: string;
	active: boolean;
	start: string;
	end: string;
}

interface Settings {
	hideSummary: boolean;
	hideContacts: boolean;
}

// ======================
// 🛡 BOT AUTH VALIDATOR
// ======================

export interface BotAuthConfig {
	companyId: string;
	cotalkerApi: CotalkerApi;
	permissionsRequired: string[];
	isDevMode?: boolean;
}

export class BotAuthValidator {
	readonly #companyId: string;

	readonly #permissionsRequired: string[];

	readonly #cotalkerApi: CotalkerApi;

	readonly #isDevMode?: boolean;

	#token?: string;

	constructor(botAuthConfig: BotAuthConfig) {
		this.#companyId = botAuthConfig.companyId;
		this.#cotalkerApi = botAuthConfig.cotalkerApi;
		this.#permissionsRequired = botAuthConfig.permissionsRequired;
		this.#isDevMode = botAuthConfig.isDevMode || false;
	}

	async isInCompany(): Promise<boolean> {
		if (!this.#token) throw new Error("Empty Token");
		if (this.#isDevMode) return true;

		try {
			const bot = await this.#cotalkerApi.me(this.#token);
			return this.#companyId === bot.company._id;
		} catch (error) {
			console.error("[BotAuth] Error checking company:", error);
			return false;
		}
	}

	async hasPermissions(): Promise<boolean> {
		if (!this.#token) throw new Error("Empty Token");
		if (this.#isDevMode) return true;

		try {
			const bot = await this.#cotalkerApi.me(this.#token);
			return this.#permissionsRequired.every((p) =>
				bot.permissionsV2.includes(p)
			);
		} catch (error) {
			console.error("[BotAuth] Error checking permissions:", error);
			return false;
		}
	}

	set token(token: string) {
		this.#token = token;
	}
}

// ======================
// 👤 USER AUTH VALIDATOR
// ======================

export interface UserAuthConfig {
	companyId: string;
	cotalkerApi: CotalkerApi;
	accessRoleRequired: string;
	isDevMode?: boolean;
}

export class UserAuthValidator {
	readonly #companyId: string;

	readonly #cotalkerApi: CotalkerApi;

	readonly #accessRoleRequired: string;

	readonly #isDevMode?: boolean;

	#userId?: string;

	constructor(userAuthConfig: UserAuthConfig) {
		this.#companyId = userAuthConfig.companyId;
		this.#cotalkerApi = userAuthConfig.cotalkerApi;
		this.#accessRoleRequired = userAuthConfig.accessRoleRequired;
		this.#isDevMode = userAuthConfig.isDevMode || false;
	}

	async isInCompany(): Promise<boolean> {
		if (!this.#userId) throw new Error("Empty userId");
		if (this.#isDevMode) return true;

		try {
			const user = await this.#cotalkerApi.getUserById(this.#userId);
			return user.companies.some((c) => c.companyId === this.#companyId);
		} catch (error) {
			console.error("[UserAuth] Error checking company:", error);
			return false;
		}
	}

	async hasAccessRoles(): Promise<boolean> {
		if (!this.#userId) throw new Error("Empty userId");
		if (this.#isDevMode) return true;

		try {
			const user = await this.#cotalkerApi.getUserById(this.#userId);
			return user.accessRoles.includes(this.#accessRoleRequired);
		} catch (error) {
			console.error("[UserAuth] Error checking roles:", error);
			return false;
		}
	}

	set userId(userId: string) {
		this.#userId = userId;
	}
}
