import {
  NULL,
  TRUE,
  FALSE,
  OBJECT_START,
  ARRAY_START,
  OBJECT_ARRAY_END,
  COLON,
  COMMA,
  NUMBER,
  STRING,
  Token,
  TokenKind,
} from './token';
import { Lexer } from './lexer';

export class Parser {
  public constructor(private readonly lexer: Lexer) {}

  public readAsAny(): any {
    const val = this.asAny(this.nextToken());
    if (this.lexer.position() < this.lexer.length()) {
      throw this.lexer.syntaxError(this.nextToken());
    }
    return val;
  }

  private asAny(token: Token): any {
    switch (token.kind) {
      case NULL:
        return null;
      case TRUE:
        return true;
      case FALSE:
        return false;
      case STRING:
        return this.asString(token);
      case NUMBER:
        return Number(token.value);
      case OBJECT_START:
        return this.readAsObject();
      case ARRAY_START:
        return this.readAsArray();
      default:
        throw this.lexer.syntaxError(token);
    }
  }

  private asString(token: Token): string {
    return token.value[0] === "'"
      ? token.value.replace(/!./g, (c) => c[1]).slice(1, -1)
      : token.value;
  }

  private readAsObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    let token = this.nextToken();
    while (token.kind !== OBJECT_ARRAY_END) {
      const key = this.asString(token);
      this.expectToken(COLON);
      const val = this.asAny(this.nextToken());
      obj[key] = val;

      token = this.nextToken();
      if (token.kind === OBJECT_ARRAY_END) break;
      if (token.kind !== COMMA) throw this.lexer.syntaxError(token);
      token = this.nextToken();
    }
    return obj;
  }

  private readAsArray(): any[] {
    const arr: any[] = [];
    let token = this.nextToken();
    while (token.kind !== OBJECT_ARRAY_END) {
      arr.push(this.asAny(token));
      token = this.nextToken();
      if (token.kind === OBJECT_ARRAY_END) break;
      if (token.kind !== COMMA) throw this.lexer.syntaxError(token);
      token = this.nextToken();
    }
    return arr;
  }

  private expectToken<T extends TokenKind>(kind: T) {
    const token = this.nextToken();
    if (token.kind !== kind) throw this.lexer.syntaxError(token);
  }

  private nextToken(): Token {
    const token = this.lexer.nextToken();
    if (!token) throw new SyntaxError(`Unexpected end of Rison input`);
    return token;
  }
}
