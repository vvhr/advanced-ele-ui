import { TableEmits, TableProps } from '../types'

export function usePagination(props: TableProps, emit: TableEmits) {
  const pageSizeRef = ref(props.pageSize)
  const currentPageRef = ref(props.page)
  const pagination = computed(() => {
    return Object.assign(
      {
        background: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSizes: [10, 20, 30, 40, 50, 100],
        disabled: false,
        hideOnSinglePage: false,
        total: 10
      },
      unref(props).pagination
    )
  })
  function watchPage() {
    // 监听分页器变化
    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )
    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:page', val)
      }
    )
    watch(
      () => unref(props).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )
    watch(
      () => unref(props).page,
      (val: number) => {
        currentPageRef.value = val
      }
    )
  }

  return {
    pageSizeRef,
    currentPageRef,
    pagination,
    watchPage
  }
}
