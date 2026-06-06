import { bench, describe } from 'vitest'
import { Lexer } from '../src/lexer'
import { RISON } from '../src/rison'

const BENCHMARK_OPTIONS = {
  time: 100,
  warmupTime: 50
}

const collectionSize = 1_000
const largeObject = Object.fromEntries(
  Array.from({ length: collectionSize }, (_, index) => [
    `field${index}`,
    index % 10 === 0
      ? `value-${index}`
      : index % 5 === 0
        ? true
        : `string-value-${index}`
  ])
)
const largeObjectSource = RISON.stringify(largeObject)

describe('Lexer: large object', () => {
  bench(
    'tokenize',
    () => {
      const lexer = new Lexer(largeObjectSource)
      while (lexer.nextToken() !== null) {}
    },
    BENCHMARK_OPTIONS
  )
})
