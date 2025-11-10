import type { App } from 'vue'
import 'virtual:uno.css'

// 导入组件
import { ZwForm } from './components/Form'
import { Icon } from './components/Icon'
import { ZwTable } from './components/Table'
import { Editor } from './components/Editor'
import { Upload } from './components/Upload'

// ============ 导出全局类型 ============
export * from './types'

// ============ 导出组件 ============
export { ZwForm, Icon as ZwIcon, ZwTable, Editor as ZwEditor, Upload as ZwUpload }

// ============ 导出组件类型（推荐使用命名空间方式） ============
// Form 组件类型
export type * as FormTypes from './components/Form/src/types'
export type { FormProps as ZwFormProps } from './components/Form/src/types'

// Table 组件类型
export type {
  ZwTableDefineProps,
  ZwTableInstance,
  ZwTablePagination,
  ZwTableColumn,
  ZwTableColumnFn,
  ZwTableColumnType,
  ZwTableColumnTypeProps,
  ZwTableAction,
  ZwTableEmits,
  ZwTableProps
} from './components/Table'

// Icon 组件类型
export type { IconProps } from './components/Icon'

// Editor 组件类型
export type {
  EditorProps,
  EditorEmits,
  ToolbarKey,
  AddToolItem,
  AddToolItemPosition
} from './components/Editor'
export type { AiEditor } from 'aieditor'

// Upload 组件类型
export type {
  UploadProps,
  UploadFile,
  UploadRawFile,
  FileKeys,
  FileTemplate
} from './components/Upload'

// ============ 导出常量 ============
export { SIMPLE_TOOLBAR_KEYS, FULL_TOOLBAR_KEYS } from './components/Editor'

// 安装函数
const install = (app: App) => {
  app.component('ZwForm', ZwForm)
  app.component('ZwTable', ZwTable)
  app.component('ZwIcon', Icon)
  app.component('ZwEditor', Editor)
  app.component('ZwUpload', Upload)
}

// 默认导出
export default {
  install,
  version: '0.0.5'
}
