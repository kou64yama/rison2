/* eslint-env jest */

import { RISON, ORISON, ARISON } from '../src/escaped';

const risonTests: [any, string][] = [
  ['hello', 'hello'],
  [
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,',
    "'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'",
  ],
  ['こんにちは', '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF'],
];
const orisonTests: [Record<string, any>, string][] = [
  [{ message: 'hello' }, 'message:hello'],
  [
    { message: 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,' },
    "message:'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'",
  ],
  [
    { message: 'こんにちは' },
    'message:%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF',
  ],
];
const arisonTests: [any[], string][] = [
  [['hello'], 'hello'],
  [
    ['Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,'],
    "'Lorem+ipsum+dolor+sit+amet,%0Aconsectetur+adipiscing+elit,'",
  ],
  [['こんにちは'], '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF'],
];

describe('RISON.parse', () => {
  it.each(risonTests)('returns %j when it given %j', (expected, input) => {
    expect(RISON.parse(input)).toStrictEqual(expected);
  });
});

describe('RISON.stringify', () => {
  const flip = risonTests.map<[string, any]>((x) => [x[1], x[0]]);
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(RISON.stringify(input)).toBe(expected);
  });
});

describe('ORISON.parse', () => {
  it.each(orisonTests)('returns %j when it given %j', (expected, input) => {
    expect(ORISON.parse(input)).toStrictEqual(expected);
  });
});

describe('ORISON.stringify', () => {
  const flip = orisonTests.map<[string, any]>((x) => [x[1], x[0]]);
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(ORISON.stringify(input)).toBe(expected);
  });
});

describe('ARISON.parse', () => {
  it.each(arisonTests)('returns %j when it given %j', (expected, input) => {
    expect(ARISON.parse(input)).toStrictEqual(expected);
  });
});

describe('ARISON.stringify', () => {
  const flip = arisonTests.map<[string, any]>((x) => [x[1], x[0]]);
  it.each(flip)('returns %j when it given %j', (expected, input) => {
    expect(ARISON.stringify(input)).toBe(expected);
  });
});
