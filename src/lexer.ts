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
          i++
          continue
        case "'":
          return { kind: STRING, value: source.slice(pos, i + 1) }
      }
    }
  },
  string:
    <T extends TokenKind>(kind: T): Rule<T> =>
    (source, pos) =>
      source.startsWith(kind, pos) ? { kind, value: kind } : null,
  regexp:
    <T extends TokenKind>(kind: T, reg: RegExp): Rule<T> =>
    (source, pos) => {
      const match = reg.exec(source.slice(pos))
      return match != null ? { kind, value: match[0] } : null
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
  rules.regexp(STRING, /^[^0-9- '!:(),*@$][^ '!:(),*@$]*/),
  rules.regexp(NUMBER, /^-?([1-9][0-9]*|[0-9])(\.[0-9]+)?(e-?[0-9]+)?/)
]

export class Lexer {
  #pos = 0
  #source: string

  public constructor(source: string) {
    this.#source = source
  }

  public position(): number {
    return this.#pos
  }

  public length(): number {
    return this.#source.length
  }

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

  public syntaxError(token: Token): SyntaxError {
    const pos = this.#pos - token.value.length
    return new SyntaxError(
      `Unexpected token ${this.#source[pos]} in Rison at position ${pos}`
    )
  }
}
