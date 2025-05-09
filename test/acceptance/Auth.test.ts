import {
	BotAuthValidator,
	UserAuthValidator
} from "../../src/libs/models/COTAuth";

// Mock CotalkerAPI methods
const mockCotalkerApi = {
	me: jest.fn(),
	getUserById: jest.fn(),
	login: jest.fn()
};

// Mock data for tests
const mockData = {
	companyId: "mockCompany123",
	userId: "mockUser456",
	token: "mockToken123",
	permissions: ["perm.read", "perm.write"],
	accessRoles: ["admin", "editor"],
	userData: {
		companies: [{ companyId: "mockCompany123" }],
		accessRoles: ["admin", "editor"]
	},
	botData: {
		company: { _id: "mockCompany123" },
		permissionsV2: ["perm.read", "perm.write"]
	}
};

describe("🔐 Auth Module", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// BOT
	describe("🤖 BotAuthValidator", () => {
		it("✅ should validate bot is in company", async () => {
			const validator = new BotAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				permissionsRequired: []
			});

			validator.token = mockData.token;
			mockCotalkerApi.me.mockResolvedValue(mockData.botData);

			const result = await validator.isInCompany();

			expect(mockCotalkerApi.me).toHaveBeenCalledWith(mockData.token);
			expect(result).toBe(true);
		});

		it("✅ should validate bot permissions", async () => {
			const validator = new BotAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				permissionsRequired: [mockData.permissions[0]]
			});

			validator.token = mockData.token;
			mockCotalkerApi.me.mockResolvedValue(mockData.botData);

			const result = await validator.hasPermissions();

			expect(result).toBe(true);
		});

		it("❌ should fail when bot has insufficient permissions", async () => {
			const validator = new BotAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				permissionsRequired: ["perm.nonexistent"]
			});

			validator.token = mockData.token;
			mockCotalkerApi.me.mockResolvedValue(mockData.botData);

			const result = await validator.hasPermissions();

			expect(result).toBe(false);
		});
	});

	// USER
	describe("👤 UserAuthValidator", () => {
		it("✅ should validate user is in company", async () => {
			const validator = new UserAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				accessRoleRequired: mockData.accessRoles[0]
			});

			validator.userId = mockData.userId;
			mockCotalkerApi.getUserById.mockResolvedValue(mockData.userData);

			const result = await validator.isInCompany();

			expect(mockCotalkerApi.getUserById).toHaveBeenCalledWith(
				mockData.userId
			);
			expect(result).toBe(true);
		});

		it("✅ should validate user access roles", async () => {
			const validator = new UserAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				accessRoleRequired: mockData.accessRoles[0]
			});

			validator.userId = mockData.userId;
			mockCotalkerApi.getUserById.mockResolvedValue(mockData.userData);

			const result = await validator.hasAccessRoles();

			expect(result).toBe(true);
		});

		it("❌ should fail when user has insufficient access roles", async () => {
			const validator = new UserAuthValidator({
				companyId: mockData.companyId,
				cotalkerApi: mockCotalkerApi,
				accessRoleRequired: "nonexistent-role"
			});

			validator.userId = mockData.userId;
			mockCotalkerApi.getUserById.mockResolvedValue(mockData.userData);

			const result = await validator.hasAccessRoles();

			expect(result).toBe(false);
		});
	});
});
