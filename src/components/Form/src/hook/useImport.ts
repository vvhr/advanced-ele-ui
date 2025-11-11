import type { ComponentName, FormImportItem, FormImportItemConfig } from '../types'
import type { Component } from 'vue'
import { shallowReactive } from 'vue'
import { defaultComponents, defaultArrayStrategies } from '../component'
/**
 * use Import
 * @description 自动导入组件库和组件配置
 */
export function useImport() {
  /**
   * 组件库
   */
  const components = shallowReactive<Recordable<Component, ComponentName>>({
    ...defaultComponents
  })

  /**
   * 组件配置
   */
  const componentConfigs = shallowReactive<Recordable<FormImportItemConfig, ComponentName>>({})

  /**
   * 组件值初始化为数组的策略
   */
  const arrayStrategies = shallowReactive<
    Partial<Record<ComponentName, (cps: Recordable) => boolean>>
  >({
    ...defaultArrayStrategies
  })

  function addComponent(name: string, component: Component) {
    if (components[name]) {
      console.warn(`组件 ${name} 已经存在，将被覆盖`)
    }
    components[name] = component
  }

  function addArrayStrategy(name: string, isArrayFn: (cps: Recordable) => boolean) {
    if (components[name]) {
      arrayStrategies[name] = isArrayFn
    } else {
      console.error(`注册组件的数组策略失败，组件 ${name} 不存在`)
    }
  }

  function addConfig(name: string, config: FormImportItemConfig) {
    if (componentConfigs[name]) {
      console.warn(`组件配置 ${name} 已经存在，将被覆盖`)
    }
    componentConfigs[name] = config
  }

  function registerComponent(
    name: string,
    component: Component,
    config?: FormImportItemConfig,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
    addComponent(name, component)
    if (config) {
      addConfig(name, config)
    }
    if (isArrayFn) {
      addArrayStrategy(name, isArrayFn)
    }
    console.log(`注册组件 ${name} 成功`)
  }

  function registerComponents(imports: FormImportItem[]) {
    imports.forEach(item => {
      registerComponent(item.name, item.component, item.config, item.isArrayFn)
    })
  }

  return {
    components,
    arrayStrategies,
    componentConfigs,
    registerComponents
  }
}
