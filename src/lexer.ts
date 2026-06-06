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

// A bare identifier cannot start with a digit or `-`; all characters exclude
// the ASCII space, quote, and Rison reserved punctuation.
const STRING_REGEXP = /[^0-9- '!:(),*@$][^ '!:(),*@$]*/y
// Numbers use a zero or non-zero-leading integer with optional fraction and exponent.
const NUMBER_REGEXP = /-?([1-9][0-9]*|[0-9])(\.[0-9]+)?(e-?[0-9]+)?/y

/**
 * Tokenizes a Rison source string while tracking the current position.
 */
export class Lexer {
  #currentTokenPosition = 0
  #currentTokenValue = ''
  #decodedQuotedString = ''
  #pos = 0
  #quotedStringHasEscape = false
  #source: string

  /**
   * Creates a lexer for a Rison source string.
   *
   * @param source - The Rison source to tokenize.
   */
  public constructor(source: string) {
    this.#source = source
  }

  /**
   * @returns The zero-based offset of the next unread UTF-16 code unit.
   */
  public position(): number {
    return this.#pos
  }

  /**
   * @returns The source string's length in UTF-16 code units.
   */
  public length(): number {
    return this.#source.length
  }

  /**
   * @returns The value of the most recently read token.
   */
  public currentTokenValue(): string {
    return this.#currentTokenValue
  }

  /**
   * @returns The position of the most recently read token.
   */
  public currentTokenPosition(): number {
    return this.#currentTokenPosition
  }

  /**
   * @returns Whether the most recently read token was a quoted string with an
   * escape marker.
   */
  public currentQuotedStringHasEscape(): boolean {
    return this.#quotedStringHasEscape
  }

  /**
   * @returns The decoded value of the most recently read quoted string.
   */
  public currentDecodedQuotedString(): string {
    return this.#decodedQuotedString
  }

  /**
   * Reads the next token and advances the current position.
   *
   * @returns The next token, or `null` when the source has been consumed.
   * @throws {SyntaxError} If the source contains an invalid token or an
   * unterminated quoted string.
   */
  public nextToken(): Token<TokenKind> | null {
    const kind = this.nextTokenKind()
    if (kind === null) return null

    return {
      kind,
      value: this.#currentTokenValue,
      position: this.#currentTokenPosition
    }
  }

  /**
   * Reads the next token without allocating a token object.
   *
   * @returns The next token kind, or `null` when the source has been consumed.
   * @throws {SyntaxError} If the source contains an invalid token or an
   * unterminated quoted string.
   */
  public nextTokenKind(): TokenKind | null {
    if (this.#pos >= this.#source.length) return null

    const current = this.#source.charAt(this.#pos)
    switch (current) {
      case "'":
        return this.#readQuotedString()
      case '(':
        return this.#createToken(OBJECT_START)
      case ')':
        return this.#createToken(OBJECT_ARRAY_END)
      case ':':
        return this.#createToken(COLON)
      case ',':
        return this.#createToken(COMMA)
      case '!':
        switch (this.#source[this.#pos + 1]) {
          case '(':
            return this.#createToken(ARRAY_START)
          case 'n':
            return this.#createToken(NULL)
          case 't':
            return this.#createToken(TRUE)
          case 'f':
            return this.#createToken(FALSE)
        }
    }

    const numberStart = current === '-' || (current >= '0' && current <= '9')
    const kind = numberStart
      ? this.#readRegexp(NUMBER, NUMBER_REGEXP)
      : this.#readRegexp(STRING, STRING_REGEXP)
    if (kind !== null) return kind

    throw new SyntaxError(
      `Unexpected token ${this.#source[this.#pos]} in Rison at position ${
        this.#pos
      }`
    )
  }

  #readRegexp<T extends TokenKind>(kind: T, regexp: RegExp): T | null {
    regexp.lastIndex = this.#pos
    const match = regexp.exec(this.#source)
    return match === null ? null : this.#createToken(kind, match[0])
  }

  #createToken<T extends TokenKind>(kind: T, value: string = kind): T {
    this.#currentTokenPosition = this.#pos
    this.#currentTokenValue = value
    this.#quotedStringHasEscape = false
    this.#pos += value.length
    return kind
  }

  #readQuotedString(): typeof STRING {
    const start = this.#pos
    let end = start
    let hasEscape = false
    let segmentStart = start + 1
    this.#decodedQuotedString = ''
    while (true) {
      if (this.#source.length <= ++end) {
        throw new SyntaxError('Unexpected end of Rison input')
      }
      switch (this.#source[end]) {
        case '!':
          // In a quoted string, `!` escapes the following character.
          hasEscape = true
          this.#decodedQuotedString += this.#source.slice(segmentStart, end)
          end++
          this.#decodedQuotedString += this.#source[end]
          segmentStart = end + 1
          continue
        case "'": {
          const token = this.#createToken(
            STRING,
            this.#source.slice(start, end + 1)
          )
          this.#quotedStringHasEscape = hasEscape
          if (hasEscape) {
            this.#decodedQuotedString += this.#source.slice(segmentStart, end)
          }
          return token
        }
      }
    }
  }

  /**
   * Creates an error for the most recently consumed token.
   *
   * @param token - The unexpected token.
   * @returns A syntax error containing the token and its source position.
   */
  public syntaxError(token: Token): SyntaxError {
    return this.#syntaxError(token.position)
  }

  /**
   * Creates an error for the most recently consumed token.
   *
   * @returns A syntax error containing the token and its source position.
   */
  public currentTokenSyntaxError(): SyntaxError {
    return this.#syntaxError(this.#currentTokenPosition)
  }

  #syntaxError(position: number): SyntaxError {
    return new SyntaxError(
      `Unexpected token ${this.#source[position]} in Rison at position ${position}`
    )
  }
}
