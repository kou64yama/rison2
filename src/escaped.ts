import * as rison from './rison'

// These URI characters and Rison punctuation need no percent-encoding.
const ESCAPE_NO_REQUIRED = /^[-A-Za-z0-9~!*()_.',:@$/]*$/

/**
 * Escapes Rison text for URLs while preserving Rison-safe punctuation.
 *
 * This uses `encodeURIComponent`, then restores selected punctuation and
 * encodes spaces as `+`.
 *
 * See https://github.com/Nanonid/rison/blob/e64af6c096fd30950ec32cfd48526ca6ee21649d/js/rison.js#L107-L118
 *
 * This function is licensed under the MIT license found in the
 * https://github.com/Nanonid/rison/blob/e64af6c096fd30950ec32cfd48526ca6ee21649d/LICENSE.md.
 *
 * @param str - The Rison text to escape.
 * @returns The URL-escaped Rison text.
 * @example
 * _escape('hello world') // 'hello+world'
 */
const _escape = (str: string): string => {
  if (ESCAPE_NO_REQUIRED.test(str)) return str

  return encodeURIComponent(str)
    .replace(/%2C/g, ',')
    .replace(/%3A/g, ':')
    .replace(/%40/g, '@')
    .replace(/%24/g, '$')
    .replace(/%2F/g, '/')
    .replace(/%20/g, '+')
}

/**
 * Decodes URL-escaped Rison text, treating `+` as a space before decoding.
 *
 * @param str - The URL-escaped Rison text to decode.
 * @returns The decoded Rison text.
 * @example
 * _unescape('hello+world') // 'hello world'
 */
const _unescape = (str: string): string =>
  decodeURIComponent(str.replace(/\+/g, '%20'))

const RISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => rison.RISON.parse(_unescape(text)),
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: any): string => _escape(rison.RISON.stringify(value))
}

const ORISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => rison.ORISON.parse(_unescape(text)),
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: Record<string, any>): string =>
    _escape(rison.ORISON.stringify(value))
}

const ARISON = {
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  parse: (text: string): any => rison.ARISON.parse(_unescape(text)),
  // biome-ignore lint/suspicious/noExplicitAny: External API requires `any` or complex type inference is not feasible.
  stringify: (value: any[]): string => _escape(rison.ARISON.stringify(value))
}

const parse = RISON.parse
const stringify = RISON.stringify

export {
  ARISON,
  ORISON,
  RISON,
  _escape as escape,
  parse,
  stringify,
  _unescape as unescape
}
