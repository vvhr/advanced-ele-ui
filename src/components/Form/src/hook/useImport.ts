import type { ComponentName } from '../types'
import type { FormImportItem, FormImportItemConfig } from '@/types/imports'
import type { Component } from 'vue'
import { shallowReactive } from 'vue'
import { defaultComponents, defaultArrayStrategies } from '../component'
import { globalFormImports } from '@/utils/imports'
import { logger } from '@/locale'

type Components = Partial<Recordable<Component, ComponentName>>
type ComponentConfigs = Partial<Recordable<FormImportItemConfig, ComponentName>>

/**
 * use Import
 * @description 使用全局注册和局部注册的组件库和组件配置
 * @param localImports 局部注册的组件列表，优先级高于全局注册
 */
export function useImport(localImports: FormImportItem[] = []) {
  /**
   * 组件库（合并优先级：局部注册 > 全局注册 > 默认组件）
   */
  const components = shallowReactive<Components>({
    ...defaultComponents,
    ...globalFormImports.components
  })

  /**
   * 组件配置（合并优先级：局部注册 > 全局注册）
   */
  const componentConfigs = shallowReactive<ComponentConfigs>({
    ...globalFormImports.componentConfigs
  })

  /**
   * 组件值初始化为数组的策略（合并优先级：局部注册 > 全局注册 > 默认策略）
   */
  const arrayStrategies = shallowReactive<
    Partial<Record<ComponentName, (cps: Recordable) => boolean>>
  >({
    ...defaultArrayStrategies,
    ...globalFormImports.arrayStrategies
  })

  // 注册局部组件（覆盖全局注册的同名组件）
  localImports.forEach(item => {
    if (components[item.name]) {
      logger.warn('console.form.componentExists', { name: item.name })
    }
    components[item.name] = item.component

    if (item.config) {
      componentConfigs[item.name] = item.config
    }

    if (item.isArrayFn) {
      arrayStrategies[item.name] = item.isArrayFn
    }

    logger.success('console.form.componentRegistered', { name: item.name })
  })

  return {
    components,
    arrayStrategies,
    componentConfigs
  }
}
