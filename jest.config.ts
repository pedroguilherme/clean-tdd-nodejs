export default {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  verbose: true,
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*.xtest.ts',
    '/generated/'
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/*-exp.ts'
  ],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
