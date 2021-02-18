module.exports = {
  '**/*.ts': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `git add --force ${filenames.join(' ')}`,
  ],
  '**/*.{md,json}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `git add --force ${filenames.join(' ')}`,
  ],
};
