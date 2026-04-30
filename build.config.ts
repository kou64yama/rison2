import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
  // ESM build
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
  }
])
