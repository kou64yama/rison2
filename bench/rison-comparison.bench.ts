import { deepStrictEqual } from 'node:assert'
import rison from 'rison'
import { bench, describe } from 'vitest'
import { RISON } from '../src/rison'

const BENCHMARK_OPTIONS = {
  time: 100,
  warmupTime: 50
}

const smallObject = {
  id: 'test',
  value: 123,
  active: true,
  nullValue: null,
  emptyString: ''
}

const mediumObject = {
  name: 'John Doe',
  age: 30,
  isStudent: false,
  courses: ['math', 'science', 'history', 'biology', 'physics'],
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    country: 'USA'
  },
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  },
  tags: ['developer', 'js', 'ts']
}

const collectionSize = 1_000
const largeArray = Array.from({ length: collectionSize }, (_, index) => ({
  id: `item${index}`,
  count: index,
  active: index % 2 === 0,
  tags: [`tag${index}`, `tag${index + 1}`],
  description: `A longer description for item number ${index}.`
}))

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

const benchmarkFixtures = [
  { name: 'small object', value: smallObject },
  { name: 'medium object', value: mediumObject },
  { name: 'large array', value: largeArray },
  { name: 'large object', value: largeObject }
].map((fixture) => {
  const rison2Source = RISON.stringify(fixture.value)
  const risonSource = rison.encode(fixture.value)

  deepStrictEqual(
    RISON.parse(risonSource),
    fixture.value,
    `rison2 should parse rison's ${fixture.name}`
  )
  deepStrictEqual(
    rison.decode(rison2Source),
    fixture.value,
    `rison should parse rison2's ${fixture.name}`
  )

  return { ...fixture, source: rison2Source }
})

describe.each(benchmarkFixtures)('RISON stringify: $name', (fixture) => {
  bench(
    'rison2',
    () => {
      RISON.stringify(fixture.value)
    },
    BENCHMARK_OPTIONS
  )
  bench(
    'rison',
    () => {
      rison.encode(fixture.value)
    },
    BENCHMARK_OPTIONS
  )
})

describe.each(benchmarkFixtures)('RISON parse: $name', (fixture) => {
  bench('rison2', () => RISON.parse(fixture.source), BENCHMARK_OPTIONS)
  bench('rison', () => rison.decode(fixture.source), BENCHMARK_OPTIONS)
})
