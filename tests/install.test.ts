import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import AdvancedEleUI from '../src'

describe('plugin install', () => {
  it('registers public global components with Ae prefixes', () => {
    const app = createApp({ render: () => null })

    app.use(AdvancedEleUI)

    const components = (app as any)._context.components
    expect(components.AeForm).toBeTruthy()
    expect(components.AeTable).toBeTruthy()
    expect(components.AeEditor).toBeTruthy()
    expect(components.AeTabPane).toBeTruthy()
  })
})
