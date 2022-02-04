export default {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*.xtest.ts',
    '/generated/'
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
