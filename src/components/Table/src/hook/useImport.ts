import type {
  TableFormComponentName as ComponentName,
  TableFormImportItem as ImportItem,
  TableFormImportItemConfig as ImportItemConfig
} from '../types'
import type { Component } from 'vue'
import { shallowReactive } from 'vue'
import { defaultComponents, defaultArrayStrategies } from '../component'

type Components = Partial<Recordable<Component, ComponentName>>
type ComponentConfigs = Partial<Recordable<ImportItemConfig, ComponentName>>
/**
 * use Import
 * @description 自动导入组件库和组件配置
 */
export function useImport() {
  /**
   * 组件库
   */
  const components = shallowReactive<Components>({
    ...defaultComponents
  })

  /**
   * 组件配置
   */
  const componentConfigs = shallowReactive<ComponentConfigs>({})

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
      console.warn(`[AeTable]: The component ${name} already exists and will be overwritten`)
    }
    components[name] = component
  }

  function addArrayStrategy(name: string, isArrayFn: (cps: Recordable) => boolean) {
    if (components[name]) {
      arrayStrategies[name] = isArrayFn
    } else {
      console.error(
        `[AeTable]: Failed to register component array strategy because the component ${name} does not exist`
      )
    }
  }

  function addConfig(name: string, config: ImportItemConfig) {
    if (componentConfigs[name]) {
      console.warn(
        `[AeTable]: The component configuration ${name} already exists and will be overwritten`
      )
    }
    componentConfigs[name] = config
  }

  function registerComponent(
    name: string,
    component: Component,
    config?: ImportItemConfig,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
    addComponent(name, component)
    if (config) {
      addConfig(name, config)
    }
    if (isArrayFn) {
      addArrayStrategy(name, isArrayFn)
    }
    console.log(
      '%c✓ [AeTable]: The component ${name} imported via the imports property has been successfully registered！',
      'color: #4CAF50;'
    )
  }

  function registerComponents(imports: ImportItem[]) {
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
