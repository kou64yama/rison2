// @ts-check

/**
 * @type {import('lint-staged').Config}
 */
const config = {
  '**/*.ts': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint --fix ${filenames.join(' ')}`,
  ],
  '**/*.{md,json}': (filenames) => [`prettier --write ${filenames.join(' ')}`],
};

module.exports = config;
