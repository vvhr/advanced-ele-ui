import type { ComponentName, FormImportItem, FormImportItemConfig } from '../types'
import type { Component } from 'vue'
import { shallowReactive } from 'vue'
import { defaultComponents, defaultArrayStrategies } from '../component'
import { logger } from '@/locale'

type Components = Partial<Recordable<Component, ComponentName>>
type ComponentConfigs = Partial<Recordable<FormImportItemConfig, ComponentName>>

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
      logger.warn('console.form.componentExists', { name })
    }
    components[name] = component
  }

  function addArrayStrategy(name: string, isArrayFn: (cps: Recordable) => boolean) {
    if (components[name]) {
      arrayStrategies[name] = isArrayFn
    } else {
      logger.error('console.table.componentNotExist', { name })
    }
  }

  function addConfig(name: string, config: FormImportItemConfig) {
    if (componentConfigs[name]) {
      logger.warn('console.form.configExists', { name })
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
    logger.success('console.form.componentRegistered', { name })
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
