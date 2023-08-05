// @ts-check

/**
 * @type {import('@babel/core').TransformOptions}
 */
const options = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};

module.exports = options;
