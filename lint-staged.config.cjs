// @ts-check

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  '**/*.{ts,js,cjs}': ['eslint --fix', 'prettier --write'],
  '**/*.{md,json}': ['prettier --write']
}

module.exports = config
