import {
  ARRAY_START,
  COLON,
  COMMA,
  FALSE,
  NULL,
  OBJECT_ARRAY_END,
  OBJECT_START,
  TRUE,
} from './token';

const ID_REGEXP = /^[^0-9- '!:(),*@$][^ '!:(),*@$]*$/;

export class Stringifier {
  public value(value: any): string | undefined {
    if (value === undefined) return undefined;
    if (value === null) return NULL;
    switch (typeof value) {
      case 'object':
        return Array.isArray(value)
          ? `${ARRAY_START}${this.array(value)}${OBJECT_ARRAY_END}`
          : `${OBJECT_START}${this.object(value)}${OBJECT_ARRAY_END}`;
      case 'boolean':
        return this.boolean(value);
      case 'number':
        return this.number(value);
      case 'string':
        return this.string(value);
      case 'bigint':
        throw new TypeError('Do not known how to serialize a BigInt');
      default:
        return undefined;
    }
  }

  public object(value: Record<string, any>): string {
    return Object.entries(value).reduce<string>((prev, [key, value]) => {
      const str = this.value(value);
      if (str === undefined) return prev;

      const pair = `${this.string(key)}${COLON}${str}`;
      return prev.length > 0 ? `${prev}${COMMA}${pair}` : pair;
    }, '');
  }

  public array(value: any[]): string {
    return value.reduce((prev, value) => {
      const str = this.value(value) || NULL;
      return prev.length > 0 ? `${prev}${COMMA}${str}` : str;
    }, '');
  }

  public boolean(value: boolean): string {
    return value ? TRUE : FALSE;
  }

  public number(value: number): string {
    return Number.isFinite(value) ? value.toString().replace('+', '') : NULL;
  }

  public string(value: string): string {
    return ID_REGEXP.test(value)
      ? value
      : `'${value.replace(/[!']/g, (c) => `!${c}`)}'`;
  }
}
