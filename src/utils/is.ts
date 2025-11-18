export const isArray = (val: unknown): val is Array<any> => {
  return Array.isArray(val)
}

/**
 * 检查值是否为函数
 * @param val
 */
export function isFunction(val: unknown): val is Function {
  return val !== undefined && typeof val === 'function'
}

/**
 * 检查值是否是数值
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}

/**
 * 检查值是否为对象类型（不包括 null）
 * @param value 要检查的值
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object'
}

/**
 * 检查值是否为有效的键
 * @param value 要检查的值
 */
export function isValidKey(value: any): value is string | number | symbol {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'symbol'
}

/**
 * 检查值是否为表达式
 * @param value
 */
export function isExpression(value: any) {
  let trimmedValue = '' // 设定一个安全的默认值
  if (value && typeof value === 'string') {
    trimmedValue = value.trim()
  }
  return typeof trimmedValue.startsWith('{{') && trimmedValue.endsWith('}}')
}

/**
 * 判断属性是否存在
 */
export function isExistAttr(obj: Recordable, name: string) {
  return Reflect.has(obj, name)
}
