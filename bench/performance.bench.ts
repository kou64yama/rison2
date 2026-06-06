import { bench, describe } from 'vitest'

import { Lexer } from '../src/lexer'
import { Stringifier } from '../src/stringifier'

const BENCHMARK_OPTIONS = {
  time: 100,
  warmupTime: 50
}

interface BenchmarkInput {
  name: string
  source: string
  tokenCount: number
}

function countTokens(source: string): number {
  const lexer = new Lexer(source)
  let count = 0

  while (lexer.nextToken() !== null) {
    count++
  }

  return count
}

function benchmarkInput(name: string, source: string): BenchmarkInput {
  return {
    name,
    source,
    tokenCount: countTokens(source)
  }
}

function tokenize(source: string): void {
  const lexer = new Lexer(source)

  while (lexer.nextToken() !== null) {
    // Consume the complete input so each benchmark measures a token stream.
  }
}

function separatedTokens(
  count: number,
  token: (index: number) => string
): string {
  return Array.from({ length: count }, (_, index) => token(index)).join(',')
}

const sizes = [50, 500]

const inputs = [
  ...sizes.map((size) =>
    benchmarkInput(
      'fixed tokens',
      Array.from({ length: size * 2 }, (_, index) =>
        index % 2 === 0 ? '!t' : ','
      ).join('')
    )
  ),
  ...sizes.map((size) =>
    benchmarkInput(
      'identifiers',
      separatedTokens(size, (index) => `field${index % 10}`)
    )
  ),
  ...sizes.map((size) =>
    benchmarkInput(
      'numbers',
      separatedTokens(size, (index) => `${index % 10_000}.125e-2`)
    )
  ),
  ...sizes.map((size) =>
    benchmarkInput(
      'quoted strings',
      separatedTokens(size, (index) => `'value${index % 10}!'quoted'`)
    )
  ),
  ...sizes.map((size) =>
    benchmarkInput(
      'mixed objects',
      `!(${Array.from(
        { length: size / 5 },
        (_, index) =>
          `(id:item${index},count:${index}.5,active:${
            index % 2 === 0 ? '!t' : '!f'
          })`
      ).join(',')})`
    )
  )
]

describe('Lexer token matching', () => {
  for (const input of inputs) {
    bench(
      `${input.name}: ${input.tokenCount} tokens, ${input.source.length} bytes`,
      () => tokenize(input.source),
      BENCHMARK_OPTIONS
    )
  }
})

const stringifier = new Stringifier()
const collectionSize = 5_000
const largeArray = Array.from({ length: collectionSize }, (_, index) => ({
  id: `item${index}`,
  count: index,
  active: index % 2 === 0
}))
const largeObject = Object.fromEntries(
  Array.from({ length: collectionSize }, (_, index) => [
    `field${index}`,
    index % 10 === 0 ? undefined : `value${index}`
  ])
)

describe('Stringifier collection joining', () => {
  bench(
    `array: ${collectionSize} elements`,
    () => stringifier.array(largeArray),
    BENCHMARK_OPTIONS
  )

  bench(
    `object: ${collectionSize} properties`,
    () => stringifier.object(largeObject),
    BENCHMARK_OPTIONS
  )
})
