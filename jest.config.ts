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
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/main/**',
    '!<rootDir>/src/**/*-exp.ts'
  ],

  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
