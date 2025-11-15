import type { Slots } from 'vue'
import { isFunction } from './is'
import { logger } from '@/locale'
export function getSlot(slots: Slots, slot = 'default', data?: Recordable) {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    logger.error('console.utils.slotError', { slot })
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

/**
 * 自动格式化width值，支持百分比和px后缀或数值
 * @param widthValue
 */
export function getStyleWidth(widthValue: string | number) {
  if (typeof widthValue === 'number') {
    return `${widthValue}px`
  } else if (typeof widthValue === 'string') {
    // 支持百分比和px后缀
    if (widthValue.endsWith('%') || widthValue.endsWith('px')) {
      return widthValue
    }
    logger.error('console.utils.styleWidthError', undefined, widthValue)
    return ''
  }
}

/**
 * 获取对象的第一个属性名称
 * @param data
 */
export function getFirstAttr(data: Recordable) {
  for (const key in data) {
    return data[key]
  }
}
