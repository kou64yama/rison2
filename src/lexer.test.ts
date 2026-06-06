import { Lexer } from './lexer'
import {
  ARRAY_START,
  COLON,
  COMMA,
  FALSE,
  NULL,
  NUMBER,
  OBJECT_ARRAY_END,
  OBJECT_START,
  STRING,
  TRUE,
  type Token
} from './token'

describe('Lexer.nextToken', () => {
  it.each<[string, Token]>([
    [
      "'hello!! !'world'",
      { kind: STRING, value: "'hello!! !'world'", position: 0 }
    ],
    ['(', { kind: OBJECT_START, value: '(', position: 0 }],
    [')', { kind: OBJECT_ARRAY_END, value: ')', position: 0 }],
    [':', { kind: COLON, value: ':', position: 0 }],
    [',', { kind: COMMA, value: ',', position: 0 }],
    ['!(', { kind: ARRAY_START, value: '!(', position: 0 }],
    ['!n', { kind: NULL, value: '!n', position: 0 }],
    ['!t', { kind: TRUE, value: '!t', position: 0 }],
    ['!f', { kind: FALSE, value: '!f', position: 0 }],
    ['-12.5e-2', { kind: NUMBER, value: '-12.5e-2', position: 0 }],
    ['field-123', { kind: STRING, value: 'field-123', position: 0 }]
  ])('dispatches the first character of %j', (source, token) => {
    const lexer = new Lexer(source)

    expect(lexer.nextToken()).toStrictEqual(token)
    expect(lexer.position()).toBe(source.length)
    expect(lexer.nextToken()).toBeNull()
  })

  it.each([
    [
      '123field',
      [
        { kind: NUMBER, value: '123', position: 0 },
        { kind: STRING, value: 'field', position: 3 }
      ]
    ],
    [
      '!tfield',
      [
        { kind: TRUE, value: '!t', position: 0 },
        { kind: STRING, value: 'field', position: 2 }
      ]
    ],
    [
      '01',
      [
        { kind: NUMBER, value: '0', position: 0 },
        { kind: NUMBER, value: '1', position: 1 }
      ]
    ]
  ])('preserves partial tokenization of %j', (source, tokens) => {
    const lexer = new Lexer(source)

    expect(tokens.map(() => lexer.nextToken())).toStrictEqual(tokens)
    expect(lexer.nextToken()).toBeNull()
  })

  it.each([
    ['!', 0, 'Unexpected token ! in Rison at position 0'],
    ['!x', 0, 'Unexpected token ! in Rison at position 0'],
    [' ', 0, 'Unexpected token   in Rison at position 0'],
    ['*', 0, 'Unexpected token * in Rison at position 0'],
    ['@', 0, 'Unexpected token @ in Rison at position 0'],
    ['$', 0, 'Unexpected token $ in Rison at position 0'],
    ['foo@', 1, 'Unexpected token @ in Rison at position 3'],
    ['(-x', 1, 'Unexpected token - in Rison at position 1']
  ])('rejects reserved or invalid characters in %j', (source, consumedTokens, message) => {
    const lexer = new Lexer(source)
    for (let i = 0; i < consumedTokens; i++) lexer.nextToken()

    expect(() => lexer.nextToken()).toThrowError(message)
  })

  it.each([
    "'",
    "'escaped!'",
    "'trailing!",
    "'こんにちは!"
  ])('preserves unterminated quote errors for %j', (source) => {
    expect(() => new Lexer(source).nextToken()).toThrowError(
      'Unexpected end of Rison input'
    )
  })

  it.each([
    ["'hello world'", false],
    ["'hello!! !'world'", true],
    ['hello', false]
  ])('records whether %j contains quoted escapes', (source, expected) => {
    const lexer = new Lexer(source)
    const token = lexer.nextToken()

    if (token === null) throw new Error('Expected a token')
    expect(lexer.quotedStringHasEscape(token)).toBe(expected)
  })

  it('tracks positions across every fixed-token branch', () => {
    const lexer = new Lexer('():,!(!n!t!f')

    expect([
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken()
    ]).toStrictEqual([
      { kind: OBJECT_START, value: '(', position: 0 },
      { kind: OBJECT_ARRAY_END, value: ')', position: 1 },
      { kind: COLON, value: ':', position: 2 },
      { kind: COMMA, value: ',', position: 3 },
      { kind: ARRAY_START, value: '!(', position: 4 },
      { kind: NULL, value: '!n', position: 6 },
      { kind: TRUE, value: '!t', position: 8 },
      { kind: FALSE, value: '!f', position: 10 },
      null
    ])
  })
})

describe('Lexer.nextTokenKind', () => {
  it('updates current token state without changing nextToken output', () => {
    const lexer = new Lexer("!('hello world',!t)")

    expect(lexer.nextTokenKind()).toBe(ARRAY_START)
    expect(lexer.currentTokenKind()).toBe(ARRAY_START)
    expect(lexer.currentTokenValue()).toBe('!(')
    expect(lexer.currentTokenPosition()).toBe(0)
    expect(lexer.nextTokenKind()).toBe(STRING)
    expect(lexer.currentTokenValue()).toBe("'hello world'")
    expect(lexer.currentTokenPosition()).toBe(2)
    expect(lexer.currentQuotedStringHasEscape()).toBe(false)
    expect(lexer.nextToken()).toStrictEqual({
      kind: COMMA,
      value: ',',
      position: 15
    })
  })

  it('retains raw and decoded values for escaped quoted strings', () => {
    const lexer = new Lexer("'hello!! !'world'")

    expect(lexer.nextTokenKind()).toBe(STRING)
    expect(lexer.currentTokenValue()).toBe("'hello!! !'world'")
    expect(lexer.currentQuotedStringHasEscape()).toBe(true)
    expect(lexer.currentDecodedQuotedString()).toBe("hello! 'world")
  })
})

describe('Lexer.syntaxError', () => {
  it.each([
    ["('hello'", "Unexpected token ' in Rison at position 1"],
    ['hello,world', 'Unexpected token , in Rison at position 5'],
    ['(hello', 'Unexpected token h in Rison at position 1']
  ])('reports the position of a token after the start of %j', (source, message) => {
    const lexer = new Lexer(source)
    lexer.nextToken()
    const token = lexer.nextToken()

    if (token === null) throw new Error('Expected a token')
    expect(lexer.syntaxError(token)).toHaveProperty('message', message)
  })

  it('does not derive the position from the token value', () => {
    const lexer = new Lexer('(hello')
    lexer.nextToken()
    const token = lexer.nextToken()

    if (token === null) throw new Error('Expected a token')
    token.value = 'a different length'

    expect(lexer.syntaxError(token)).toHaveProperty(
      'message',
      'Unexpected token h in Rison at position 1'
    )
  })
})
