/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	transform: {
	  '^.+\\.ts$': 'ts-jest',
	},
	extensionsToTreatAsEsm: ['.ts'],
	globals: {
	  'ts-jest': {
		useESM: true,
		tsconfig: 'tsconfig.jest.json'
	  }
	},
	moduleNameMapper: {
	  '^@libs/(.*)$': '<rootDir>/src/libs/$1',
	  '^@utils/(.*)$': '<rootDir>/src/utils/$1',
	  '^@customTypes/(.*)$': '<rootDir>/src/customTypes/$1',
	  '^@models/(.*)$': '<rootDir>/src/libs/models/$1'
	},
	testMatch: ['**/test/**/*.test.[jt]s?(x)', '**/test/**/*.spec.[jt]s?(x)']
  };
  