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

type Rule<T extends TokenKind> = (
  source: string,
  pos: number
) => Token<T> | null

const rules = {
  quote: (): Rule<typeof STRING> => (source, pos) => {
    if (!source.startsWith("'", pos)) return null

    let i = pos
    while (true) {
      if (source.length <= ++i) {
        throw new SyntaxError('Unexpected end of Rison input')
      }
      switch (source[i]) {
        case '!':
          // In a quoted string, `!` escapes the following character.
          i++
          continue
        case "'":
          return {
            kind: STRING,
            value: source.slice(pos, i + 1),
            position: pos
          }
      }
    }
  },
  string:
    <T extends TokenKind>(kind: T): Rule<T> =>
    (source, pos) =>
      source.startsWith(kind, pos)
        ? { kind, value: kind, position: pos }
        : null,
  regexp: <T extends TokenKind>(kind: T, reg: RegExp): Rule<T> => {
    const sticky = new RegExp(
      reg.source,
      reg.sticky ? reg.flags : `${reg.flags}y`
    )

    return (source, pos) => {
      sticky.lastIndex = pos
      const match = sticky.exec(source)
      return match != null ? { kind, value: match[0], position: pos } : null
    }
  }
}

const RULES: Array<Rule<TokenKind>> = [
  rules.quote(),
  rules.string(OBJECT_START),
  rules.string(ARRAY_START),
  rules.string(OBJECT_ARRAY_END),
  rules.string(NULL),
  rules.string(TRUE),
  rules.string(FALSE),
  rules.string(COLON),
  rules.string(COMMA),
  // A bare identifier cannot start with a digit or `-`; all characters exclude
  // the ASCII space, quote, and Rison reserved punctuation.
  rules.regexp(STRING, /[^0-9- '!:(),*@$][^ '!:(),*@$]*/),
  // Numbers use a zero or non-zero-leading integer with optional fraction and exponent.
  rules.regexp(NUMBER, /-?([1-9][0-9]*|[0-9])(\.[0-9]+)?(e-?[0-9]+)?/)
]

/**
 * Tokenizes a Rison source string while tracking the current position.
 */
export class Lexer {
  #pos = 0
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
   * Reads the next token and advances the current position.
   *
   * @returns The next token, or `null` when the source has been consumed.
   * @throws {SyntaxError} If the source contains an invalid token or an
   * unterminated quoted string.
   */
  public nextToken(): Token<TokenKind> | null {
    if (this.#pos >= this.#source.length) return null

    for (const rule of RULES) {
      const token = rule(this.#source, this.#pos)
      if (token !== null) {
        this.#pos += token.value.length
        return token
      }
    }

    throw new SyntaxError(
      `Unexpected token ${this.#source[this.#pos]} in Rison at position ${
        this.#pos
      }`
    )
  }

  /**
   * Creates an error for the most recently consumed token.
   *
   * @param token - The unexpected token.
   * @returns A syntax error containing the token and its source position.
   */
  public syntaxError(token: Token): SyntaxError {
    return new SyntaxError(
      `Unexpected token ${this.#source[token.position]} in Rison at position ${
        token.position
      }`
    )
  }
}
