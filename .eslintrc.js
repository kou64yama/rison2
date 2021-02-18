module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'standard',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-useless-constructor': 'off',
    'prettier/prettier': 'error',
  },
};
