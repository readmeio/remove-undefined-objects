module.exports = {
  coveragePathIgnorePatterns: ['/dist', '/node_modules'],
  globals: {
    'ts-jest': {
      tsconfig: '__tests__/tsconfig.json',
    },
  },
  modulePaths: ['<rootDir>'],
  preset: 'ts-jest/presets/js-with-ts',
  roots: ['<rootDir>'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
  transform: {},
};
