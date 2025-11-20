/**
 * 操作列渲染器
 * @description 专门处理 action 类型列的渲染逻辑
 */
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Icon } from '@/components/Icon'
import type { TableColumn, TableProps, TableAction, TableColumnFn, TableEmits } from '../types'
import { isHiddenAction, isDisabledAction, isLoadingAction } from '../utils'
import type { VNode } from 'vue'
import { t, logger } from '@/locale'

export interface ActionRenderContext {
  props: TableProps
  column: TableColumn
  row: Recordable
  index: number
  emit: TableEmits
}

/**
 * 渲染操作列
 */
export function renderActionColumn(ctx: ActionRenderContext): VNode | string {
  const { column, row, index, props, emit } = ctx

  if (!column.typeProps?.actions || !Array.isArray(column.typeProps.actions) || column.typeProps.actions.length === 0) {
    logger.warn('console.table.actionTypeRequired', undefined, column)
    return props.emptyValue || '-'
  }

  // 过滤可见按钮
  const visibleActions = column.typeProps.actions.filter(
    action => !isHiddenAction(action, row, index, props, column)
  )

  // 分类按钮
  const { normalActions, dropdownActions } = categorizeActions(visibleActions)
  const showMoreButton = dropdownActions.length > 1

  // 对齐方式
  const align = column.align ?? props.align ?? 'left'
  const rowClassAlign = getAlignClass(align)

  // 事件处理器
  const handlers = createActionHandlers(ctx, dropdownActions)

  return (
    <div class={`ae-table-cell-value w-full flex flex-row items-center gap-2 ${rowClassAlign}`}>
      {normalActions.length > 0 && normalActions.map(action => renderActionButton(action, handlers.handleClick, ctx))}
      {showMoreButton && renderMoreDropdown(column, dropdownActions, handlers.handleCommand, ctx)}
    </div>
  )
}

/**
 * 分类按钮（普通按钮 vs 下拉按钮）
 */
function categorizeActions(actions: TableAction[]) {
  const dropdownActions = actions.filter(
    action => action.dropdown && ['always', 'auto'].includes(action.dropdown)
  )
  const normalActions = actions.filter(
    action => !action.dropdown || action.dropdown === 'never'
  )

  return { normalActions, dropdownActions }
}

/**
 * 创建事件处理器
 */
function createActionHandlers(ctx: ActionRenderContext, dropdownActions: TableAction[]) {
  const { row, index, column, props, emit } = ctx

  const handleClick = (name: string, event?: TableColumnFn<void>) => {
    // 发送表格 action 事件
    emit('action', name, row)

    // 执行用户自定义事件
    try {
      event?.(row, index, column, props.form, props.excontext, props.editable)
    } catch (e) {
      logger.error('console.table.actionEventError', undefined, e, column)
    }
  }

  const handleCommand = (command: string) => {
    const findAction = dropdownActions.find(action => action.name === command)
    if (findAction) {
      handleClick(findAction.name, findAction.event)
    } else {
      logger.warn('console.table.actionNotFound', { command }, column)
    }
  }

  return { handleClick, handleCommand }
}

/**
 * 渲染单个操作按钮
 */
function renderActionButton(
  action: TableAction,
  handleClick: (name: string, event?: TableColumnFn<void>) => void,
  ctx: ActionRenderContext
) {
  const buttonAttrs = getButtonAttrs(action, ctx)

  return (
    <ElButton onClick={() => handleClick(action.name, action.event)} {...buttonAttrs}>
      {!action.noIcon && action.icon && <Icon icon={action.icon} size={14} />}
      {!action.noLabel && action.label && <span>{action.label}</span>}
    </ElButton>
  )
}

/**
 * 获取按钮属性
 */
function getButtonAttrs(action: TableAction, ctx: ActionRenderContext) {
  const { row, index, props, column } = ctx

  const buttonAttrs: any = {
    type: 'default',
    ...(action.buttonAttrs || {}),
    disabled: isDisabledAction(action, row, index, props, column),
    loading: isLoadingAction(action, row, index, props, column)
  }

  // 根据 action.type 设置按钮样式
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

  return buttonAttrs
}

/**
 * 渲染"更多"下拉菜单
 */
function renderMoreDropdown(
  column: TableColumn,
  dropdownActions: TableAction[],
  handleCommand: (command: string) => void,
  ctx: ActionRenderContext
) {
  return (
    <ElDropdown onCommand={(command: string) => handleCommand(command)}>
      {{
        default: () => (
          <ElButton
            type="default"
            size={column?.typeProps?.actionDropdown?.size ?? 'default'}
          >
            {!column?.typeProps?.actionDropdown?.noIcon && (
              <Icon icon="icon-park-outline:more" size={14} />
            )}
            {!column?.typeProps?.actionDropdown?.noLabel && <span>{t('table.action.more')}</span>}
          </ElButton>
        ),
        dropdown: () => (
          <ElDropdownMenu>
            {dropdownActions.map(action => renderDropdownItem(action, ctx))}
          </ElDropdownMenu>
        )
      }}
    </ElDropdown>
  )
}

/**
 * 渲染下拉菜单项
 */
function renderDropdownItem(action: TableAction, ctx: ActionRenderContext) {
  const { row, index, props, column } = ctx

  return (
    <ElDropdownItem
      command={action.name}
      disabled={isDisabledAction(action, row, index, props, column)}
    >
      {action.icon && <Icon icon={action.icon} size={14} />}
      <span>{action.label}</span>
    </ElDropdownItem>
  )
}

/**
 * 获取对齐样式类
 */
function getAlignClass(align: 'left' | 'center' | 'right'): string {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }
  return alignMap[align] || 'justify-start'
}
