import COTUserClient from "../src/libs/models/COTUserClient";
import axios from "axios";

jest.mock("../src/libs/models/COTUserClient", () => {
	return {
		default: jest.fn().mockImplementation(() => ({
			getAllUsersInQuery: jest.fn(),
			getUsersByAccessRole: jest.fn(),
			getUsersByJob: jest.fn(),
			getUsersByEmail: jest.fn(),
			getUsersByRelation: jest.fn(),
			getUserActivity: jest.fn(),
			jsonPatchUser: jest.fn(),
			getUsersById: jest.fn(),
			findUsers: jest.fn(),
			getBossUsers: jest.fn()
		}))
	};
});

describe("Users model", () => {
	let usersAPI: COTUserClient;
	const mockUserId = "user123";
	const mockUser = {
		_id: "user123",
		accessRoles: ["admin"],
		avatar: {
			url: "https://example.com/avatar.jpg",
			small: "https://example.com/avatar-small.jpg",
			original: "https://example.com/avatar-original.jpg",
			square: "https://example.com/avatar-square.jpg"
		},
		badge: [],
		companies: [
			{
				_id: "company123",
				companyId: "company123",
				hierarchy: {
					subordinate: ["sub1", "sub2"],
					peers: [],
					boss: []
				}
			}
		],
		createdAt: new Date().toISOString(),
		devices: { iphone: [], android: [], web: true },
		email: "test@example.com",
		emailIsVerified: true,
		extra: {},
		hierarchyLevel: 1,
		isActive: true,
		isOnline: false,
		isPhoneVerified: false,
		job: "job123",
		jobTitle: "Software Engineer",
		lastRequestDate: new Date().toISOString(),
		messagesUnread: [],
		modifiedAt: new Date().toISOString(),
		name: {
			secondLastName: "",
			lastName: "",
			names: "Test User",
			displayName: "Test User"
		},
		needPasswordChange: false,
		notifications: {
			turnOffChannel: [],
			turnOffGroup: [],
			work: [],
			general: ""
		},
		permissions: [],
		phone: "+123456789",
		profileInfo: [],
		properties: [],
		provider: "email",
		requiredChanges: [],
		role: "admin",
		search: ["test", "user"],
		settings: {
			hideSummary: false,
			hideContacts: false
		},
		taskManager: false,
		termsConditions: true,
		extensions: {},
		permissionsV2: []
	};
	const mockUsers = [mockUser];
	const mockUserActivity = {
		_id: "activity123",
		userId: mockUserId,
		lastLogin: new Date()
	};
	const mockJobId = "job123";
	const mockRelationType = "boss";
	const mockRelationId = "relation123";
	const mockAxios = axios.create();

	beforeEach(() => {
		jest.clearAllMocks();
		usersAPI = new COTUserClient(mockAxios);
	});

	test("Debe retornar usuarios con el trabajo especificado", async () => {
		(usersAPI.getUsersByJob as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.getUsersByJob(mockJobId);
		expect(result).toEqual(mockUsers);
	});

	test("Debe retornar usuarios por emails", async () => {
		(usersAPI.getUsersByEmail as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.getUsersByEmail(["test@example.com"]);
		expect(result).toEqual(mockUsers);
	});

	test("Debe retornar usuarios por relación", async () => {
		(usersAPI.getUsersByRelation as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.getUsersByRelation(
			mockRelationType,
			mockRelationId
		);
		expect(result).toEqual(mockUsers);
	});

	test("Debe retornar actividad del usuario", async () => {
		(usersAPI.getUserActivity as jest.Mock).mockResolvedValue(
			mockUserActivity
		);
		const result = await usersAPI.getUserActivity(mockUserId);
		expect(result).toEqual(mockUserActivity);
	});

	test("Debe aplicar cambios parciales al usuario", async () => {
		const updatedUser = { ...mockUser, name: "New Name" };
		(usersAPI.jsonPatchUser as jest.Mock).mockResolvedValue(updatedUser);
		const result = await usersAPI.jsonPatchUser(mockUserId, []);
		expect(result.name).toBe("New Name");
	});

	test("Debe retornar usuarios por sus IDs", async () => {
		(usersAPI.getUsersById as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.getUsersById(["user1", "user2"]);
		expect(result).toEqual(mockUsers);
	});

	test("Debe buscar usuarios con query personalizada", async () => {
		(usersAPI.findUsers as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.findUsers({ name: "Test" });
		expect(result).toEqual(mockUsers);
	});

	test("Debe retornar los jefes del usuario", async () => {
		(usersAPI.getBossUsers as jest.Mock).mockResolvedValue(mockUsers);
		const result = await usersAPI.getBossUsers(mockUserId);
		expect(result).toEqual(mockUsers);
	});
});
