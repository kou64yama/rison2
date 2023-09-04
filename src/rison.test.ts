import { ARISON, ORISON, RISON } from './rison'

const risonTests: Array<[unknown, string]> = [
  // null
  [null, '!n'],
  // boolean
  [true, '!t'],
  [false, '!f'],
  // number
  [0, '0'],
  [123, '123'],
  [-123, '-123'],
  [123.45, '123.45'],
  [-123.45, '-123.45'],
  [1.23e50, '1.23e50'],
  [-1.23e50, '-1.23e50'],
  [1.23e-50, '1.23e-50'],
  [-1.23e-50, '-1.23e-50'],
  // string
  ['hello', 'hello'],
  ["Allo' Allo'", "'Allo!' Allo!''"],
  [
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,',
    "'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,'"
  ],
  ['こんにちは', 'こんにちは'],
  // object
  [{ message: "Allo' Allo'" }, "(message:'Allo!' Allo!'')"],
  [
    { message: "Allo' Allo'", author: 'alice' },
    "(message:'Allo!' Allo!'',author:alice)"
  ],
  [
    { author: 'bob', message: "Allo' Allo'" },
    "(author:bob,message:'Allo!' Allo!'')"
  ],
  [{}, '()'],
  // array
  [["Allo' Allo'"], "!('Allo!' Allo!'')"],
  [["Allo' Allo'", 'alice'], "!('Allo!' Allo!'',alice)"],
  [[], '!()']
]
const orisonTests: Array<[Record<string, unknown>, string]> = [
  [{ message: "Allo' Allo'" }, "message:'Allo!' Allo!''"],
  [
    { message: "Allo' Allo'", author: 'alice' },
    "message:'Allo!' Allo!'',author:alice"
  ],
  [
    { author: 'bob', message: "Allo' Allo'" },
    "author:bob,message:'Allo!' Allo!''"
  ],
  [{}, '']
]
const arisonTests: Array<[unknown[], string]> = [
  [["Allo' Allo'"], "'Allo!' Allo!''"],
  [["Allo' Allo'", 'alice'], "'Allo!' Allo!'',alice"],
  [[], '']
]

const syntaxErrors: string[] = [
  "'message",
  '(hello)',
  '(hello:hello:)',
  '(:)',
  '(hello',
  '!(hello',
  '1+1',
  '1-1',
  '1*1',
  '1/1',
  ':',
  ',',
  ')'
]

describe('RISON.parse', () => {
  it.each(risonTests)('returns %j when it given %j', (expected, input) => {
    expect(RISON.parse(input)).toStrictEqual(expected)
  })

  it.each(syntaxErrors)('throws SyntaxError when it given %j', (input) => {
    expect(() => RISON.parse(input)).toThrow(SyntaxError)
  })
})

describe('RISON.stringify', () => {
  const flip = risonTests.map((x) => [x[1], x[0]] as const)
  const undefinedTests = [undefined, () => null]
  const nullTests = [NaN, Infinity]

  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(RISON.stringify(input)).toBe(expected)
  })

  it.each(undefinedTests)('returns undefined when it given %j', (input) => {
    expect(RISON.stringify(input)).toBeUndefined()
  })

  it.each(nullTests)('returns null when it given %j', (input) => {
    expect(RISON.stringify(input)).toBe('!n')
  })

  it('throws a TypeError when it given BigInt', () => {
    const bigint = BigInt('0')
    expect(() => RISON.stringify(bigint)).toThrow(TypeError)
  })

  it('ignores undefined in the object', () => {
    expect(RISON.stringify({ foo: undefined })).toBe('()')
  })

  it('ignores undefined in the array', () => {
    expect(RISON.stringify([undefined])).toBe('!(!n)')
  })
})

describe('ORISON.parse', () => {
  it.each(orisonTests)('returns %j when it given %j', (expected, input) => {
    expect(ORISON.parse(input)).toStrictEqual(expected)
  })

  it.each(syntaxErrors)('throws SyntaxError when it given %j', (input) => {
    expect(() => ORISON.parse(input)).toThrow(SyntaxError)
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

  it.each(syntaxErrors)('throws SyntaxError when it given %j', (input) => {
    expect(() => ARISON.parse(input)).toThrow(SyntaxError)
  })
})

describe('ARISON.stringify', () => {
  const flip = arisonTests.map((x) => [x[1], x[0]] as const)
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(ARISON.stringify(input)).toBe(expected)
  })
})
