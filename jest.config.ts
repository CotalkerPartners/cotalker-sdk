/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	extensionsToTreatAsEsm: [".ts"],
	setupFiles: ["<rootDir>/jest.setup.ts"], // esto apunta al otro archivo
	globals: {
		"ts-jest": {
			useESM: true,
			tsconfig: "tsconfig.jest.json"
		}
	},
	moduleNameMapper: {
		"^@libs/(.*)$": "<rootDir>/src/libs/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
		"^@customTypes/(.*)$": "<rootDir>/src/customTypes/$1",
		"^@models/(.*)$": "<rootDir>/src/libs/models/$1"
	},
	testMatch: ["**/test/**/*.test.[jt]s?(x)", "**/test/**/*.spec.[jt]s?(x)"]
};
