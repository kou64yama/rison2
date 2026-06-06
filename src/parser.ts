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
      this.nextToken()
      throw this.#lexer.currentTokenSyntaxError()
    }
    return val
  }

  private asAny(kind: TokenKind): unknown {
    switch (kind) {
      case NULL:
        return null
      case TRUE:
        return true
      case FALSE:
        return false
      case STRING:
        return this.asString()
      case NUMBER:
        return Number(this.#lexer.currentTokenValue())
      case OBJECT_START:
        return this.readAsObject()
      case ARRAY_START:
        return this.readAsArray()
      default:
        throw this.#lexer.currentTokenSyntaxError()
    }
  }

  private asString(): string {
    const value = this.#lexer.currentTokenValue()
    if (value[0] !== "'") return value
    if (!this.#lexer.currentQuotedStringHasEscape()) {
      return value.slice(1, -1)
    }
    return this.#lexer.currentDecodedQuotedString()
  }

  private readAsObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {}
    let kind = this.nextToken()
    while (kind !== OBJECT_ARRAY_END) {
      const key = this.asString()
      this.expectToken(COLON)
      const val = this.asAny(this.nextToken())
      obj[key] = val

      kind = this.nextToken()
      if (kind === OBJECT_ARRAY_END) break
      if (kind !== COMMA) throw this.#lexer.currentTokenSyntaxError()
      kind = this.nextToken()
    }
    return obj
  }

  private readAsArray(): unknown[] {
    const arr: unknown[] = []
    let kind = this.nextToken()
    while (kind !== OBJECT_ARRAY_END) {
      arr.push(this.asAny(kind))
      kind = this.nextToken()
      if (kind === OBJECT_ARRAY_END) break
      if (kind !== COMMA) throw this.#lexer.currentTokenSyntaxError()
      kind = this.nextToken()
    }
    return arr
  }

  private expectToken<T extends TokenKind>(kind: T): void {
    if (this.nextToken() !== kind) {
      throw this.#lexer.currentTokenSyntaxError()
    }
  }

  private nextToken(): TokenKind {
    const kind = this.#lexer.nextTokenKind()
    if (kind === null) throw new SyntaxError('Unexpected end of Rison input')
    return kind
  }
}
