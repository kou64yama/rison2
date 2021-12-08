// @ts-check

import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const input = 'src/index.ts';
const plugins = [
  nodeResolve(),
  babel({
    babelHelpers: 'bundled',
  }),
];

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  {
    input,
    output: {
      dir: 'lib',
      entryFileNames: '[name].mjs',
      format: 'esm',
      preserveModules: true,
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      typescript({
        declaration: true,
        declarationDir: 'lib',
        include: ['src/**/*.ts'],
        exclude: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/__tests__/**/*.ts',
          '**/__mocks__/**/*.ts',
        ],
      }),
    ],
  },
  {
    input,
    output: {
      dir: 'lib',
      entryFileNames: '[name].js',
      format: 'cjs',
      preserveModules: true,
      sourcemap: true,
    },
    plugins: [...plugins, typescript()],
  },
  {
    input,
    output: {
      dir: 'dist',
      entryFileNames: 'rison2.js',
      format: 'esm',
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              '@babel/preset-env',
              {
                modules: 'umd',
                targets: { browsers: pkg.browserslist },
              },
            ],
          ],
          moduleId: 'rison2',
        }),
      ],
    },
    plugins: [...plugins, typescript()],
  },
];

export default options;
