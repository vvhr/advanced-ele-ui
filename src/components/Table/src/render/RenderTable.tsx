import { getSlot } from '../utils'
import type {
  ElTableEventHanders,
  TableEmits,
  TableProps
} from '../types'
import { ElTable, ElForm, vLoading } from 'element-plus'
import { renderTableColumns } from '../render/RenderTableColumn'
import { type Ref, withDirectives, unref } from 'vue'
import type { UseDictTools } from "@/utils/dict.ts";

export function renderTable(
  props: TableProps,
  slots: any,
  emit: TableEmits,
  currentRowRef: Ref<Recordable>,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  elTableRef: Ref<ComponentRef<typeof ElTable>>,
  elFormRef: Ref<ComponentRef<typeof ElForm>>,
  elTableAttrs: Ref<Recordable>,
  elTableHanders: ElTableEventHanders,
  selections: Ref<Recordable[]>,
  summaryMethodLocal: TableProps['summaryMethod'],
  dictTools: UseDictTools
) {
  const showAppend = () => {
    return Reflect.has(slots, 'append') || (selections.value && selections.value.length > 0)
  }
  const renderElTableAppend = () => {
    if (selections.value && selections.value.length > 0) {
      return (
        <div class="zw-table-append">
          <div class="zw-table-append-selection">
            当前已选择 <span class="total">{selections.value.length}</span> 条数据
          </div>
        </div>
      )
    } else {
      return undefined
    }
  }
  const renderElTable = () => {
    const tableClass = `zw-table-main ${showAppend() ? 'has-append' : ''}`
    const table = (
      <ElTable
        ref={elTableRef}
        key={props.freshKey}
        data={props.modelValue}
        onSelection-change={elTableHanders.handleSelectionChange}
        onCurrent-change={elTableHanders.handleCurrentChange}
        onRow-click={elTableHanders.handleRowClick}
        header-row-class-name="zw-table-header"
        summary-method={props.showSummary ? summaryMethodLocal : undefined}
        class={tableClass}
        {...unref(elTableAttrs)}
      >
        {{
          default: () => renderTableColumns(props, slots, emit, currentRowRef, pageSizeRef, pageRef, dictTools),
          append: () => getSlot(slots, 'append') || renderElTableAppend()
        }}
      </ElTable>
    )

    // 使用 withDirectives 应用 v-loading 指令
    return withDirectives(table, [[vLoading, props.loading]])
  }

  // 如果启用了编辑模式，则使用el-form包裹
  if (props.editable) {
    return (
      <ElForm class="zw-table-form" ref={elFormRef} model={props.modelValue}>
        {{
          default: () => renderElTable()
        }}
      </ElForm>
    )
  }

  return renderElTable()
}
