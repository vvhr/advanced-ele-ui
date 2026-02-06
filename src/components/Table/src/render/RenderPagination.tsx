import type { TableProps, Pagination } from '../types'
import { ElPagination } from 'element-plus'
import { unref, Ref } from 'vue'
export function renderPagination(
  props: TableProps,
  pageSizeRef: Ref<number>,
  currentPageRef: Ref<number>,
  pagination: Ref<Pagination>,
  handlePageChange: (page: number, pageSize: number) => void
) {
  return props.pagination ? (
    <ElPagination
      v-model:pageSize={pageSizeRef.value}
      v-model:currentPage={currentPageRef.value}
      class="ae-table-pagination"
      {...unref(pagination)}
      onChange={handlePageChange}
    ></ElPagination>
  ) : undefined
}
