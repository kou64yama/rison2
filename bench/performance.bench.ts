import { bench, describe, expect } from 'vitest'
import { Lexer } from '../src/lexer'
import { Stringifier } from '../src/stringifier'
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
} from '../src/token'

type Rule<T extends TokenKind> = (
  source: string,
  pos: number
) => Token<T> | null

const baselineRules = {
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
    <T extends TokenKind>(kind: T, regexp: RegExp): Rule<T> =>
    (source, pos) => {
      const match = regexp.exec(source.slice(pos))
      return match === null ? null : { kind, value: match[0] }
    }
}

// Issue #77 baseline: Lexer rules before sticky regular expressions.
const BASELINE_RULES: Array<Rule<TokenKind>> = [
  baselineRules.quote(),
  baselineRules.string(OBJECT_START),
  baselineRules.string(ARRAY_START),
  baselineRules.string(OBJECT_ARRAY_END),
  baselineRules.string(NULL),
  baselineRules.string(TRUE),
  baselineRules.string(FALSE),
  baselineRules.string(COLON),
  baselineRules.string(COMMA),
  baselineRules.regexp(STRING, /^[^0-9- '!:(),*@$][^ '!:(),*@$]*/),
  baselineRules.regexp(NUMBER, /^-?([1-9][0-9]*|[0-9])(\.[0-9]+)?(e-?[0-9]+)?/)
]

class BaselineLexer {
  #pos = 0

  public constructor(private readonly source: string) {}

  public nextToken(): Token<TokenKind> | null {
    if (this.#pos >= this.source.length) return null

    for (const rule of BASELINE_RULES) {
      const token = rule(this.source, this.#pos)
      if (token !== null) {
        this.#pos += token.value.length
        return token
      }
    }

    throw new SyntaxError(
      `Unexpected token ${this.source[this.#pos]} in Rison at position ${
        this.#pos
      }`
    )
  }
}

function collect(lexer: Pick<Lexer, 'nextToken'>): Token<TokenKind>[] {
  const tokens: Token<TokenKind>[] = []
  let token = lexer.nextToken()
  while (token !== null) {
    tokens.push(token)
    token = lexer.nextToken()
  }
  return tokens
}

function consume(lexer: Pick<Lexer, 'nextToken'>): number {
  let checksum = 0
  let token = lexer.nextToken()
  while (token !== null) {
    checksum = (checksum * 31 + token.kind.length + token.value.length) | 0
    token = lexer.nextToken()
  }
  return checksum
}

// Issue #77 baseline: collection serialization before Array.join.
class BaselineStringifier extends Stringifier {
  public override object(value: object): string {
    return Object.entries(value).reduce<string>((previous, [key, value]) => {
      const serialized = this.value(value)
      if (serialized === undefined) return previous

      const pair = `${this.string(key)}${COLON}${serialized}`
      return previous.length > 0 ? `${previous}${COMMA}${pair}` : pair
    }, '')
  }

  public override array(value: unknown[]): string {
    return value.reduce<string>((previous, value) => {
      const serialized = this.value(value) ?? NULL
      return previous.length > 0
        ? `${previous}${COMMA}${serialized}`
        : serialized
    }, '')
  }
}

const collection = Array.from({ length: 5_000 }, (_, index) =>
  index % 3 === 0 ? undefined : index
)
const benchOptions = { time: 1_500, warmupTime: 1_000 }

function readMiddle(value: string): number {
  return value.charCodeAt(Math.floor(value.length / 2))
}

const baselineStringifier = new BaselineStringifier()
const stringifier = new Stringifier()
expect(stringifier.array(collection)).toBe(
  baselineStringifier.array(collection)
)

for (const size of [100, 1_000, 10_000]) {
  const entries = Array.from(
    { length: size },
    (_, index) => [`key${index}`, index] as const
  )
  const rison = `(${entries
    .map(([key, value]) => `${key}:${value}`)
    .join(',')})`

  const baselineTokens = collect(new BaselineLexer(rison))
  expect(collect(new Lexer(rison))).toStrictEqual(baselineTokens)

  describe(`Lexer (${size.toLocaleString()} entries)`, () => {
    bench(
      'source.slice baseline',
      () => consume(new BaselineLexer(rison)),
      benchOptions
    )

    bench('sticky regexp', () => consume(new Lexer(rison)), benchOptions)
  })
}

describe('Stringifier', () => {
  bench(
    'reduce baseline',
    () => readMiddle(baselineStringifier.array(collection)),
    benchOptions
  )

  bench('join', () => readMiddle(stringifier.array(collection)), benchOptions)
})
