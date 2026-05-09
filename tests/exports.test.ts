import { describe, expect, it } from 'vitest'
import * as AdvancedEleUI from '../src'

describe('root exports', () => {
  it('exports primary components and utilities from the root entry', () => {
    expect(AdvancedEleUI.AeForm).toBeTruthy()
    expect(AdvancedEleUI.AeTable).toBeTruthy()
    expect(AdvancedEleUI.AeEditor).toBeTruthy()
    expect(AdvancedEleUI.AeTabPane).toBeTruthy()
    expect(AdvancedEleUI.formatDate).toBeTypeOf('function')
    expect(AdvancedEleUI.getAutoRulesMap).toBeTypeOf('function')
  })

  it('exports locale APIs from the root entry', () => {
    expect(AdvancedEleUI.locale).toBeTruthy()
    expect(AdvancedEleUI.setLocale).toBeTypeOf('function')
    expect(AdvancedEleUI.getCurrentLocale).toBeTypeOf('function')
    expect(AdvancedEleUI.supportedLocales).toContain('zh-CN')
    expect(AdvancedEleUI.supportedLocales).toContain('en-US')
  })
})
