import * as escaped from './escaped'
import * as exported from './index'
import * as rison from './rison'

describe('module', () => {
  it('exports RISON.parse as parse', () => {
    expect(exported.parse).toBe(rison.RISON.parse)
  })

  it('exports RISON.stringify as stringify', () => {
    expect(exported.stringify).toBe(rison.RISON.stringify)
  })

  it('exports RISON.escape as escape', () => {
    expect(exported.escape).toBe(escaped.escape)
  })

  it('exports RISON.unescape as unescape', () => {
    expect(exported.unescape).toBe(escaped.unescape)
  })

  it('exports RISON', () => {
    expect(exported.RISON).toBe(rison.RISON)
  })

  it('exports ORISON', () => {
    expect(exported.ORISON).toBe(rison.ORISON)
  })

  it('exports ARISON', () => {
    expect(exported.ARISON).toBe(rison.ARISON)
  })

  it('exports escaped', () => {
    expect(exported.escaped).toBe(escaped)
  })
})
