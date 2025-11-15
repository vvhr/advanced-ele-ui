/**
 * 国际化模块
 * @description 轻量级国际化解决方案，支持中英文切换
 */
import { ref, computed } from 'vue'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'
import type { Language, LocaleConfig, DeepPartial } from './types'

/**
 * 当前语言
 */
const currentLocale = ref<Language>('zh-CN')

/**
 * 语言包映射
 */
const localeMap: Record<Language, LocaleConfig> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

/**
 * 用户自定义语言包
 */
const customLocales: Partial<Record<Language, DeepPartial<LocaleConfig>>> = {}

/**
 * 获取当前语言包
 */
export function getLocale(): LocaleConfig {
  const defaultLocale = localeMap[currentLocale.value]
  const customLocale = customLocales[currentLocale.value] || {}

  // 深度合并默认语言包和自定义语言包
  return mergeLocale(defaultLocale, customLocale)
}

/**
 * 语言切换回调函数列表
 */
const localeChangeCallbacks: Array<(locale: Language) => void> = []

/**
 * 注册语言切换回调
 * @param callback 当语言切换时执行的回调函数
 */
export function onLocaleChange(callback: (locale: Language) => void) {
  localeChangeCallbacks.push(callback)
  // 立即执行一次，同步当前语言
  callback(currentLocale.value)
}

/**
 * 设置当前语言
 */
export function setLocale(locale: Language) {
  if (!localeMap[locale]) {
    console.warn(`[AdvancedEleUI] Locale "${locale}" is not supported. Using "zh-CN" instead.`)
    currentLocale.value = 'zh-CN'
    return
  }
  currentLocale.value = locale
  
  // 触发所有语言切换回调
  localeChangeCallbacks.forEach(callback => callback(locale))
}

/**
 * 获取当前语言
 */
export function getCurrentLocale(): Language {
  return currentLocale.value
}

/**
 * 设置自定义语言包
 * @param locale 语言
 * @param config 自定义配置（会与默认配置深度合并）
 */
export function setCustomLocale(locale: Language, config: DeepPartial<LocaleConfig>) {
  customLocales[locale] = config
}

/**
 * 翻译函数
 * @param path 翻译路径，如 'table.copy.success'
 * @param params 参数对象，用于替换模板中的占位符，如 { name: 'John' }
 * @param fallback 回退文本
 */
export function t(path: string, params?: Record<string, any> | string, fallback?: string): string {
  // 兼容旧的 API：t(path, fallback)
  if (typeof params === 'string') {
    fallback = params
    params = undefined
  }

  const locale = getLocale()
  const keys = path.split('.')

  let result: any = locale
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return fallback || path
    }
  }

  let text = typeof result === 'string' ? result : fallback || path

  // 替换参数占位符
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(key => {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]))
    })
  }

  return text
}

/**
 * 响应式翻译函数
 * @param path 翻译路径
 * @param params 参数对象或回退文本
 * @param fallback 回退文本
 */
export function useLocale(path: string, params?: Record<string, any> | string, fallback?: string) {
  return computed(() => t(path, params, fallback))
}

/**
 * 深度合并语言包
 */
function mergeLocale(
  defaultLocale: LocaleConfig,
  customLocale: DeepPartial<LocaleConfig>
): LocaleConfig {
  return deepMerge(defaultLocale, customLocale) as LocaleConfig
}

/**
 * 深度合并对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: DeepPartial<T>): T {
  const result: any = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        // 递归合并对象
        result[key] = deepMerge(targetValue, sourceValue as any)
      } else {
        result[key] = sourceValue
      }
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  }

  return result as T
}

/**
 * 导出响应式当前语言
 */
export const locale = computed(() => currentLocale.value)

/**
 * 导出所有支持的语言
 */
export const supportedLocales: Language[] = ['zh-CN', 'en-US']

/**
 * 导出日志工具
 */
export { logger, Logger } from './logger'

/**
 * 默认导出
 */
export default {
  locale,
  getLocale,
  setLocale,
  getCurrentLocale,
  setCustomLocale,
  onLocaleChange,
  t,
  useLocale,
  supportedLocales
}
