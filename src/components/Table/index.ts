import Table from './src/Table.vue'
import type { TableExpose } from './src/types'

export type TableDefineProps = InstanceType<typeof Table>['$props']
export type TableInstance = InstanceType<typeof Table> & TableExpose
export type {
  TableSlots,
  TableEmits,
  TableProps,
  TableExpose,
  Pagination as TablePagination,
  TableColumn,
  TableColumnFn,
  TableColumnType,
  TableColumnTypeProps,
  TableColumnEditProps,
  TableFormComponentName,
  TableFormComponentProps,
  TableAction,
  TableSlotDefault,
  TableFormComponentEvents,
  TableFormComponentEventFn,
  TableFormInsidePropsRenders,
  TableFormInsidePropsRender,
  TableFormAutoRules
} from './src/types'

export { Table }
export default Table
