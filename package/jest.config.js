module.exports = {
  transform: {
    '^.+\\.jsx?$': '<rootDir>/jest-preprocess.js',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*\\.([tj]sx?)|(\\.|/)(test|spec))\\.([tj]sx?)$',
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|ico|jpg|png|svg)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  globals: {
    __PATH_PREFIX__: '',
    'ts-jest': {
      diagnostics: false,
    },
  },
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/loadershim.ts'],
};
