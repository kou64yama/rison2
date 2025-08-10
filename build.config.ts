import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
  // Node.js build
  {
    entries: ['src/index', 'src/escaped'],
    outDir: 'lib',
    declaration: true,
    clean: true,
    failOnWarn: false,
    rollup: {
      output: {
        format: 'esm',
        entryFileNames: '[name].js'
      }
    }
  },
  {
    entries: ['src/index', 'src/escaped'],
    outDir: 'lib',
    declaration: false,
    clean: false,
    failOnWarn: false,
    rollup: {
      output: {
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    }
  },
  // Browser build
  {
    entries: [{ input: 'src/index.ts', name: 'rison2' }],
    outDir: 'dist',
    declaration: false,
    clean: true, // Clean dist directory
    failOnWarn: false,
    rollup: {
      emitCJS: false,
      esbuild: {
        minify: false
      },
      output: {
        format: 'umd',
        entryFileNames: 'rison2.js',
        name: 'rison2'
      }
    }
  },
  // Minified browser build
  {
    entries: [{ input: 'src/index.ts', name: 'rison2' }],
    outDir: 'dist',
    declaration: false,
    clean: false, // Do not clean again
    failOnWarn: false,
    rollup: {
      emitCJS: false,
      esbuild: {
        minify: true
      },
      output: {
        format: 'umd',
        entryFileNames: 'rison2.min.js',
        name: 'rison2'
      }
    }
  }
])
