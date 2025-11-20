/**
 * 列渲染器
 * @description 将不同类型的列渲染逻辑拆分为独立的渲染器
 */
import { ElTag, ElMessage, ElIcon } from 'element-plus'
import { Icon } from '@/components/Icon'
import DotTag from '@/components/Table/src/components/DotTag.vue'
import SensitiveSwitch from '@/components/Table/src/components/SensitiveSwitch.vue'
import { isArray } from '@/utils/is'
import { formatAmount, formatDate, formatSensitive } from '@/utils/format'
import { copyToClipboard } from '@/utils/copy'
import type { TableColumn, TableProps } from '../types'
import type { DictItem } from '@/types/dict'
import type { UseDictTools } from '@/utils/dict'
import type { VNode } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'
import { isCopyable, isClickable } from '../utils'
import type { TableEmits } from '../types'
import { t, logger } from '@/locale'

/**
 * 渲染上下文
 */
export interface RenderContext {
  props: TableProps
  column: TableColumn
  row: Recordable
  index: number
  value: any
  originValue: any
  emptyValue: string
  dictTools: UseDictTools
  emit: TableEmits
}

/**
 * 渲染结果
 */
export interface RenderResult {
  value: string | number
  valueRender?: VNode | string | number
}

/**
 * 字典列渲染器
 */
export function renderDictColumn(ctx: RenderContext): RenderResult | string {
  const { column, value, emptyValue, dictTools } = ctx

  if (!column.typeProps) {
    logger.warn('console.table.dictTypePropsRequired', undefined, column)
    return { value: value || emptyValue }
  }

  // 获取字典选项
  let dictOptions: DictItem[] = []
  if (column.typeProps.dictOptions !== undefined) {
    dictOptions = isArray(column.typeProps.dictOptions) ? column.typeProps.dictOptions : []
  } else if (column.typeProps.dictName) {
    dictOptions = dictTools.getDictOptions(column.typeProps.dictName)
  }

  // 树形字典处理
  if (column.typeProps.dictIsTree) {
    const label = dictTools.getTreeDictItemLabel(
      dictOptions,
      value,
      column.typeProps?.dictValueIsPath,
      column.typeProps?.dictLabelFullpath,
      column.typeProps?.dictLabelSeparator
    )
    return label ? { value: label } : emptyValue
  }

  // 普通字典处理
  const dictItem = dictOptions.find(item => item.value === value)
  const label = dictItem?.label || value

  if (!dictItem && !value) {
    return emptyValue
  }

  // 自定义渲染
  if (column.typeProps.dictViewRender !== undefined) {
    return {
      value: label,
      valueRender: column.typeProps.dictViewRender(ctx.originValue, label, dictItem)
    }
  }

  // 样式渲染
  if (column.typeProps.dictViewType && column.typeProps.dictViewType !== 'text') {
    return renderDictViewType(column.typeProps.dictViewType, label, dictItem)
  }

  return { value: label || emptyValue }
}

/**
 * 字典视图类型渲染
 */
function renderDictViewType(
  viewType: 'tag' | 'dot-tag',
  label: string,
  dictItem?: DictItem
): RenderResult {
  const tagProps = {
    color: dictItem?.color || '',
    type: dictItem?.type || 'primary',
    hit: dictItem?.hit || false,
    effect: dictItem?.effect || 'light',
    round: dictItem?.round || false
  }

  if (viewType === 'tag') {
    const valueRender = dictItem?.icon ? (
      <ElTag {...tagProps} class="flex flex-row items-center gap-1">
        <Icon icon={dictItem.icon} size={14} />
        <span>{label}</span>
      </ElTag>
    ) : (
      <ElTag {...tagProps}>{label}</ElTag>
    )
    return { value: label, valueRender }
  }

  if (viewType === 'dot-tag') {
    return {
      value: label,
      valueRender: <DotTag {...tagProps} value={label} />
    }
  }

  return { value: label }
}

/**
 * 金额列渲染器
 */
export function renderAmountColumn(ctx: RenderContext): RenderResult | string {
  const { column, value, emptyValue } = ctx

  if (value === '' || value === null || value === undefined) {
    return emptyValue
  }

  const {
    amountThousand = false,
    amountDecimal = true,
    amountDigits = 2,
    amountUnit = '',
    amountUnitPosition = 'right'
  } = column.typeProps || {}

  return {
    value: formatAmount(value, {
      amountThousand,
      amountDecimal,
      amountDigits,
      amountUnit,
      amountUnitPosition,
      defaultValue: emptyValue
    })
  }
}

/**
 * 日期列渲染器
 */
export function renderDateColumn(ctx: RenderContext): RenderResult | string {
  const { column, value, emptyValue } = ctx

  if (!value) {
    return emptyValue
  }

  const dateFormat = column.typeProps?.dateFormat || 'YYYY-MM-DD'
  return { value: formatDate(value, dateFormat) || emptyValue }
}

/**
 * 敏感信息列渲染器
 */
export function renderSensitiveColumn(ctx: RenderContext): RenderResult | string {
  const { column, originValue, emptyValue } = ctx

  if (!originValue) {
    return emptyValue
  }

  // 优先使用自定义正则
  const sensitiveRegex = column.typeProps?.sensitiveRegex
  if (sensitiveRegex && isArray(sensitiveRegex) && sensitiveRegex.length === 2) {
    const cryptoValue = formatSensitive(originValue, sensitiveRegex[0], sensitiveRegex[1])
    return { value: cryptoValue }
  }

  // 使用预设类型
  if (column.typeProps?.sensitiveType) {
    return renderSensitiveByType(
      column.typeProps.sensitiveType,
      originValue,
      column.typeProps?.sensitiveHover ?? false
    )
  }

  logger.warn('console.table.sensitiveTypeRequired', undefined, column)
  return emptyValue
}

/**
 * 根据类型渲染敏感信息
 */
function renderSensitiveByType(
  type: 'phone' | 'idCard' | 'email',
  originValue: string,
  enableHover: boolean
): RenderResult {
  const sensitiveMap = {
    phone: { regex: /(\d{3})\d{4}(\d{4})/, replacement: '$1****$2' },
    idCard: { regex: /^(\d{3})(\d{11})([0-9Xx]{4})$/, replacement: '$1********$3' },
    email: { regex: /(.+)@(.+\..+)/, replacement: '***@$2' }
  }

  const config = sensitiveMap[type]
  if (!config) {
    logger.warn('console.table.noDesensitizationMethod', { type })
    return { value: originValue }
  }

  const cryptoValue = formatSensitive(originValue, config.regex, config.replacement)
  return {
    value: cryptoValue,
    valueRender: (
      <SensitiveSwitch
        originValue={originValue}
        cryptoValue={cryptoValue}
        enable={enableHover}
      />
    )
  }
}

/**
 * 包装值（添加复制、点击功能）
 */
export function wrapValueWithFeatures(
  ctx: RenderContext,
  result: RenderResult | string | VNode
): VNode | string | number {
  const { props, column, row, index, emit } = ctx

  // 如果是字符串，直接返回
  if (typeof result === 'string') {
    return result
  }

  // 如果是 VNode，直接返回
  if (typeof result === 'object' && 'type' in result) {
    return result
  }

  const { value, valueRender } = result
  const copyable = isCopyable(props, column, row, index)
  const clickable = isClickable(props, column, row, index)

  // 如果没有特殊功能，直接返回
  if (!copyable && !clickable) {
    return valueRender !== undefined ? valueRender : value
  }

  if (!value && value !== 0) {
    return valueRender !== undefined ? valueRender : value
  }

  // 构建样式类
  const ellipsis = column.ellipsis ?? props.ellipsis ?? false
  const align = column.align ?? props.align ?? 'left'
  const rowClassAlign =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
  const textClassEllipsis = ellipsis ? 'text-ellipsis overflow-hidden text-nowrap' : ''
  const textClickable = clickable ? 'clickable-text' : ''

  // 复制处理
  const onClickCopy = () => {
    if (!copyable) return

    const copyValue =
      column.copyValueMethod !== undefined
        ? column.copyValueMethod(row, index, column, props.form, props.excontext, props.editable)
        : ctx.originValue

    copyToClipboard(copyValue).then(res => {
      if (res) {
        ElMessage.success(t('table.copy.success'))
      } else {
        ElMessage.error(t('table.copy.failed'))
      }
    })
  }

  // 点击处理
  const onClickValue = () => {
    if (!clickable) return

    const columnKey = column.key || column.field
    emit('value-click', columnKey, row)

    if (column.clickMethod !== undefined) {
      column.clickMethod(row, index, column, props.form, props.excontext, props.editable)
    }
  }

  return (
    <div
      class={`ae-table-cell-value w-full flex flex-row items-center gap-2.5 ${rowClassAlign}`}
    >
      {copyable && (
        <ElIcon class="ae-table-cell-value__icon copyable-icon" onClick={() => onClickCopy()}>
          <CopyDocument />
        </ElIcon>
      )}
      <div
        class={`ae-table-cell-value__text flex-1 ${textClassEllipsis} ${textClickable}`}
        onClick={() => onClickValue()}
      >
        {valueRender || value}
      </div>
    </div>
  )
}
