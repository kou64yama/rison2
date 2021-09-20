module.exports = {
  '**/*.ts': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint --fix ${filenames.join(' ')}`,
    `git add --force ${filenames.join(' ')}`,
  ],
  '**/*.{md,json}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `git add --force ${filenames.join(' ')}`,
  ],
};
