<script lang="tsx">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  unref,
  type PropType,
  type VNode
} from 'vue'
import { ElTable, TableColumnCtx, ElForm } from 'element-plus'
import type { TableProps, TableColumn, Pagination, TableFormImportItem } from './types'
import type { ElTableEventHanders } from './internal-types'
import type { DictMap } from '@/types/dict'
import { renderPagination } from './render/RenderPagination'
import { renderTable } from './render/RenderTable'
import { usePagination } from './hook/usePagination'
import { findColumnByField, findColumnByKey } from './utils'
import { formatAmount } from '@/utils/format'
import { useDict, UseDictTools } from '@/utils/dict'
import { useImport } from './hook/useImport'
import { logger } from '@/locale'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_EMPTY_VALUE,
  DEFAULT_ROW_KEY
} from './constants'
export default defineComponent({
  name: 'AeTable',
  props: {
    modelValue: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    form: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    excontext: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    dict: {
      type: Object as PropType<DictMap>,
      default: () => ({})
    },
    editable: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: DEFAULT_PAGE_INDEX
    },
    pageSize: {
      type: Number,
      default: DEFAULT_PAGE_SIZE
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object as PropType<Pagination | undefined | false>,
      default: (): Pagination | undefined => undefined
    },
    loading: {
      type: Boolean,
      default: false
    },
    align: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'left'
    },
    headerAlign: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'left'
    },
    size: {
      type: String as PropType<'small' | 'default' | 'large'>,
      default: 'default'
    },
    rowKey: {
      type: String,
      default: DEFAULT_ROW_KEY
    },
    emptyValue: {
      type: String,
      default: DEFAULT_EMPTY_VALUE
    },
    // 自适应高度和宽度
    adaptive: {
      type: Boolean,
      default: false
    },
    // 是否显示合计行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 自定义合计行逻辑
    summaryMethod: {
      type: Function as PropType<TableProps['summaryMethod']>,
      default: null
    },
    // 强制组件重新渲染的key
    freshKey: {
      type: Number,
      default: 0
    },
    /**
     * 加载扩展组件
     * @description 您可以通过此属性来按需加载一些组件
     */
    imports: {
      type: Array as PropType<TableFormImportItem[]>,
      default: () => []
    }
  },
  emits: [
    'update:modelValue',
    'update:editable',
    'update:page',
    'update:pageSize',
    'register',
    'selection-change',
    'page-change',
    'current-change',
    'row-click',
    'value-click',
    'action'
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const { components, componentConfigs, registerComponents } = useImport()
    registerComponents(props.imports)

    // 声明 elTableRef 实例
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    const elFormRef = ref<ComponentRef<typeof ElForm>>()
    const selections = ref<Recordable[]>([])
    const currentRowRef = ref<Recordable>()
    const dictTools: UseDictTools = useDict(props.dict)
    // 声明分页器的属性
    const { pageSizeRef, currentPageRef, pagination, watchPage } = usePagination(props, emit)
    // 监听分页器属性
    const stopWatchPage = watchPage()

    // 清洗需要透传给el-table的属性
    const elTableAttrs = computed(() => {
      const allAttrs: Recordable = { ...attrs, ...props }
      const cleanProps = [
        'modelValue',
        'columns',
        'form',
        'excontext',
        'editable',
        'page',
        'pageSize',
        'ellipsis',
        'pagination',
        'selections',
        'selectionKeys',
        'emptyValue',
        'adaptive',
        'summaryMethod',
        'freshKey',
        'dict',
        'imports'
      ]
      cleanProps.forEach(prop => {
        delete allAttrs[prop]
      })
      return allAttrs
    })

    function summaryMethodLocal(param: { columns: TableColumnCtx<any>[]; data: any[] }) {
      // 如果已定定义了summaryMethod，则使用自定义的逻辑
      if (props.summaryMethod !== null) {
        return props.summaryMethod(param)
      }
      // 否则使根据props.columns自动生成
      const { columns, data } = param
      const sums: (string | VNode)[] = []
      columns.forEach((column, index) => {
        if (!column.property && !column.columnKey) {
          sums[index] = props.emptyValue
          return
        }
        const findColumn = column.columnKey
          ? findColumnByKey(props.columns, column.columnKey)
          : findColumnByField(props.columns, column.property)
        if (findColumn && findColumn.summable) {
          const values = column.property ? data.map(item => Number(item[column.property])) : []
          if (findColumn.summaryMethod !== undefined) {
            sums[index] = findColumn.summaryMethod(values)
            return
          }
          // 是否是金额类型
          if (findColumn.type === 'amount') {
            const count = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            const {
              amountThousand = false,
              amountDecimal = true,
              amountDigits = 2,
              amountUnit = '',
              amountUnitPosition = 'right'
            } = findColumn.typeProps || {}
            sums[index] = formatAmount(count, {
              amountThousand,
              amountDecimal,
              amountDigits,
              amountUnit,
              amountUnitPosition,
              defaultValue: props.emptyValue
            })
            return
          }
          // 其他情况
          if (!values.every(value => Number.isNaN(value))) {
            sums[index] = `${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)}`
          } else {
            sums[index] = props.emptyValue
          }
        } else {
          sums[index] = props.emptyValue
          return
        }
      })
      return sums
    }

    onMounted(() => {
      emit('register', elTableRef.value)
    })
    onUnmounted(() => {
      stopWatchPage()
    })

    const elTableHanders: ElTableEventHanders = {
      handleSelectionChange: (selection: Recordable[]) => {
        selections.value = selection
        emit('selection-change', selection)
      },
      handleCurrentChange: (currentRow: Recordable) => {
        currentRowRef.value = currentRow
        emit('current-change', currentRow)
      },
      handleRowClick: (row: Recordable) => {
        currentRowRef.value = row
        emit('row-click', row)
      }
    }

    function updateSelections(rows: Recordable[]) {
      selections.value = rows
      if (!props.rowKey) {
        logger.warn('console.table.rowKeyRequired')
        return
      }
      if (rows.length) {
        elTableRef.value!.clearSelection()
        rows.forEach(item => {
          elTableRef.value.toggleRowSelection(item, true, true)
        })
      } else {
        elTableRef.value!.clearSelection()
      }
    }

    function handlePageChange(currentPage: number, pageSize: number) {
      emit('page-change', { page: currentPage, pageSize })
    }

    async function validate() {
      return props.editable ? await elFormRef.value?.validate() : true
    }

    function resetValidate() {
      unref(elFormRef)?.clearValidate()
    }

    expose({
      updateSelections,
      validate,
      resetValidate
    })

    return () => (
      <div class={`ae-table ${props.adaptive ? 'is-adaptive' : ''}`} ref="aeTableRef">
        {renderTable(
          props,
          slots,
          emit,
          currentRowRef,
          pageSizeRef,
          currentPageRef,
          elTableRef,
          elFormRef,
          elTableAttrs,
          elTableHanders,
          selections,
          summaryMethodLocal,
          dictTools,
          components,
          componentConfigs
        )}
        {renderPagination(props, pageSizeRef, currentPageRef, pagination, handlePageChange)}
      </div>
    )
  }
})
</script>

<style lang="less">
.ae-table {
  width: 100%;

  &.is-adaptive {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;

    // 仅修改顶层的子级表单样式, 避免影响嵌套的子级表单样式
    > .ae-table-form {
      flex: 1;
      width: 100%;
      height: 0;

      > .ae-table-main {
        height: 100%;
      }
    }

    // 仅修改顶层的表格样式, 避免影响嵌套的子级表格样式
    > .ae-table-main {
      flex: 1;
      width: 100%;
      height: 0;
    }
  }

  .copyable-icon {
    cursor: pointer;
    color: #959595;
    transition: color 0.1s ease-in;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .clickable-text {
    color: var(--el-color-primary);
    cursor: pointer;
    max-width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }

  .el-table__body {
    .ae-table-column-editable {
      padding: 4px 0;
    }
  }

  .el-table__cell {
    .cell {
      // 优化el-form-item样式, 使其上下空白相等
      > .el-form-item {
        margin-bottom: 15px;
        margin-top: 15px;
      }

      > .ae-table-cell-value {
        // 移除el-button默认的相邻间距
        .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
  }

  .has-append {
    .el-table__append-wrapper {
      overflow: hidden;
      border-top: 1px solid #f2f3f5;
      height: 42px;
    }
  }

  .ae-table-append {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 2;

    .ae-table-append-selection {
      padding: 10px 15px;
      width: 100%;
      border-top: 1px solid #f2f3f6;
      background: white;

      > .total {
        color: var(--el-color-primary);
      }
    }
  }

  .ae-table-pagination {
    padding: 15px 0;
  }
}
</style>
