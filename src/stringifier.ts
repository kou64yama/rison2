import {
  ARRAY_START,
  COLON,
  COMMA,
  FALSE,
  NULL,
  OBJECT_ARRAY_END,
  OBJECT_START,
  TRUE
} from './token'

const ID_REGEXP = /^[^0-9- '!:(),*@$][^ '!:(),*@$]*$/

export class Stringifier {
  public value(value: unknown): string | undefined {
    if (value === undefined) return undefined
    if (value === null) return NULL
    switch (typeof value) {
      case 'object':
        return Array.isArray(value)
          ? `${ARRAY_START}${this.array(value)}${OBJECT_ARRAY_END}`
          : `${OBJECT_START}${this.object(value)}${OBJECT_ARRAY_END}`
      case 'boolean':
        return this.boolean(value)
      case 'number':
        return this.number(value)
      case 'string':
        return this.string(value)
      case 'bigint':
        throw new TypeError('Do not known how to serialize a BigInt')
      default:
        return undefined
    }
  }

  public object(value: object): string {
    return Object.entries(value)
      .flatMap(([key, value]) => {
        const str = this.value(value)
        return str === undefined ? [] : `${this.string(key)}${COLON}${str}`
      })
      .join(COMMA)
  }

  public array(value: unknown[]): string {
    return value.map((value) => this.value(value) ?? NULL).join(COMMA)
  }

  public boolean(value: boolean): string {
    return value ? TRUE : FALSE
  }

  public number(value: number): string {
    return Number.isFinite(value) ? value.toString().replace('+', '') : NULL
  }

  public string(value: string): string {
    return ID_REGEXP.test(value)
      ? value
      : `'${value.replace(/[!']/g, (c) => `!${c}`)}'`
  }
}
