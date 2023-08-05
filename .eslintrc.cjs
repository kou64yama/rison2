// @ts-check

/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: [
    'standard',
    'prettier',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['lib/**', 'dist/**'],
};

module.exports = config;