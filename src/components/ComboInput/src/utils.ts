import type { ComboTemplate, TemplateModel } from './types'

/**
 * 模板缓存 - 使用 Map 存储已解析的模板
 * key: 原始模板字符串或序列化后的模板数组
 * value: 标准化后的模板数组
 */
const templateCache = new Map<string, ComboTemplate[]>()

/**
 * 缓存最大容量，防止内存泄漏
 */
const MAX_CACHE_SIZE = 100

/**
 * 输入性组件的标签列表
 */
const INPUT_TAGS: ReadonlyArray<string> = ['select', 'input', 'date-picker']

/**
 * 判断是否为输入性组件
 */
export function isInputTag(tag: string): boolean {
  return INPUT_TAGS.includes(tag)
}

/**
 * 验证模板是否有效
 * 必须至少包含一个输入性组件或{}变量占位符
 */
export function validateTemplate(templates: ComboTemplate[]): boolean {
  if (!templates || templates.length === 0) {
    return false
  }
  return templates.some(item => isInputTag(item.tag) && item.prop)
}

/**
 * 生成模板的缓存 key
 */
function getTemplateCacheKey(template: string | ComboTemplate[]): string {
  if (typeof template === 'string') {
    return `str:${template}`
  }
  // 对数组模板进行序列化，只包含关键属性
  try {
    return `arr:${JSON.stringify(
      template.map(t => ({
        tag: t.tag,
        prop: t.prop,
        content: t.content
      }))
    )}`
  } catch {
    // 序列化失败时返回唯一标识
    return `arr:${Date.now()}-${Math.random()}`
  }
}

/**
 * 清理缓存（当超过最大容量时）
 */
function cleanupCache(): void {
  if (templateCache.size >= MAX_CACHE_SIZE) {
    // 删除最早的一半缓存
    const keysToDelete = Array.from(templateCache.keys()).slice(0, MAX_CACHE_SIZE / 2)
    keysToDelete.forEach(key => templateCache.delete(key))
  }
}

/**
 * 解析字符串模板为 ComboTemplate 数组
 * 例如: "闽({year})永安市不动产权第{no}号"
 * 解析为: [
 *   { tag: 'span', content: '闽(' },
 *   { tag: 'input', prop: 'year' },
 *   { tag: 'span', content: ')永安市不动产权第' },
 *   { tag: 'input', prop: 'no' },
 *   { tag: 'span', content: '号' }
 * ]
 */
export function parseTemplateString(template: string): ComboTemplate[] {
  const result: ComboTemplate[] = []

  if (!template || typeof template !== 'string') {
    return result
  }

  // 使用更健壮的正则，支持嵌套大括号的情况，并确保变量名有效
  // 变量名只能包含字母、数字、下划线，且不能为空
  const regex = /\{(\w+)\}/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(template)) !== null) {
    // 添加前面的文本部分
    if (match.index > lastIndex) {
      const textContent = template.substring(lastIndex, match.index)
      if (textContent) {
        result.push({
          tag: 'span',
          content: textContent
        })
      }
    }

    // 添加输入框部分，默认使用 input
    const prop = match[1]
    if (prop) {
      result.push({
        tag: 'input',
        prop: prop,
        componentProps: {
          placeholder: prop
        }
      })
    }

    lastIndex = regex.lastIndex
  }

  // 添加最后的文本部分
  if (lastIndex < template.length) {
    const textContent = template.substring(lastIndex)
    if (textContent) {
      result.push({
        tag: 'span',
        content: textContent
      })
    }
  }

  return result
}

/**
 * 标准化模板配置（带缓存）
 * 确保每个输入性组件都有 prop 属性
 */
export function normalizeTemplate(template: string | ComboTemplate[]): ComboTemplate[] {
  // 检查缓存
  const cacheKey = getTemplateCacheKey(template)
  const cached = templateCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // 清理缓存
  cleanupCache()

  // 如果是字符串，先解析
  let templates: ComboTemplate[] =
    typeof template === 'string' ? parseTemplateString(template) : [...template]

  // 为没有 prop 的输入性组件自动生成 prop
  const propCountMap: Record<string, number> = {}

  templates = templates.map(item => {
    if (isInputTag(item.tag) && !item.prop) {
      // 自动生成 prop
      const tag = item.tag
      propCountMap[tag] = (propCountMap[tag] || 0) + 1
      return {
        ...item,
        prop: `${tag}_${propCountMap[tag]}`
      }
    }
    return item
  })

  // 存入缓存
  templateCache.set(cacheKey, templates)

  return templates
}

/**
 * 清除模板缓存
 */
export function clearTemplateCache(): void {
  templateCache.clear()
}

/**
 * 从完整值字符串解析出 TemplateModel
 * 根据模板配置将完整字符串拆分为各个字段的值
 */
export function parseValueToModel(value: string, templates: ComboTemplate[]): TemplateModel {
  const model: TemplateModel = {}

  // 初始化所有 prop 为空字符串
  templates.forEach(item => {
    if (item.prop) {
      model[item.prop] = ''
    }
  })

  if (!value || typeof value !== 'string' || !templates || templates.length === 0) {
    return model
  }

  // 构建正则表达式来匹配值
  // 使用更健壮的方式：先收集所有固定文本作为分隔符
  const propOrder: string[] = []
  const separators: string[] = []
  let currentSeparator = ''

  templates.forEach(item => {
    if (item.tag === 'span' && item.content) {
      currentSeparator += item.content
    } else if (item.prop) {
      separators.push(currentSeparator)
      propOrder.push(item.prop)
      currentSeparator = ''
    }
  })
  // 添加最后一个分隔符
  separators.push(currentSeparator)

  if (propOrder.length === 0) {
    return model
  }

  // 构建正则表达式
  let regexPattern = ''

  separators.forEach((sep, index) => {
    if (sep) {
      // 转义特殊字符
      const escapedSep = sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regexPattern += escapedSep
    }
    if (index < propOrder.length) {
      // 使用非贪婪匹配，但如果是最后一个变量且没有后续分隔符，使用贪婪匹配
      const isLast = index === propOrder.length - 1
      const hasTrailingSep = separators[index + 1] && separators[index + 1].length > 0
      regexPattern += isLast && !hasTrailingSep ? '(.*)' : '(.*?)'
    }
  })

  // 尝试匹配
  try {
    const regex = new RegExp(`^${regexPattern}$`)
    const match = value.match(regex)

    if (match) {
      // 将捕获的值赋给对应的 prop
      propOrder.forEach((prop, index) => {
        model[prop] = match[index + 1] ?? ''
      })
    }
  } catch {
    // 正则表达式错误，保持空值
  }

  return model
}

/**
 * 从 TemplateModel 组装完整值字符串
 */
export function assembleModelToValue(model: TemplateModel, templates: ComboTemplate[]): string {
  if (!model || !templates || templates.length === 0) {
    return ''
  }

  let result = ''

  templates.forEach(item => {
    if (item.tag === 'span' && item.content) {
      result += item.content
    } else if (item.prop) {
      result += model[item.prop] ?? ''
    }
  })

  return result
}

/**
 * 初始化 TemplateModel
 * 为所有输入性组件的 prop 初始化空值
 */
export function initTemplateModel(templates: ComboTemplate[]): TemplateModel {
  const model: TemplateModel = {}

  if (!templates || templates.length === 0) {
    return model
  }

  templates.forEach(item => {
    if (item.prop) {
      model[item.prop] = ''
    }
  })

  return model
}
