import type {
  ElButtonProps,
  TableEmits,
  TableProps,
  TableSlotDefault,
  TableAction,
  TableColumn,
  TableColumnFn
} from '../types'
import {
  ElTableColumn,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElFormItem,
  ElRadio,
  ElInput,
  ElIcon,
  ElMessage,
  ElTag,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton
} from 'element-plus'
import { Icon } from '@/components/Icon'
import DotTag from '@/components/Table/src/components/DotTag.vue'
import SensitiveSwitch from '@/components/Table/src/components/SensitiveSwitch.vue'
import TooltipHeader from '@/components/Table/src/components/TooltipHeader.vue'
import { getSlot } from '@/utils/get'
import { copyToClipboard } from '@/utils/copy'
import { isArray, isFunction } from '@/utils/is'
import { formatAmount, formatDate, formatSensitive } from '@/utils/format'
import {
  setIndex,
  isHidden,
  isClickable,
  isCopyable,
  isEditable,
  isDisabled,
  isHiddenAction,
  isDisabledAction,
  isLoadingAction
} from '@/components/Table/src/utils.ts'
import type { Slots, Ref } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'
import type { DictItem } from '@/types/dict'
import type { UseDictTools } from '@/utils/dict.ts'

export function renderTableColumns(
  props: TableProps,
  slots: Slots,
  emit: TableEmits,
  currentRowRef: Ref<Recordable>,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  dictTools: UseDictTools
) {
  if (props.columns && props.columns.length) {
    // 获取有效的列
    const validColumns = props.columns.filter(column => {
      const visible = column.visible === undefined ? true : column.visible
      return visible ? !isHidden(props, column) : false
    })
    // 判断是否存在expand列
    const expandColumn = validColumns.find(column => column.type === 'expand')
    // 判断是否存在selection列
    const selectionColumn = validColumns.find(column => column.type === 'selection')
    // 判断是否存在单选列
    const radioColumn = validColumns.find(column => column.type === 'radio')

    // 单选列渲染
    const renderRadioColumn = (column: TableColumn) => {
      return radioColumn ? (
        <ElTableColumn
          label={column.label || ''}
          align={column.align || props.align || 'center'}
          headerAlign={column.headerAlign || props.headerAlign || 'center'}
          width={column.width || 50}
          column-key={column.key || 'radio'}
        >
          {{
            default: (data: TableSlotDefault) => {
              const isSelected = props.rowKey
                ? currentRowRef.value[props.rowKey] === data.row[props.rowKey]
                : false
              const onChangeSelected = () => {
                currentRowRef.value = data.row
              }
              return <ElRadio model-value={isSelected} onChange={onChangeSelected} />
            }
          }}
        </ElTableColumn>
      ) : undefined
    }
    // 复选列渲染
    const renderSelectionColumn = (column: TableColumn) => {
      const setSelectable = (row: any, index: number) => {
        return column.typeProps?.selectable !== undefined
          ? column.typeProps?.selectable(row, index, column, props.form, props.dataSource)
          : true
      }

      return selectionColumn ? (
        <ElTableColumn
          label={column.label || ''}
          type="selection"
          reserveSelection={column.typeProps?.reserveSelection || false}
          align={column.align || props.align || 'center'}
          headerAlign={column.headerAlign || props.headerAlign || 'center'}
          width={column.width || 50}
          selectable={setSelectable}
          column-key={column.key || 'selection'}
        />
      ) : undefined
    }
    // 展开列渲染
    const renderExpandColumn = (column: TableColumn) => {
      return expandColumn ? (
        <ElTableColumn
          label={column.label || ''}
          type="expand"
          width={column.width || 50}
          align={column.align || props.align || 'center'}
          headerAlign={column.headerAlign || props.headerAlign || 'center'}
          column-key={column.key || 'expand'}
        >
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }
    // 渲染列的default插槽
    const renderTableColumnDefault = (column: TableColumn, row: Recordable, index: number) => {
      // 是否编辑模式且是否可编辑
      if (isEditable(props, column)) {
        const component = column.editProps?.component || 'Input'
        const field = column.editProps?.field || column.field
        if (!field) {
          console.warn(`[AeTable] 编辑组件未设置field属性.`)
        }
        const formItemProps = {
          prop: `${index}.${field}`,
          rules: column.editProps?.rules || []
        }
        const componentProps = {
          style: {
            width: '100%'
          },
          placeholder: '请填写' + (column.label || ''),
          ...(column.editProps?.componentProps || {}),
          disabled: isDisabled(props, column, row, index)
        }
        const getComponent = () => {
          switch (component) {
            case 'Input':
              return <ElInput vModel={row[field]} {...componentProps} />
            case 'InputNumber':
              return <ElInputNumber vModel={row[field]} {...componentProps} />
            case 'Select': {
              let options = column.editProps?.componentProps?.options
              if (isFunction(options)) {
                options = options(row, index, column, props.form, props.dataSource)
              } else {
                options = options || []
              }
              // 如果有
              return (
                <ElSelect vModel={row[field]} {...componentProps}>
                  {options.map((option: any) => (
                    <ElOption label={option.label} value={option.value} {...option} />
                  ))}
                </ElSelect>
              )
            }
            case 'DatePicker':
              return <ElDatePicker vModel={row[field]} {...componentProps} />
            default:
              return <ElInput vModel={row[field]} {...componentProps} />
          }
        }
        return (
          <ElFormItem {...formItemProps}>
            {{
              default: () => getComponent()
            }}
          </ElFormItem>
        )
      } else {
        // 非编辑模式
        const emptyValue = column.emptyValue || props.emptyValue || ''
        // 初始化列的值
        let value = ''
        let valueRender: any = ''
        if (column.field) {
          value = row[column.field]
        }
        let originValue = value

        // 1.未使用列类型时
        if (column.type === 'default' || !column.type) {
          // column.render函数存在时
          if (column.render !== undefined) {
            return column.render(row, index, column, props.form, props.dataSource)
          }
          // column.formatter函数存在时
          if (column.formatter !== undefined) {
            value = column.formatter(row, index, column, props.form, props.dataSource)
          }
        } else {
          switch (column.type) {
            case 'dict': {
              if (column.typeProps) {
                // 优先使用dictOptions
                let dictOptions: DictItem[] = []
                if (column.typeProps.dictOptions !== undefined) {
                  dictOptions = isArray(column.typeProps.dictOptions)
                    ? column.typeProps.dictOptions
                    : []
                } else if (column.typeProps.dictName) {
                  dictOptions = dictTools.getDictOptions(column.typeProps.dictName)
                }

                // 是否是树形
                if (column.typeProps.dictIsTree) {
                  const label = dictTools.getTreeDictItemLabel(
                    dictOptions,
                    value,
                    column.typeProps?.dictValueIsPath,
                    column.typeProps?.dictLabelFullpath,
                    column.typeProps?.dictLabelSeparator
                  )
                  if (!label) {
                    return emptyValue
                  }
                  value = label
                } else {
                  // 获取选项值
                  const dictItem = dictOptions.find(item => item.value === value)
                  value = dictItem?.label ? dictItem.label : value
                  // 如果未匹配到则值为空
                  if (!dictItem && !value) {
                    return emptyValue
                  }
                  // 是否使用样式
                  if (column.typeProps.dictViewType && column.typeProps.dictViewType !== 'text') {
                    switch (column.typeProps.dictViewType) {
                      case 'tag': {
                        const tagProps = {
                          color: dictItem?.color || '',
                          type: dictItem?.type || 'primary',
                          hit: dictItem?.hit || false,
                          effect: dictItem?.effect || 'light',
                          round: dictItem?.round || false
                        }
                        // 是否需要图标
                        if (dictItem?.icon) {
                          valueRender = (
                            <ElTag {...tagProps} class="flex flex-row items-center gap-1">
                              <Icon icon={dictItem?.icon} size={14} />
                              <span>{value}</span>
                            </ElTag>
                          )
                        } else {
                          valueRender = <ElTag {...tagProps}>{value}</ElTag>
                        }
                        break
                      }
                      case 'dot-tag': {
                        const tagProps = {
                          color: dictItem?.color || '',
                          type: dictItem?.type || 'primary',
                          hit: dictItem?.hit || false,
                          effect: dictItem?.effect || 'light',
                          round: dictItem?.round || false
                        }
                        valueRender = <DotTag {...tagProps} value={value} />
                        break
                      }
                      default:
                        value = value || emptyValue
                        break
                    }
                  } else if (column.typeProps.dictViewRender !== undefined) {
                    valueRender = column.typeProps.dictViewRender(originValue, value, dictItem)
                  }
                }
              } else {
                value = value || emptyValue
                console.warn(
                  `[AeTable] column ${column.label} 使用了 dict 类型但未配置 typeProps，无法正常解析字典。`
                )
              }
              break
            }
            case 'amount': {
              if (value === '' || value === null || value === undefined) {
                value = emptyValue
              } else {
                const {
                  amountThousand = false,
                  amountDecimal = true,
                  amountDigits = 2,
                  amountUnit = '',
                  amountUnitPosition = 'right'
                } = column.typeProps || {}
                value = formatAmount(value, {
                  amountThousand,
                  amountDecimal,
                  amountDigits,
                  amountUnit,
                  amountUnitPosition,
                  defaultValue: emptyValue
                })
              }
              break
            }
            case 'date': {
              if (!value) {
                return emptyValue
              }
              // 强制转换dateFormat，兼容dayjs的格式
              const dateFormat = column.typeProps?.dateFormat || 'YYYY-MM-DD'
              value = formatDate(value, dateFormat) || emptyValue
              break
            }
            case 'sensitive': {
              if (!originValue) {
                return emptyValue
              }
              // 优先使用sensitiveRegex
              const sensitiveRegex = column.typeProps?.sensitiveRegex
              if (sensitiveRegex && isArray(sensitiveRegex) && sensitiveRegex.length === 2) {
                value = formatSensitive(originValue, sensitiveRegex[0], sensitiveRegex[1])
              } else if (column.typeProps?.sensitiveType) {
                switch (column.typeProps.sensitiveType) {
                  case 'phone':
                    value = formatSensitive(originValue, /(\d{3})\d{4}(\d{4})/, '$1****$2')
                    valueRender = (
                      <SensitiveSwitch
                        originValue={originValue}
                        cryptoValue={value}
                        enable={column.typeProps?.sensitiveHover ?? false}
                      />
                    )
                    break
                  case 'idCard':
                    value = formatSensitive(
                      originValue,
                      /^(\d{3})(\d{11})([0-9Xx]{4})$/,
                      '$1********$3'
                    )
                    valueRender = (
                      <SensitiveSwitch
                        originValue={originValue}
                        cryptoValue={value}
                        enable={column.typeProps?.sensitiveHover ?? false}
                      />
                    )
                    break
                  case 'email':
                    value = formatSensitive(originValue, /(.+)@(.+\..+)/, '***@$2')
                    valueRender = (
                      <SensitiveSwitch
                        originValue={originValue}
                        cryptoValue={value}
                        enable={column.typeProps?.sensitiveHover ?? false}
                      />
                    )
                    break
                  default:
                    console.warn(`[AeTable] 不存在${column.typeProps.sensitiveType}类型的脱敏方法`)
                    break
                }
              } else {
                console.warn(
                  `[AeTable] 使用了 sensitive 类型，但未设置 sensitiveType 或 sensitiveRegex 属性`
                )
              }
              break
            }
            case 'action': {
              if (
                column.typeProps?.actions &&
                Array.isArray(column.typeProps.actions) &&
                column.typeProps.actions.length > 0
              ) {
                // 取出当前可见的按钮
                const visibleActions = column.typeProps.actions.filter(
                  action => !isHiddenAction(action, row, index, props, column)
                )
                // 找出可能需要放到dropdown的按钮
                const dropdownActions = visibleActions.filter(
                  action => action.dropdown && ['always', 'auto'].includes(action.dropdown)
                )
                const showMoreButton = dropdownActions.length > 1
                // 找到绝对不需要放到dropdown的按钮
                const normalActions = visibleActions.filter(
                  action => !action.dropdown || action.dropdown === 'never'
                )
                // 开始渲染
                const align = column.align ?? props.align ?? 'left'
                const rowClassAlign =
                  align === 'left'
                    ? 'justify-start'
                    : align === 'right'
                      ? 'justify-end'
                      : 'justify-center'
                const handleClick = (name: string, event?: TableColumnFn<void>) => {
                  // 发送表格action事件
                  emit('action', name, row)
                  // 执行用户自定义事件
                  try {
                    event?.(row, index, column, props.form, props.dataSource)
                  } catch (e) {
                    console.error(e)
                  }
                }
                const handleCommand = (command: string) => {
                  const findAction = dropdownActions.find(action => action.name === command)
                  if (findAction) {
                    handleClick(findAction.name, findAction.event)
                  } else {
                    console.warn(`[AeTable] dropdownActions 中不存在 ${command}`)
                  }
                }
                const renderAction = (action: TableAction) => {
                  const buttonAttrs: any = {
                    type: 'default',
                    ...(action.buttonAttrs || {}),
                    disabled: isDisabledAction(action, row, index, props, column),
                    loading: isLoadingAction(action, row, index, props, column)
                  }
                  switch (action.type) {
                    case 'primary':
                      buttonAttrs.type = 'primary'
                      break
                    case 'second':
                      buttonAttrs.type = 'primary'
                      buttonAttrs.plain = true
                      break
                    default:
                      buttonAttrs.type = 'default'
                      break
                  }
                  return (
                    <ElButton
                      onClick={() => handleClick(action.name, action.event)}
                      {...buttonAttrs}
                    >
                      {!action.noIcon && action.icon ? (
                        <Icon icon={action.icon} size={14} />
                      ) : undefined}
                      {!action.noLabel && action.label ? <span>{action.label}</span> : undefined}
                    </ElButton>
                  )
                }
                return (
                  <div
                    class={`ae-table-cell-value w-full flex flex-row items-center gap-2 ${rowClassAlign}`}
                  >
                    {normalActions.length > 0 && normalActions.map(action => renderAction(action))}
                    {showMoreButton && (
                      <ElDropdown onCommand={(command: string) => handleCommand(command)}>
                        {{
                          default: () => (
                            <ElButton
                              type="default"
                              size={column?.typeProps?.actionDropdown?.size ?? 'default'}
                            >
                              {column?.typeProps?.actionDropdown?.noIcon ? undefined : (
                                <Icon icon="icon-park-outline:more" size={14} />
                              )}
                              {column?.typeProps?.actionDropdown?.noLabel ? undefined : (
                                <span>更多</span>
                              )}
                            </ElButton>
                          ),
                          dropdown: () => (
                            <ElDropdownMenu>
                              {dropdownActions.map(action => (
                                <ElDropdownItem
                                  command={action.name}
                                  disabled={isDisabledAction(action, row, index, props, column)}
                                >
                                  {action.icon ? <Icon icon={action.icon} size={14} /> : undefined}
                                  {<span>{action.label}</span>}
                                </ElDropdownItem>
                              ))}
                            </ElDropdownMenu>
                          )
                        }}
                      </ElDropdown>
                    )}
                  </div>
                )
              } else {
                console.warn(
                  `[AeTable] column ${column?.label} 使用了 action 类型，但未配置 actions 属性`
                )
                return emptyValue
              }
            }
          }
        }

        // 为value添加其他前后置功能
        const copyable = isCopyable(props, column, row, index)
        const clickable = isClickable(props, column, row, index)
        if ((copyable || clickable) && value) {
          const ellipsis = column.ellipsis ?? props.ellipsis ?? false
          const align = column.align ?? props.align ?? 'left'
          const rowClassAlign =
            align === 'left'
              ? 'justify-start'
              : align === 'right'
                ? 'justify-end'
                : 'justify-center'
          const textClassEllipsis = ellipsis ? 'text-ellipsis overflow-hidden text-nowrap' : ''
          const textClickable = clickable ? 'clickable-text' : ''
          const onClickCopy = () => {
            if (copyable) {
              const copyValue =
                column.copyValueMethod !== undefined
                  ? column.copyValueMethod(row, index, column, props.form, props.dataSource)
                  : originValue
              copyToClipboard(copyValue).then(res => {
                if (res) {
                  ElMessage.success('复制成功')
                } else {
                  ElMessage.error('复制失败')
                }
              })
            }
          }
          const onClickValue = () => {
            if (clickable) {
              const columnKey = column.key || column.field
              emit('value-click', columnKey, row)
              if (column.clickMethod !== undefined) {
                column.clickMethod(row, index, column, props.form, props.dataSource)
              }
            }
          }
          return (
            <div
              class={`ae-table-cell-value w-full flex flex-row items-center gap-2.5 ${rowClassAlign}`}
            >
              {copyable && (
                <ElIcon
                  class="ae-table-cell-value__icon copyable-icon"
                  onClick={() => onClickCopy()}
                >
                  <CopyDocument />
                </ElIcon>
              )}
              <div
                class={`ae-table-cell-value__text flex-1 ${textClassEllipsis} ${textClickable}`}
                onClick={() => onClickValue()}
              >
                {valueRender !== '' ? valueRender : value}
              </div>
            </div>
          )
        } else {
          return valueRender !== '' ? valueRender : value || emptyValue
        }
      }
    }
    // 渲染列
    const renderTableColumn = (column: TableColumn) => {
      const columnKey = column.key || column.field
      // 如果缺少key则警告
      if (!columnKey) {
        console.warn(`[AeTable] column ${column.label} is missing key, please add key to column.`)
      }
      // 序号列
      if (column?.type === 'index') {
        const getIndex = (index: number) => {
          if (column.typeProps?.index !== undefined) {
            return column.typeProps?.index
          } else {
            return setIndex(
              column.typeProps?.reserveIndex || true,
              index,
              pageSizeRef.value || 10,
              pageRef.value || 1
            )
          }
        }
        return (
          <ElTableColumn
            type="index"
            index={(index: number) => getIndex(index)}
            align={column.align ?? props.align ?? 'center'}
            headerAlign={column.headerAlign ?? props.headerAlign ?? 'center'}
            fixed={column.fixed ?? false}
            label={column.label ?? ''}
            width={column.width ?? 70}
            minWidth={column.minWidth ?? 70}
            column-key={column.key ?? 'index'}
          />
        )
      }
      // 是否是多级表头的父级
      if (column.children && column.children.length > 0) {
        // 获取有效的列
        const validChildColumns = column.children.filter(column => {
          const visible = column.visible === undefined ? true : column.visible
          return visible ? !isHidden(props, column) : false
        })
        return (
          <ElTableColumn
            align={column.align || props.align || 'center'}
            headerAlign={column.headerAlign || props.headerAlign || 'center'}
            className={'ae-table-column-parent'}
          >
            {{
              default: () => renderColumns(validChildColumns),
              header: () =>
                getSlot(slots, `${columnKey}-header`) || (
                  <TooltipHeader title={column.label} subtitle={column.subLabel} />
                )
            }}
          </ElTableColumn>
        )
      } else {
        const columnAttrs = {
          showOverflowTooltip: column.ellipsis || props.ellipsis || false,
          align: column.align || props.align || 'center',
          headerAlign: column.headerAlign || props.headerAlign || 'center',
          fixed: column.fixed || false,
          width: column.width || '',
          minWidth: column.minWidth || '',
          prop: column.field || '',
          ...(column.columnAttrs || {}),
          className: isEditable(props, column) ? 'ae-table-column-editable' : 'ae-table-column'
        }
        return (
          <ElTableColumn {...columnAttrs}>
            {{
              default: (data: TableSlotDefault) =>
                getSlot(slots, column.field, data) ||
                renderTableColumnDefault(column, data.row, data.$index),
              header: () =>
                getSlot(slots, `${columnKey}-header`) ||
                column.headerRender?.({}, null, column, props.form, props.dataSource) || (
                  <TooltipHeader title={column.label} subtitle={column.subLabel} />
                )
            }}
          </ElTableColumn>
        )
      }
    }
    // 循环渲染列
    const renderColumns = (columns: TableColumn[]) => {
      return columns
        .filter(column => !(column.type && ['expand', 'selection', 'radio'].includes(column.type)))
        .map(column => renderTableColumn(column))
    }

    // 返回所有列
    return [
      ...[renderRadioColumn(radioColumn)],
      ...[renderSelectionColumn(selectionColumn)],
      ...[renderExpandColumn(expandColumn)]
    ].concat([renderColumns(validColumns)])
  } else {
    // console.log('[AeTable]:组件的columns为空，无法渲染表格！')
    return undefined
  }
}
