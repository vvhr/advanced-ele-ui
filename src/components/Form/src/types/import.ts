import type { Component } from 'vue'

export interface ComponentConfig {
  modelValueKey?: string
}

export interface ImportComponent {
  name: string
  component: Component
  config?: ComponentConfig
  isArrayFn?: (cps: Recordable) => boolean
}
