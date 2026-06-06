import { deepStrictEqual } from 'node:assert'
import { bench, describe } from 'vitest'
import { Lexer } from '../src/lexer'
import { RISON } from '../src/rison'

const BENCHMARK_OPTIONS = {
  time: 100,
  warmupTime: 50
}

const fixtures = [
  {
    name: 'bare string',
    source: 'hello-world',
    value: 'hello-world'
  },
  {
    name: 'quoted string without escapes',
    source: "'hello world'",
    value: 'hello world'
  },
  {
    name: 'escaped quoted string',
    source: "'hello!! !'world'",
    value: "hello! 'world"
  }
]

for (const fixture of fixtures) {
  deepStrictEqual(
    RISON.parse(fixture.source),
    fixture.value,
    `RISON should parse ${fixture.name}`
  )
}

describe.each(fixtures)('String parsing: $name', (fixture) => {
  bench(
    'lexer-only',
    () => {
      const lexer = new Lexer(fixture.source)
      while (lexer.nextToken() !== null) {}
    },
    BENCHMARK_OPTIONS
  )
  bench(
    'RISON.parse',
    () => {
      RISON.parse(fixture.source)
    },
    BENCHMARK_OPTIONS
  )
})
