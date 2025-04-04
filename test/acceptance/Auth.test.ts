import { CotalkerAPI } from "../../src/libs/CotalkerAPI";
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

describe("🔐 Auth Module", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// BOT
	describe("🤖 BotAuthValidator", () => {
		it("✅ should validate bot is in company", async () => {
			const token =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2MxYzA4NTYzM2NjZGM3YWRkZmZlOTgiLCJyb2xlIjoidXNlciIsImNvbXBhbnkiOiI2N2MxYmY1Y2E0YmRiYWY4ZTYxMzcwZmIiLCJkYXRlIjoxNzQzNzEyMjYxNTc2LCJpcnQiOnRydWUsImlhdCI6MTc0MzcxMjI2MSwiZXhwIjoxNzQ0MzE3MDYxfQ.nLuEQTyQhpB0GUCyBkK1gJI55yMa4lHHclyZXbbpOqs";
			const companyId = "company123";

			const validator = new BotAuthValidator({
				companyId,
				cotalkerApi: mockCotalkerApi,
				permissionsRequired: []
			});

			validator.token = token;
			mockCotalkerApi.me.mockResolvedValue({
				company: { _id: companyId }
			});

			console.debug("[TEST] BotAuthValidator - input token:", token);
			console.debug(
				"[TEST] BotAuthValidator - expected companyId:",
				companyId
			);

			const result = await validator.isInCompany();

			console.debug("[TEST] BotAuthValidator - result:", result);

			expect(mockCotalkerApi.me).toHaveBeenCalledWith(token);
			expect(result).toBe(true);
		});

		it("✅ should validate bot permissions", async () => {
			const token =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2MxYzA4NTYzM2NjZGM3YWRkZmZlOTgiLCJyb2xlIjoidXNlciIsImNvbXBhbnkiOiI2N2MxYmY1Y2E0YmRiYWY4ZTYxMzcwZmIiLCJkYXRlIjoxNzQzNzEyMjYxNTc2LCJpcnQiOnRydWUsImlhdCI6MTc0MzcxMjI2MSwiZXhwIjoxNzQ0MzE3MDYxfQ.nLuEQTyQhpB0GUCyBkK1gJI55yMa4lHHclyZXbbpOqs";
			const permissions = ["perm.read"];

			const validator = new BotAuthValidator({
				companyId: "company123",
				cotalkerApi: mockCotalkerApi,
				permissionsRequired: permissions
			});

			validator.token = token;
			mockCotalkerApi.me.mockResolvedValue({
				permissionsV2: ["perm.read", "perm.write"]
			});

			console.debug(
				"[TEST] BotAuthValidator - input permissions:",
				permissions
			);

			const result = await validator.hasPermissions();

			console.debug("[TEST] BotAuthValidator - result:", result);
			expect(result).toBe(true);
		});
	});

	// USER
	describe("👤 UserAuthValidator", () => {
		it("✅ should validate user is in company", async () => {
			const companyId = "company123";
			const userId = "user456";

			const validator = new UserAuthValidator({
				companyId,
				cotalkerApi: mockCotalkerApi,
				accessRoleRequired: "admin"
			});

			validator.userId = userId;

			mockCotalkerApi.getUserById.mockResolvedValue({
				companies: [{ companyId }]
			});

			console.debug("[TEST] UserAuthValidator - input userId:", userId);

			const result = await validator.isInCompany();

			console.debug("[TEST] UserAuthValidator - result:", result);
			expect(result).toBe(true);
		});

		it("✅ should validate user access roles", async () => {
			const userId = "user789";
			const accessRole = "admin";

			const validator = new UserAuthValidator({
				companyId: "company123",
				cotalkerApi: mockCotalkerApi,
				accessRoleRequired: accessRole
			});

			validator.userId = userId;

			mockCotalkerApi.getUserById.mockResolvedValue({
				accessRoles: ["admin", "editor"]
			});

			console.debug("[TEST] UserAuthValidator - input userId:", userId);
			console.debug(
				"[TEST] UserAuthValidator - required access role:",
				accessRole
			);

			const result = await validator.hasAccessRoles();

			console.debug("[TEST] UserAuthValidator - result:", result);
			expect(result).toBe(true);
		});
	});

	// REAL TEST — login contra staging (omitido por seguridad)
	describe("🧪 CotalkerAPI Login (REAL)", () => {
		it("should perform login and return real token", async () => {
			process.env.BASE_URL = "https://staging.cotalker.com";

			const email = "daniel.barriga@cotalker.com";
			const password = "Cotalker25$";

			console.log("[REAL TEST] Starting login with email:", email);

			const token = await CotalkerAPI.login(email, password);

			console.log("\x1b[33m[REAL TOKEN GENERATED]\x1b[0m", token);

			expect(typeof token).toBe("string");
			expect(token.length).toBeGreaterThan(10);
		});
	});
});
