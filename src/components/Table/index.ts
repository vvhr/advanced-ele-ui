import Table from './src/Table.vue'

export type TableDefineProps = InstanceType<typeof Table>['$props']
export type TableInstance = InstanceType<typeof Table>
export type {
  Pagination as TablePagination,
  TableColumn,
  TableColumnFn,
  TableColumnType,
  TableColumnTypeProps,
  TableAction,
  TableEmits,
  TableProps,
  TableSlotDefault,
  ElButtonProps,
  TablePlusHeaderKey
} from './src/types'

export { Table }
export default Table
