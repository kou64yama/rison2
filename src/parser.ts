import type { Lexer } from './lexer'
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
  type Token,
  type TokenKind
} from './token'

/**
 * Parses tokens from a lexer into JavaScript values.
 */
export class Parser {
  readonly #lexer: Lexer

  /**
   * Creates a parser backed by a lexer.
   *
   * @param lexer - The lexer that provides Rison tokens.
   */
  public constructor(lexer: Lexer) {
    this.#lexer = lexer
  }

  /**
   * Parses one complete Rison value.
   *
   * @returns The JavaScript value represented by the Rison input.
   * @throws {SyntaxError} If the input is empty, malformed, or contains tokens
   * after the parsed value.
   */
  public readAsAny(): unknown {
    const val = this.asAny(this.nextToken())
    if (this.#lexer.position() < this.#lexer.length()) {
      throw this.#lexer.syntaxError(this.nextToken())
    }
    return val
  }

  private asAny(token: Token): unknown {
    switch (token.kind) {
      case NULL:
        return null
      case TRUE:
        return true
      case FALSE:
        return false
      case STRING:
        return this.asString(token)
      case NUMBER:
        return Number(token.value)
      case OBJECT_START:
        return this.readAsObject()
      case ARRAY_START:
        return this.readAsArray()
      default:
        throw this.#lexer.syntaxError(token)
    }
  }

  private asString(token: Token): string {
    if (token.value[0] !== "'") return token.value
    if (!this.#lexer.quotedStringHasEscape(token)) {
      return token.value.slice(1, -1)
    }

    const end = token.value.length - 1
    let decoded = ''
    let segmentStart = 1
    for (let index = 1; index < end; index++) {
      if (token.value[index] !== '!') continue
      decoded += token.value.slice(segmentStart, index)
      decoded += token.value[++index]
      segmentStart = index + 1
    }
    return decoded + token.value.slice(segmentStart, end)
  }

  private readAsObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {}
    let token = this.nextToken()
    while (token.kind !== OBJECT_ARRAY_END) {
      const key = this.asString(token)
      this.expectToken(COLON)
      const val = this.asAny(this.nextToken())
      obj[key] = val

      token = this.nextToken()
      if (token.kind === OBJECT_ARRAY_END) break
      if (token.kind !== COMMA) throw this.#lexer.syntaxError(token)
      token = this.nextToken()
    }
    return obj
  }

  private readAsArray(): unknown[] {
    const arr: unknown[] = []
    let token = this.nextToken()
    while (token.kind !== OBJECT_ARRAY_END) {
      arr.push(this.asAny(token))
      token = this.nextToken()
      if (token.kind === OBJECT_ARRAY_END) break
      if (token.kind !== COMMA) throw this.#lexer.syntaxError(token)
      token = this.nextToken()
    }
    return arr
  }

  private expectToken<T extends TokenKind>(kind: T): void {
    const token = this.nextToken()
    if (token.kind !== kind) throw this.#lexer.syntaxError(token)
  }

  private nextToken(): Token {
    const token = this.#lexer.nextToken()
    if (token == null) throw new SyntaxError('Unexpected end of Rison input')
    return token
  }
}
