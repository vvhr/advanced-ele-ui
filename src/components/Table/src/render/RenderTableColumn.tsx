import {
  TableEmits,
  TableProps,
  TableSlotDefault,
  TableColumn,
  TableFormComponentName,
  TableFormImportItemConfig,
  TableSlots
} from '../types'
import {
  ElTableColumn,
  ElRadio
} from 'element-plus'
import TooltipHeader from '@/components/Table/src/components/TooltipHeader.vue'
import { getSlot } from '@/utils/get'
import {
  setIndex,
  isHidden,
  isEditable
} from '../utils'
import type { Ref, Component } from 'vue'
import type { UseDictTools } from '@/utils/dict'
import {
  renderDictColumn,
  renderAmountColumn,
  renderDateColumn,
  renderSensitiveColumn,
  wrapValueWithFeatures,
  type RenderContext
} from './columnRenderers'
import { renderActionColumn, type ActionRenderContext } from './actionRenderer'
import { renderEditableColumn, type EditableRenderContext } from './editableRenderer'
import { logger } from '@/locale'

export function renderTableColumns(
  props: TableProps,
  slots: TableSlots,
  emit: TableEmits,
  currentRowRef: Ref<Recordable>,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  dictTools: UseDictTools,
  components: Partial<Recordable<Component, TableFormComponentName>>,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
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
          ? column.typeProps?.selectable(row, index, column, props.form, props.excontext)
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
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }
    // 渲染列的default插槽
    const renderTableColumnDefault = (column: TableColumn, row: Recordable, index: number) => {
      // 1. 编辑模式
      if (isEditable(props, column)) {
        return renderEditableColumn({
          props,
          slots,
          emit,
          column,
          row,
          index,
          components,
          componentConfigs
        })
      }

      // 2. 显示模式
      return renderDisplayColumn(column, row, index)
    }

    /**
     * 渲染显示模式的列
     */
    const renderDisplayColumn = (column: TableColumn, row: Recordable, index: number) => {
      const emptyValue = column.emptyValue || props.emptyValue || ''
      const value = column.field ? row[column.field] : ''
      const originValue = value

      // 构建渲染上下文
      const ctx: RenderContext = {
        props,
        column,
        row,
        index,
        value,
        originValue,
        emptyValue,
        dictTools,
        emit
      }

      // 处理默认类型（无类型或 default 类型）
      if (column.type === 'default' || !column.type) {
        // 优先使用 render 函数
        if (column.render !== undefined) {
          return column.render(row, index, column, props.form, props.excontext)
        }

        // 使用 formatter 函数
        if (column.formatter !== undefined) {
          const formattedValue = column.formatter(row, index, column, props.form, props.excontext)
          return wrapValueWithFeatures(ctx, { value: formattedValue })
        }

        // 返回原始值
        return wrapValueWithFeatures(ctx, { value: value || emptyValue })
      }

      // 根据类型渲染
      const result = renderByType(ctx)
      return wrapValueWithFeatures(ctx, result)
    }

    /**
     * 根据列类型渲染
     */
    const renderByType = (ctx: RenderContext) => {
      const { column, emptyValue } = ctx

      switch (column.type) {
        case 'dict':
          return renderDictColumn(ctx)

        case 'amount':
          return renderAmountColumn(ctx)

        case 'date':
          return renderDateColumn(ctx)

        case 'sensitive':
          return renderSensitiveColumn(ctx)

        case 'action':
          return renderActionColumn({
            props: ctx.props,
            column: ctx.column,
            row: ctx.row,
            index: ctx.index,
            emit: ctx.emit
          })

        default:
          logger.warn('console.table.unknownColumnType', { type: column.type }, column)
          return { value: emptyValue }
      }
    }
    // 渲染列
    const renderTableColumn = (column: TableColumn) => {
      const columnKey = column.key || column.field
      // 如果缺少key则警告
      if (!columnKey) {
        logger.warn('console.table.columnMissingKey', { label: column.label || '' }, column)
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
                getSlot(slots, `${columnKey}--header`) || (
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
                column.headerRender?.({}, null, column, props.form, props.excontext) || (
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
