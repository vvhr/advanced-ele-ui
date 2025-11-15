/**
 * 国际化工具函数
 */

/**
 * 替换文本中的占位符
 * @param text 原始文本，如 "请填写{label}"
 * @param params 参数对象，如 { label: '姓名' }
 * @returns 替换后的文本，如 "请填写姓名"
 *
 * @example
 * replacePlaceholder('请填写{label}', { label: '姓名' })
 * // => '请填写姓名'
 *
 * replacePlaceholder('共 {total} 条', { total: 100 })
 * // => '共 100 条'
 */
export function replacePlaceholder(text: string, params: Record<string, any>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

/**
 * 获取占位符文本
 * @param template 模板文本
 * @param label 标签文本
 * @returns 替换后的文本
 *
 * @example
 * getPlaceholder('请填写{label}', '姓名')
 * // => '请填写姓名'
 */
export function getPlaceholder(template: string, label?: string): string {
  if (!label) return template
  return replacePlaceholder(template, { label })
}

/**
 * 获取验证消息
 * @param template 模板文本
 * @param label 标签文本
 * @returns 替换后的文本
 *
 * @example
 * getValidationMessage('{label}不能为空', '姓名')
 * // => '姓名不能为空'
 */
export function getValidationMessage(template: string, label?: string): string {
  if (!label) return template
  return replacePlaceholder(template, { label })
}
