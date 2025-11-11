import { set } from 'lodash-es'

/**
 * 在响应式对象中设置深层嵌套值，保持响应式特性
 * @param target 目标响应式对象
 * @param path 字段路径，支持点分隔的嵌套路径
 * @param value 要设置的值
 * @returns 是否设置成功
 */
export function setReactiveValue(target: Recordable, path: string, value: any): boolean {
  if (!target || !path) {
    return false
  }

  // 如果是简单字段，直接设置
  if (!path.includes('.')) {
    target[path] = value
    return true
  }

  set(target, path, value)

  return true
}
