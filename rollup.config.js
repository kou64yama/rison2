// @ts-check

import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { readFile } from 'node:fs/promises';

/**
 * @returns {Promise<import('./package.json')>}
 */
async function readPackageJson() {
  const data = await readFile('./package.json', 'utf-8');
  return JSON.parse(data);
}

/**
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
export default async function () {
  const pkg = await readPackageJson();
  const input = 'src/index.ts';
  const plugins = [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
    }),
  ];
  const node = getBabelOutputPlugin({
    presets: [
      [
        '@babel/preset-env',
        /** @type {import('@babel/preset-env').Options} */ ({
          targets: { node: pkg.engines.node.match(/[0-9]+/)?.[0] },
        }),
      ],
    ],
  });
  const browser = getBabelOutputPlugin({
    presets: [
      [
        '@babel/preset-env',
        /** @type {import('@babel/preset-env').Options} */ ({
          modules: 'umd',
          targets: { browsers: pkg.browserslist },
        }),
      ],
    ],
    moduleId: 'rison2',
  });

  return [
    {
      input,
      output: {
        dir: 'lib',
        entryFileNames: '[name].js',
        format: 'esm',
        preserveModules: true,
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        node,
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
        entryFileNames: '[name].cjs',
        format: 'cjs',
        preserveModules: true,
        sourcemap: true,
      },
      plugins: [...plugins, node, typescript()],
    },
    {
      input,
      output: {
        dir: 'dist',
        entryFileNames: 'rison2.js',
        format: 'esm',
        sourcemap: true,
      },
      plugins: [...plugins, browser, typescript()],
    },
  ];
}
