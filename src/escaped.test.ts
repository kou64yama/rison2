import { ARISON, ORISON, RISON } from './escaped'

const risonTests: Array<[unknown, string]> = [
  ['hello', 'hello'],
  [
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,',
    "'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'"
  ],
  ['こんにちは', '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF']
]
const orisonTests: Array<[Record<string, unknown>, string]> = [
  [{ message: 'hello' }, 'message:hello'],
  [
    { message: 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,' },
    "message:'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'"
  ],
  [
    { message: 'こんにちは' },
    'message:%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF'
  ]
]
const arisonTests: Array<[unknown[], string]> = [
  [['hello'], 'hello'],
  [
    ['Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,'],
    "'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'"
  ],
  [['こんにちは'], '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF']
]

describe('RISON.parse', () => {
  it.each(risonTests)('returns %j when it given %j', (expected, input) => {
    expect(RISON.parse(input)).toStrictEqual(expected)
  })
})

describe('RISON.stringify', () => {
  const flip = risonTests.map((x) => [x[1], x[0]] as const)
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(RISON.stringify(input)).toBe(expected)
  })
})

describe('ORISON.parse', () => {
  it.each(orisonTests)('returns %j when it given %j', (expected, input) => {
    expect(ORISON.parse(input)).toStrictEqual(expected)
  })
})

describe('ORISON.stringify', () => {
  const flip = orisonTests.map((x) => [x[1], x[0]] as const)
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(ORISON.stringify(input)).toBe(expected)
  })
})

describe('ARISON.parse', () => {
  it.each(arisonTests)('returns %j when it given %j', (expected, input) => {
    expect(ARISON.parse(input)).toStrictEqual(expected)
  })
})

describe('ARISON.stringify', () => {
  const flip = arisonTests.map((x) => [x[1], x[0]] as const)
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(ARISON.stringify(input)).toBe(expected)
  })
})
