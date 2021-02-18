import { Lexer } from './lexer';
import { Parser } from './parser';
import { Stringifier } from './stringifier';

export const RISON = {
  parse: (text: string): any => {
    const lexer = new Lexer(text);
    const parser = new Parser(lexer);
    return parser.readAsAny();
  },
  stringify: (value: any): string => {
    const stringifier = new Stringifier();
    return stringifier.value(value) as string;
  },
};

export const ORISON = {
  parse: (text: string): any => {
    const lexer = new Lexer(`(${text})`);
    const parser = new Parser(lexer);
    return parser.readAsAny();
  },
  stringify: (value: Record<string, any>): string => {
    const stringifier = new Stringifier();
    return stringifier.object(value);
  },
};

export const ARISON = {
  parse: (text: string): any => {
    const lexer = new Lexer(`!(${text})`);
    const parser = new Parser(lexer);
    return parser.readAsAny();
  },
  stringify: (value: any[]): string => {
    const stringifier = new Stringifier();
    return stringifier.array(value);
  },
};
