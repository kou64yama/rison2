// @ts-check

/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: ['standard-with-typescript', 'prettier', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json']
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'parent', ['sibling', 'index']],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  },
  ignorePatterns: ['lib', 'dist']
}

module.exports = config
