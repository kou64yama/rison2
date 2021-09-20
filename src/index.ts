import * as escaped from './escaped';
import { ARISON, ORISON, RISON } from './rison';

const parse = RISON.parse;
const stringify = RISON.stringify;
const escape = escaped.escape;
const unescape = escaped.unescape;

export {
  RISON as default,
  RISON,
  ORISON,
  ARISON,
  parse,
  stringify,
  escape,
  unescape,
  escaped,
};
