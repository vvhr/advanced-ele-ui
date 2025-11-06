import Table from './src/Table.vue'

export type ZwTableDefineProps = InstanceType<typeof Table>['$props']
export type ZwTableInstance = InstanceType<typeof Table>
export type {
  Pagination as ZwTablePagination,
  ZwTableColumn,
  ZwTableColumnFn,
  ZwTableColumnType,
  ZwTableColumnTypeProps,
  ZwTableAction,
  TableEmits as ZwTableEmits,
  TableProps as ZwTableProps
} from './src/types'

export { Table as ZwTable }
