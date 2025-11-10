import type { App } from 'vue'
import 'virtual:uno.css'

// Import components
import { ZwForm } from './components/Form'
import { Icon } from './components/Icon'
import { ZwTable } from './components/Table'
import { Editor } from './components/Editor'
import { Upload } from './components/Upload'

// Export global types
export * from './types'

// Export components
export { ZwForm, Icon as ZwIcon, ZwTable, Editor as ZwEditor, Upload as ZwUpload }

// Export component's types
// Form
export type * as ZwFormTypes from './components/Form/src/types'
export type { FormSchema as ZwFormSchema } from './components/Form/src/types'
export type { SchemaProps as ZwFormSchemaProps } from './components/Form/src/types'
export type { FormProps as ZwFormProps } from './components/Form/src/types'
export type { ImportComponent as ZwFormImportComponent } from './components/Form/src/types'

// Table
export type * as ZwTableTypes from './components/Table/src/types'
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

// Icon
export type { IconProps } from './components/Icon'

// Editor
export type {
  EditorProps as ZwEditorProps,
  EditorEmits as ZwEditorEmits,
  ToolbarKey as ZwEditorToolbarKey,
  AddToolItem as ZwEditorAddToolItem,
  AddToolItemPosition as ZwEditorAddToolItemPosition
} from './components/Editor'
export type { AiEditor } from 'aieditor'

// Upload
export type {
  UploadProps as ZwUploadProps,
  UploadFile as ZwUploadFile,
  UploadRawFile as ZwUploadRawFile,
  FileKeys as ZwUploadFileKeys,
  FileTemplate as ZwUploadFileTemplate
} from './components/Upload'

// Export constants
export { SIMPLE_TOOLBAR_KEYS, FULL_TOOLBAR_KEYS } from './components/Editor'

// Install
const install = (app: App) => {
  app.component('ZwForm', ZwForm)
  app.component('ZwTable', ZwTable)
  app.component('ZwIcon', Icon)
  app.component('ZwEditor', Editor)
  app.component('ZwUpload', Upload)
}
export default {
  install,
  version: '0.0.5'
}
