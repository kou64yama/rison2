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

// A bare identifier cannot start with a digit or `-`; all characters exclude
// the ASCII space, quote, and Rison reserved punctuation.
const ID_REGEXP = /^[^0-9- '!:(),*@$][^ '!:(),*@$]*$/

/**
 * Serializes JavaScript values as Rison.
 */
export class Stringifier {
  /**
   * Serializes a supported JavaScript value as a complete Rison value.
   *
   * @param value - The value to serialize.
   * @returns The Rison representation, or `undefined` for `undefined` and
   * unsupported value types.
   * @throws {TypeError} If a BigInt is encountered.
   */
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

  /**
   * Serializes an object's entries without the surrounding Rison delimiters.
   * Properties whose values serialize to `undefined` are omitted.
   *
   * @param value - The object whose enumerable own properties to serialize.
   * @returns The comma-separated Rison key-value pairs.
   */
  public object(value: object): string {
    const pairs: string[] = []
    for (const [key, entryValue] of Object.entries(value)) {
      const str = this.value(entryValue)
      if (str === undefined) continue
      pairs.push(`${this.string(key)}${COLON}${str}`)
    }
    return pairs.join(COMMA)
  }

  /**
   * Serializes an array's elements without the surrounding Rison delimiters.
   * Elements that serialize to `undefined` are represented as Rison null.
   *
   * @param value - The array to serialize.
   * @returns The comma-separated Rison values.
   */
  public array(value: unknown[]): string {
    const values: string[] = []
    for (let i = 0; i < value.length; i++) {
      if (!(i in value)) continue
      values.push(this.value(value[i]) ?? NULL)
    }
    return values.join(COMMA)
  }

  /**
   * @param value - The boolean to serialize.
   * @returns The Rison boolean literal.
   */
  public boolean(value: boolean): string {
    return value ? TRUE : FALSE
  }

  /**
   * @param value - The number to serialize.
   * @returns The Rison number, or Rison null when the number is not finite.
   */
  public number(value: number): string {
    // Rison exponents omit the optional `+` accepted by JavaScript numbers.
    return Number.isFinite(value) ? value.toString().replace('+', '') : NULL
  }

  /**
   * @param value - The string to serialize.
   * @returns A bare identifier when allowed, otherwise a quoted Rison string.
   */
  public string(value: string): string {
    // Rison escapes both its escape marker and quote by prefixing them with `!`.
    return ID_REGEXP.test(value)
      ? value
      : `'${value.replace(/[!']/g, (c) => `!${c}`)}'`
  }
}
