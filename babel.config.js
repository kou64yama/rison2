// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const pkg = require('./package.json');

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: pkg.engines.node.replace(/^>=(\d+).*/, '$1') },
      },
    ],
    '@babel/preset-typescript',
  ],
};
