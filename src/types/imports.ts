import type { Component } from 'vue'

export interface FormImportItemConfig {
  /**
   * 组件的modelValue键名
   */
  modelValueKey?: string
  /**
   * 是否需要自动添加clearable属性
   */
  needClearable?: boolean
  /**
   * 是否需要自动添加input placeholder属性
   */
  needInputPlaceholder?: boolean
  /**
   * 是否需要自动添加select placeholder属性
   */
  needSelectPlaceholder?: boolean
  /**
   * 是否需要自动添加options属性
   */
  needOptions?: boolean
}

export interface FormImportItem {
  name: string
  component: Component
  config?: FormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}

export interface TableFormImportItemConfig {
  /**
   * 组件的modelValue键名
   */
  modelValueKey?: string
  /**
   * 是否需要自动添加input placeholder属性
   */
  needInputPlaceholder?: boolean
  /**
   * 是否需要自动添加select placeholder属性
   */
  needSelectPlaceholder?: boolean
}

export interface TableFormImportItem {
  name: string
  component: Component
  config?: TableFormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}
