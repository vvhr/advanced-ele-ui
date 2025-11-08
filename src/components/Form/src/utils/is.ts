// 判断值是自设表达式
export function isExpression(value: any) {
  let trimmedValue = '' // 设定一个安全的默认值
  if (value && typeof value === 'string') {
    trimmedValue = value.trim()
  }
  return typeof trimmedValue.startsWith('{{') && trimmedValue.endsWith('}}')
}

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

/**
 * 检查值是否为对象类型（不包括 null）
 * @param value 要检查的值
 * @returns 是否为对象
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object'
}

/**
 * 检查值是否为有效的对象键
 * @param value 要检查的值
 * @returns 是否为有效键
 */
export function isValidKey(value: any): value is string | number | symbol {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'symbol'
}

/**
 * 是否是render函数
 */
export function isRenderFunction(fn: any): boolean {
  return fn !== undefined && isFunction(fn)
}
