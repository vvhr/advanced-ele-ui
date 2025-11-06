import type { Slots } from 'vue'
import { isFunction } from './is'

export function getSlot(slots: Slots, slot = 'default', data?: Recordable) {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
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
    console.warn('width值必须为百分比或px后缀或数值:', widthValue)
    return ''
  }
}
