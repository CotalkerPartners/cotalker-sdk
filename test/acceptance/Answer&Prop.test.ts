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

		const result = await api.getCOTAnswerClient().getAnswerById(id);

		expect(result._id).toBe("a1");
		expect(result.user).toBe("user123");
	});

	it("✅ should fetch a property by ID", async () => {
		const id = "123";
		const mockProperty = { _id: id, name: "Test Property" };

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.getProperty.mockResolvedValue(mockProperty);

		const result = await api.getCOTPropertyClient().getProperty(id);

		expect(result).toEqual(mockProperty);
	});

	it("✅ should fetch a property by code", async () => {
		const code = "test_code";
		const mockProperty = { code, name: "Property By Code" };

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.getPropertyByCode.mockResolvedValue(
			mockProperty
		);

		const result = await api.getCOTPropertyClient().getPropertyByCode(code);

		expect(result).toEqual(mockProperty);
	});

	it("✅ should get all properties from a property type", async () => {
		const type = "testType";
		const mockList = [{ name: "Prop 1" }, { name: "Prop 2" }];

		const propertyTypeClientInstance = (api as any)._cotpropertyTypeClient;
		propertyTypeClientInstance.getAllFromPropertyType.mockResolvedValue(
			mockList
		);

		const result = await api
			.getCOTPropertyTypeClient()
			.getAllFromPropertyType(type);

		expect(result).toEqual(mockList);
		expect(result.length).toBe(2);
	});

	it("✅ should search properties", async () => {
		const search = "searchTerm";
		const mockList = [{ name: "Found 1" }];

		const propertyClientInstance = (api as any)._cotpropertyClient;

		propertyClientInstance.searchProperty.mockResolvedValue(mockList);

		const result = await api.getCOTPropertyClient().searchProperty(search);

		expect(result).toEqual(mockList);
		expect(result[0].name).toBe("Found 1");
	});

	it("✅ should apply a JSON patch to a property", async () => {
		const propertyId = "pid-100";
		const patchBody: JSONPatchBody = [
			{ op: "replace", path: "/name", value: "Patched Property" }
		];
		const mockPatched = { name: "Patched Property" };

		const propertyClientInstance = (api as any)._cotpropertyClient;
		propertyClientInstance.jsonPatchProperty.mockResolvedValue(mockPatched);

		const result = await api
			.getCOTPropertyClient()
			.jsonPatchProperty(propertyId, patchBody);

		expect(result.name).toBe("Patched Property");
	});
});
