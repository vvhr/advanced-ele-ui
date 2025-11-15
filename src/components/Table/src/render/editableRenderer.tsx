/**
 * 可编辑列渲染器
 * @description 处理编辑模式下的列渲染
 */
import { ElFormItem } from 'element-plus'
import type { TableColumn, TableProps, TableEmits, TableSlots, TableFormComponentName, TableFormImportItemConfig } from '../types'
import { useComponent } from '../hook/useComponent'
import type { Component, VNode } from 'vue'
import { logger } from '@/locale'

export interface EditableRenderContext {
  props: TableProps
  slots: TableSlots
  emit: TableEmits
  column: TableColumn
  row: Recordable
  index: number
  components: Partial<Recordable<Component, TableFormComponentName>>
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
}

/**
 * 渲染可编辑列
 */
export function renderEditableColumn(ctx: EditableRenderContext): VNode | undefined {
  const { props, slots, emit, column, row, index, components, componentConfigs } = ctx

  const {
    field,
    freshKey,
    formItemProps,
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setInsideRenders
  } = useComponent(
    props,
    slots,
    emit,
    row,
    index,
    column,
    props.form,
    components,
    componentConfigs
  )

  // 验证 field
  if (!field) {
    logger.warn('console.table.editFieldRequired', undefined, column)
  }

  // 渲染编辑组件
  const renderEditComponent = () => {
    const AnyComponent = getAnyComponent()

    if (AnyComponent === undefined) {
      logger.error('console.table.editComponentError', undefined, column)
      return renderErrorPlaceholder(column)
    }

    return (
      <AnyComponent
        {...setModelValue()}
        {...setComponentProps()}
        {...setComponentEvent()}
        key={freshKey}
      >
        {{ ...setInsideRenders() }}
      </AnyComponent>
    )
  }

  return (
    <ElFormItem {...formItemProps}>
      {{
        default: () => renderEditComponent()
      }}
    </ElFormItem>
  )
}

/**
 * 渲染错误占位符
 */
function renderErrorPlaceholder(column: TableColumn): VNode {
  return (
    <div class="ae-table-edit-error" style="color: #f56c6c; font-size: 12px;">
      组件配置错误: {column.editProps?.component || 'Unknown'}
    </div>
  )
}
