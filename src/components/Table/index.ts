import Table from './src/Table.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { TableExpose } from './src/types'

export const AeTable: SFCWithInstall<typeof Table> = withInstall(Table)
export default AeTable

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

// 兼容旧的导出方式
export { AeTable as Table }
