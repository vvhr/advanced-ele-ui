import type { Component } from 'vue'

export interface FormImportItemConfig {
  modelValueKey?: string
}

export interface FormImportItem {
  name: string
  component: Component
  config?: FormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}
