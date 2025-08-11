module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/*.spec.ts'], 
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',

  collectCoverage: true, 
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html'],


  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '/mocks/',
    '/tests/',
    '\\.mock\\.ts$',
    '\\.spec\\.ts$',
    '^((?!/usecases/).)*$',
  ],

  moduleNameMapper: {
    '^@app/domain(|/.*)$': '<rootDir>/src/domain$1',
    '^@app/infra(|/.*)$': '<rootDir>/src/infra$1',
    '^@app/shared(|/.*)$': '<rootDir>/src/shared$1',
    '^@app/libs(|/.*)$': '<rootDir>/src/libs/$1',
  },
};
