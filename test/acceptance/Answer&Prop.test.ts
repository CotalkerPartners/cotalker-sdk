import { CotalkerAPI } from "../../src/libs/CotalkerAPI";
import { JSONPatchBody } from "../../src/customTypes/COTTypes/APIGenerics";

// Mocks completos
jest.mock("../../src/libs/models/COTAnswerClient", () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			getAnswerById: jest.fn().mockImplementation(async (id) => ({
				_id: id,
				user: "user123",
				createdAt: new Date().toISOString(),
				data: []
			}))
		}))
	};
});

jest.mock("../../src/libs/models/COTPropertyClient", () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			getProperty: jest.fn(),
			getPropertyByCode: jest.fn(),
			jsonPatchProperty: jest.fn(),
			searchProperty: jest.fn().mockResolvedValue([])
		}))
	};
});

jest.mock("../../src/libs/models/COTPropertyTypeClient", () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			getAllFromPropertyType: jest.fn(),
			searchProperty: jest.fn()
		}))
	};
});

describe("🧪 CotalkerAPI - Property & Answer Integration", () => {
	let api: CotalkerAPI;

	beforeAll(() => {
		api = new CotalkerAPI("fake-token");
	});

	it("✅ should get an answer by ID", async () => {
		const id = "a1";
		console.debug("[TEST] getAnswer - input:", id);

		const result = await api.getCOTAnswerClient().getAnswerById(id);
		console.debug("[TEST] getAnswer - output:", result);

		expect(result._id).toBe("a1");
		expect(result.user).toBe("user123");
	});

	it("✅ should fetch a property by ID", async () => {
		const id = "123";
		const mockProperty = { _id: id, name: "Test Property" };

		console.debug("[TEST] getProperty - input:", id);
		console.debug("[TEST] getProperty - expected output:", mockProperty);

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.getProperty.mockResolvedValue(mockProperty);

		const result = await api.getCOTPropertyClient().getProperty(id);
		console.debug("[TEST] getProperty - actual output:", result);

		expect(result).toEqual(mockProperty);
	});

	it("✅ should fetch a property by code", async () => {
		const code = "test_code";
		const mockProperty = { code, name: "Property By Code" };

		console.debug("[TEST] getPropertyByCode - input:", code);
		console.debug(
			"[TEST] getPropertyByCode - expected output:",
			mockProperty
		);

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.getPropertyByCode.mockResolvedValue(
			mockProperty
		);

		const result = await api.getCOTPropertyClient().getPropertyByCode(code);
		console.debug("[TEST] getPropertyByCode - actual output:", result);

		expect(result).toEqual(mockProperty);
	});

	it("✅ should get all properties from a property type", async () => {
		const type = "testType";
		const mockList = [{ name: "Prop 1" }, { name: "Prop 2" }];

		console.debug("[TEST] getAllFromPropertyType - input:", type);
		console.debug(
			"[TEST] getAllFromPropertyType - expected output:",
			mockList
		);

		const propertyTypeClientInstance = (api as any)._cotpropertyTypeClient;
		propertyTypeClientInstance.getAllFromPropertyType.mockResolvedValue(
			mockList
		);

		const result = await api
			.getCOTPropertyTypeClient()
			.getAllFromPropertyType(type);
		console.debug("[TEST] getAllFromPropertyType - actual output:", result);

		expect(result).toEqual(mockList);
		expect(result.length).toBe(2);
	});

	it("✅ should search properties", async () => {
		const search = "searchTerm";
		const mockList = [{ name: "Found 1" }];

		console.debug("[TEST] searchProperty - input:", search);
		console.debug("[TEST] searchProperty - expected output:", mockList);

		const propertyClientInstance = (api as any)._cotpropertyClient;

		console.debug("[MOCK] Antes del mockResolvedValue");
		propertyClientInstance.searchProperty.mockResolvedValue(mockList);
		console.debug("[MOCK] Después del mockResolvedValue");

		const result = await api.getCOTPropertyClient().searchProperty(search);

		console.debug("[TEST] searchProperty - actual output:", result);
		expect(result).toEqual(mockList);
		expect(result[0].name).toBe("Found 1");
	});

	it("✅ should apply a JSON patch to a property", async () => {
		const propertyId = "pid-100";
		const patchBody: JSONPatchBody = [
			{ op: "replace", path: "/name", value: "Patched Property" }
		];
		const mockPatched = { name: "Patched Property" };

		console.debug("[TEST] jsonPatchPropety - input ID:", propertyId);
		console.debug("[TEST] jsonPatchPropety - patch body:", patchBody);
		console.debug(
			"[TEST] jsonPatchPropety - expected output:",
			mockPatched
		);

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.jsonPatchProperty.mockResolvedValue(mockPatched);

		const result = await api
			.getCOTPropertyClient()
			.jsonPatchProperty(propertyId, patchBody);
		console.debug("[TEST] jsonPatchPropety - actual output:", result);

		expect(result.name).toBe("Patched Property");
	});
});
