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

export interface TableFormImportItemConfig {
  modelValueKey?: string
}

export interface TableFormImportItem {
  name: string
  component: Component
  config?: TableFormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}
