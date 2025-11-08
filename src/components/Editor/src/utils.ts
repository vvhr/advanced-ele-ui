/**
 * 自动格式化width值，支持百分比和px后缀或数值
 * @param widthValue
 */
export function getStyleWidth(widthValue: any) {
  if (typeof widthValue === 'number') {
    return `${widthValue}px`
  } else if (typeof widthValue === 'string') {
    // 支持百分比和px后缀
    if (widthValue.endsWith('%') || widthValue.endsWith('px')) {
      return widthValue
    }
    console.warn('width值必须为百分比或px后缀或数值:', widthValue)
    return ''
  } else {
    console.warn('width值必须为百分比或px后缀或数值:', widthValue)
    return ''
  }
}
