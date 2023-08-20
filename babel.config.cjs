// @ts-check

/**
 * @type {import('@babel/core').TransformOptions}
 */
const options = {
  presets: [
    [
      '@babel/preset-env',
      /** @type {import('@babel/preset-env').Options} */ ({
        targets: { node: 'current' }
      })
    ],
    '@babel/preset-typescript'
  ]
}

module.exports = options
