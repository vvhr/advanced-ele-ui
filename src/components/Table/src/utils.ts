import type { TableProps, TableAction, TableColumn } from './types'
import { isFunction } from '@/utils/is'

export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
  const newIndex = index + 1
  if (reserveIndex) {
    return size * (current - 1) + newIndex
  } else {
    return newIndex
  }
}

export function isHidden(props: TableProps, column: TableColumn) {
  if (column.hidden === undefined) {
    return false
  }
  if (isFunction(column.hidden)) {
    return column.hidden({}, null, column, props.form, props.excontext, props.editable)
  } else {
    return column.hidden
  }
}

export function isHiddenAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  if (action.hidden === undefined) {
    return false
  }
  if (isFunction(action.hidden)) {
    return action.hidden(row, index, column, props.form, props.excontext, props.editable)
  } else {
    return action.hidden
  }
}
export function isDisabledAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  if (action.disabled === undefined) {
    return false
  }
  if (isFunction(action.disabled)) {
    return action.disabled(row, index, column, props.form, props.excontext, props.editable)
  } else {
    return action.disabled
  }
}
export function isLoadingAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  if (action.loading === undefined) {
    return false
  }
  if (isFunction(action.loading)) {
    return action.loading(row, index, column, props.form, props.excontext, props.editable)
  } else {
    return action.loading
  }
}
export function isEditable(props: TableProps, column: TableColumn) {
  if (props.editable) {
    if (column.editable === undefined) {
      return true
    }
    if (isFunction(column.editable)) {
      return column.editable({}, null, column, props.form, props.excontext, props.editable)
    } else {
      return column.editable
    }
  }
  return false
}

export function isDisabled(props: TableProps, column: TableColumn, row: Recordable, index: number) {
  if (column.editProps?.componentProps?.disabled === undefined) {
    return false
  }
  if (isFunction(column.editProps?.componentProps?.disabled)) {
    return column.editProps?.componentProps?.disabled(
      row,
      index,
      column,
      props.form,
      props.excontext,
      props.editable
    )
  } else {
    return column.editProps?.componentProps?.disabled
  }
}

export function isCopyable(props: TableProps, column: TableColumn, row: Recordable, index: number) {
  if (column.copyable === undefined) {
    return false
  }
  if (isFunction(column.copyable)) {
    return column.copyable(row, index, column, props.form, props.excontext, props.editable)
  } else {
    return column.copyable
  }
}
export function isClickable(
  props: TableProps,
  column: TableColumn,
  row: Recordable,
  index: number
) {
  if (column.clickable === undefined) {
    return false
  }
  if (isFunction(column.clickable)) {
    return column.clickable(row, index, column, props.form, props.excontext, props.editable)
  } else {
    return column.clickable
  }
}

export function findColumnByField(columns: TableColumn[], field: string) {
  const findColumn = (_columns: TableColumn[]) => {
    for (const column of _columns) {
      if (column.field && column.field === field) {
        return column
      }
      if (column.children && column.children.length > 0) {
        return findColumn(column.children)
      }
    }
    return null
  }
  return findColumn(columns)
}

export function findColumnByKey(columns: TableColumn[], key: string) {
  const findColumn = (_columns: TableColumn[]) => {
    for (const column of _columns) {
      if (column.key && column.key === key) {
        return column
      }
      if (column.children && column.children.length > 0) {
        return findColumn(column.children)
      }
    }
    return null
  }
  return findColumn(columns)
}
