export const NULL = '!n';
export const TRUE = '!t';
export const FALSE = '!f';
export const OBJECT_START = '(';
export const ARRAY_START = '!(';
export const OBJECT_ARRAY_END = ')';
export const COLON = ':';
export const COMMA = ',';
export const STRING = 'string';
export const NUMBER = 'number';

export type TokenKind =
  | typeof NULL
  | typeof TRUE
  | typeof FALSE
  | typeof OBJECT_START
  | typeof ARRAY_START
  | typeof OBJECT_ARRAY_END
  | typeof COLON
  | typeof COMMA
  | typeof STRING
  | typeof NUMBER;

export interface Token<T extends TokenKind = TokenKind> {
  kind: T;
  value: string;
}
