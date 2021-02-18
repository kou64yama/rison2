import * as rison from './rison';

const ESCAPE_NO_REQUIRED = /^[-A-Za-z0-9~!*()_.',:@$/]*$/;

/**
 * this is like encodeURIComponent() but quotes fewer characters.
 *
 * See https://github.com/Nanonid/rison/blob/e64af6c096fd30950ec32cfd48526ca6ee21649d/js/rison.js#L107-L118
 *
 * This function is licensed under the MIT license found in the
 * https://github.com/Nanonid/rison/blob/e64af6c096fd30950ec32cfd48526ca6ee21649d/LICENSE.md.
 *
 * @param str
 */
const escape = (str: string) => {
  if (ESCAPE_NO_REQUIRED.test(str)) return str;

  return encodeURIComponent(str)
    .replace(/%2C/g, ',')
    .replace(/%3A/g, ':')
    .replace(/%40/g, '@')
    .replace(/%24/g, '$')
    .replace(/%2F/g, '/')
    .replace(/%20/g, '+');
};

const unescape = (str: string) => decodeURIComponent(str.replace(/\+/g, '%20'));

const RISON = {
  parse: (text: string): any => rison.RISON.parse(unescape(text)),
  stringify: (value: any): string => escape(rison.RISON.stringify(value)),
};

const ORISON = {
  parse: (text: string): any => rison.ORISON.parse(unescape(text)),
  stringify: (value: Record<string, any>): string =>
    escape(rison.ORISON.stringify(value)),
};

const ARISON = {
  parse: (text: string): any => rison.ARISON.parse(unescape(text)),
  stringify: (value: any[]): string => escape(rison.ARISON.stringify(value)),
};

const parse = RISON.parse;
const stringify = RISON.stringify;

export {
  RISON as default,
  RISON,
  ORISON,
  ARISON,
  parse,
  stringify,
  escape,
  unescape,
};
