import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

/**
 * 对字符串进行脱敏处理。
 * @param value - 需要脱敏的原始字符串。
 * @param searchRegex - 用于查找需要脱敏部分的正则表达式。
 *                  这个正则表达式应该通常带有全局标志 'g' 来替换所有匹配项。
 * @param replacement - 用于替换匹配部分的字符串。
 *                      例如: "***", "****", "[REDACTED]", "$1" (如果 searchRegex 有捕获组)
 * @returns 脱敏后的字符串。
 */
export function formatSensitive(
  value: string,
  searchRegex: RegExp | string,
  replacement: string // 修正：这里更合理应该是 string，表示替换内容
): string {
  if (!value) {
    return value
  }
  let searchRegex_: RegExp
  if (typeof searchRegex === 'string') {
    searchRegex_ = new RegExp(searchRegex, 'g')
  } else {
    searchRegex_ = searchRegex
  }
  const globalSearchRegex = searchRegex_.global
    ? searchRegex_
    : new RegExp(searchRegex_.source, searchRegex_.flags + 'g')
  return value.replace(globalSearchRegex, replacement)
}

/**
 * 格式化日期/时间。
 *
 * @param value - 要格式化的日期/时间。例如: new Date(), 1678886400000, '2023-03-15T10:00:00Z', '2023-03-15'
 * @param formatString - 期望的输出格式字符串。
 * @returns 格式化后的日期字符串。如果输入的 `value` 无法解析为有效日期，则返回一个空字符串。
 */
export function formatDate(value: string | number | Date, formatString?: string): string {
  const finalFormatString = formatString || 'YYYY-MM-DD'
  try {
    const date = dayjs(value)
    if (!date.isValid()) {
      console.warn(`formatDate: 无法将输入值 "${value}" 解析为有效日期.`)
      return '' // 返回空字符串表示无效日期
    }
    return date.format(finalFormatString)
  } catch (error) {
    console.error(
      `formatDate: 格式化日期时发生错误。输入值: "${value}", 格式: "${finalFormatString}"`,
      error
    )
    return '' // 发生错误时返回空字符串
  }
}

/**
 * 格式化金额工具函数
 *
 * @param value - 需要格式化的数值 (可以是 number, string, null, undefined)
 * @param config - 格式化配置项
 * @returns 格式化后的金额字符串
 */
export function formatAmount(
  value: number | string | null | undefined,
  config: {
    amountThousand?: boolean // 是否显示千分位分隔符 (例如: 1,234.56)
    amountDecimal?: boolean // 是否显示小数位
    amountDigits?: number // 小数的位数 默认2
    amountUnit?: string // 自定义金额的单位 (例如: $, ¥, 元) 默认空
    amountUnitPosition?: 'left' | 'right' // 单位的显示位置 ('left' | 'right') @default 'left'
    defaultValue?: string // 当数值无效或不存在时显示的默认字符串 @default "0"
  } = {}
): string {
  const {
    amountThousand = true, // 默认显示千分位
    amountDecimal = true, // 默认显示小数
    amountDigits = 2, // 默认保留两位小数
    amountUnit = '', // 默认无单位
    amountUnitPosition = 'left', // 默认单位在左边
    defaultValue = '0' // 默认值为 '0'
  } = config

  // 1. 处理无效值
  // 尝试转换为数字
  const numericValue = parseFloat(String(value))

  // 如果转换后是 NaN, Infinity, -Infinity，或者原始值 was null/undefined
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    // 如果有自定义单位，也需要加上
    return amountUnit
      ? amountUnitPosition === 'left'
        ? `${amountUnit}${defaultValue}`
        : `${defaultValue}${amountUnit}`
      : defaultValue
  }

  // 2. 准备 NumberFormatOptions
  const localeOptions: Intl.NumberFormatOptions = {}

  // 设置是否使用千分位
  localeOptions.useGrouping = amountThousand

  // 设置小数位数
  if (amountDecimal) {
    // 确保小数位数为非负整数
    const validDigits = Math.max(0, Math.floor(amountDigits))
    localeOptions.minimumFractionDigits = validDigits
    localeOptions.maximumFractionDigits = validDigits
  } else {
    // 不显示小数位，则小数位数为 0
    localeOptions.minimumFractionDigits = 0
    localeOptions.maximumFractionDigits = 0
  }

  // 3. 使用 Intl.NumberFormat 进行格式化
  // 使用 'en-US' 作为 locale，它提供标准的千分位和点作为小数分隔符。
  // 如果需要支持其他语言的千分位/小数位符号（如欧洲的逗号分隔），可以在这里调整 locale。
  const formatter = new Intl.NumberFormat('en-US', localeOptions)
  let formattedNumber = formatter.format(numericValue)

  // 4. 添加单位
  if (amountUnit) {
    if (amountUnitPosition === 'left') {
      formattedNumber = `${amountUnit}${formattedNumber}`
    } else {
      // 'right'
      formattedNumber = `${formattedNumber}${amountUnit}`
    }
  }

  return formattedNumber
}
