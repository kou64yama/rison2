// @ts-check

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  '**/*.{ts,js,cjs,json}': ['biome format --write', 'biome lint --fix'],
  '**/*.{md,yml,yaml}': ['prettier --write']
}

module.exports = config
