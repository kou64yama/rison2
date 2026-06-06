import { Lexer } from './lexer'
import {
  COLON,
  FALSE,
  NUMBER,
  OBJECT_ARRAY_END,
  OBJECT_START,
  STRING,
  TRUE
} from './token'

describe('Lexer', () => {
  it('recognizes identifiers and numbers away from the start', () => {
    const lexer = new Lexer('(answer:42)')

    expect([
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken(),
      lexer.nextToken()
    ]).toStrictEqual([
      { kind: OBJECT_START, value: '(' },
      { kind: STRING, value: 'answer' },
      { kind: COLON, value: ':' },
      { kind: NUMBER, value: '42' },
      { kind: OBJECT_ARRAY_END, value: ')' }
    ])
  })

  it('recognizes consecutive tokens', () => {
    const lexer = new Lexer('!t!f')

    expect(lexer.nextToken()).toStrictEqual({ kind: TRUE, value: '!t' })
    expect(lexer.nextToken()).toStrictEqual({ kind: FALSE, value: '!f' })
    expect(lexer.nextToken()).toBeNull()
  })

  it('reports the position of an invalid character', () => {
    const lexer = new Lexer('valid*invalid')

    expect(lexer.nextToken()).toStrictEqual({ kind: STRING, value: 'valid' })
    expect(() => lexer.nextToken()).toThrow(
      'Unexpected token * in Rison at position 5'
    )
  })
})
