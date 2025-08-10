import { Lexer } from './lexer'
import { Parser } from './parser'
import { Stringifier } from './stringifier'

export const RISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => {
    const lexer = new Lexer(text)
    const parser = new Parser(lexer)
    return parser.readAsAny()
  },
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: any): string => {
    const stringifier = new Stringifier()
    return stringifier.value(value) as string
  }
}

export const ORISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => {
    const lexer = new Lexer(`(${text})`)
    const parser = new Parser(lexer)
    return parser.readAsAny()
  },
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: Record<string, any>): string => {
    const stringifier = new Stringifier()
    return stringifier.object(value)
  }
}

export const ARISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => {
    const lexer = new Lexer(`!(${text})`)
    const parser = new Parser(lexer)
    return parser.readAsAny()
  },
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: any[]): string => {
    const stringifier = new Stringifier()
    return stringifier.array(value)
  }
}
