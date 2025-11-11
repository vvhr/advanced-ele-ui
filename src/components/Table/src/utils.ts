import type { TableProps, TableAction, TableColumn } from './types'

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
  if (typeof column.hidden === 'function') {
    return column.hidden({}, null, column, props.form, props.dataSource)
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
  if (typeof action.hidden === 'function') {
    return action.hidden(row, index, column, props.form, props.dataSource)
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
  if (typeof action.disabled === 'function') {
    return action.disabled(row, index, column, props.form, props.dataSource)
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
  if (typeof action.loading === 'function') {
    return action.loading(row, index, column, props.form, props.dataSource)
  } else {
    return action.loading
  }
}
export function isEditable(props: TableProps, column: TableColumn) {
  if (props.editable) {
    if (column.editable === undefined) {
      return true
    }
    if (typeof column.editable === 'function') {
      return column.editable({}, null, column, props.form, props.dataSource)
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
  if (typeof column.editProps?.componentProps?.disabled === 'function') {
    return column.editProps?.componentProps?.disabled(
      row,
      index,
      column,
      props.form,
      props.dataSource
    )
  } else {
    return column.editProps?.componentProps?.disabled
  }
}

export function isCopyable(props: TableProps, column: TableColumn, row: Recordable, index: number) {
  if (column.copyable === undefined) {
    return false
  }
  if (typeof column.copyable === 'function') {
    return column.copyable(row, index, column, props.form, props.dataSource)
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
  if (typeof column.clickable === 'function') {
    return column.clickable(row, index, column, props.form, props.dataSource)
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
