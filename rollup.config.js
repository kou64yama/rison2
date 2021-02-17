import typescript from '@rollup/plugin-typescript';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.browser,
    format: 'es',
  },
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
    }),
    getBabelOutputPlugin({
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'umd',
            targets: {
              browsers: pkg.browserslist,
              node: true,
            },
          },
        ],
      ],
      moduleId: 'rison',
    }),
  ],
};
