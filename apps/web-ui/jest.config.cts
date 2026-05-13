const nextJest = require('next/jest.js');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.base.json');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  displayName: 'web-ui',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web-ui',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
  ],
};

module.exports = async () => {
  const resolvedConfig = await createJestConfig(config)();
  return {
    ...resolvedConfig,
    moduleNameMapper: {
      ...resolvedConfig.moduleNameMapper,
      ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/../../' }),
      '^.*packages/hooks/src$': '<rootDir>/../../packages/hooks/src/index.ts',
      '^.*packages/ui-components/src$': '<rootDir>/../../packages/ui-components/src/index.ts',
      '^.*packages/domain/src$': '<rootDir>/../../packages/domain/src/index.ts',
      '^.*packages/data-access/src$': '<rootDir>/../../packages/data-access/src/index.ts',
      '^.*packages/validation/src$': '<rootDir>/../../packages/validation/src/index.ts',
      '^.*packages/app-logic/src$': '<rootDir>/../../packages/app-logic/src/index.ts',
    },
  };
};
