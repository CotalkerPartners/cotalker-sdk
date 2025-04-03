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
	syncConfiguration: SyncConfiguration;
	permissions: Permissions;
	offline: Offline;
	riskyFiles: RiskyFiles;
	passwordRotation: PasswordRotation;
	admin: any[];
	maxUsers: number;
	plan: string;
	defaultCountry: string;
	defaultLanguage: string;
	multilanguageEnabled: boolean;
	additionalLanguages: any[];
	isActive: boolean;
	jobs: string[];
	emailDomains: any[];
	propertyTypes: any[];
	newsPropertyTypes: any[];
	hierarchyLevel: string;
	signatureDuration: number;
	appToolbarColor: string;
	appToolbarText: string;
	appFiles: boolean;
	appContacts: boolean;
	appBadge: boolean;
	appSearch: boolean;
	contactMode: string;
	accessRolesVersion: string;
	specs: any[];
	isS3Private: boolean;
	defaultSelectedTaskTab: string;
	trackedJobs: any[];
	_id: string;
	subdomain: string;
	displayName: string;
	legalName: string;
	legalIdentifierCode: string;
	legalIdentifier: string;
	hierarchy: any[];
	createdAt: Date;
	modifiedAt: Date;
	__v: number;
	conversationGroup: string;
	help: string;
	system: string;
	searchEngines: any[];
	branding: Branding;
	hideSummary: boolean;
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

interface Extra {}

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

interface Offline {
	isActive: boolean;
	maxSyncTimeMs: number;
}

interface PasswordRotation {
	enabled: boolean;
	days: number;
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

interface RiskyFiles {
	allowed: boolean;
	extensions: any[];
}

interface SyncConfiguration {
	files: boolean;
	notes: boolean;
	tasks: boolean;
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
