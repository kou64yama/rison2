import { Lexer } from './lexer'

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
