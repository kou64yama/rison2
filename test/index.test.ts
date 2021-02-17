/* eslint-env jest */

import * as exported from '../src/index';
import * as rison from '../src/rison';
import * as escaped from '../src/escaped';

describe('module', () => {
  it('exports RISON as default', () => {
    expect(exported.default).toBe(rison.RISON);
  });

  it('exports RISON.parse as parse', () => {
    expect(exported.parse).toBe(rison.RISON.parse);
  });

  it('exports RISON.stringify as stringify', () => {
    expect(exported.stringify).toBe(rison.RISON.stringify);
  });

  it('exports RISON.escape as escape', () => {
    expect(exported.escape).toBe(escaped.escape);
  });

  it('exports RISON.unescape as unescape', () => {
    expect(exported.unescape).toBe(escaped.unescape);
  });

  it('exports RISON', () => {
    expect(exported.RISON).toBe(rison.RISON);
  });

  it('exports ORISON', () => {
    expect(exported.ORISON).toBe(rison.ORISON);
  });

  it('exports ARISON', () => {
    expect(exported.ARISON).toBe(rison.ARISON);
  });

  it('exports escaped', () => {
    expect(exported.escaped).toBe(escaped);
  });
});
