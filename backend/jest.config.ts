/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: './__tests__/coverage',
    coverageProvider: 'v8',
    testMatch: ['/**/*/*.test.ts'],
    setupFiles: ['./jest.setup.ts'],
};
