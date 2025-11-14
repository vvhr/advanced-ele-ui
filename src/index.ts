import type { App } from 'vue'
import 'virtual:uno.css'

// Import components
import { Form } from './components/Form'
import { Icon } from './components/Icon'
import { Table } from './components/Table'
import { Editor } from './components/Editor'
import { Upload } from './components/Upload'

// Export global types
export * from './types'

// Export components
export { Form as AeForm, Icon as AeIcon, Table as AeTable, Editor as AeEditor, Upload as AeUpload }

// Export component's types
// Form
export type {
  FormDefineProps,
  FormInstance,
  ComponentName,
  FormImportItem,
  FormImportItemConfig,
  FormSchema,
  FormSlots,
  FormEmits,
  FormSchemaProps,
  FormSchemaBase,
  StepSchema,
  ContainerSchema,
  DecoratorSchema,
  InputerSchema,
  CustomSchema,
  ComponentProps,
  ComponentEvent,
  OptionKeys,
  FormSchemaType,
  FormSchemaFn,
  ComponentEventFn,
  OutsidePropsDirection,
  OutsidePropsPrependSlot,
  OutsidePropsAppendSlot,
  OutsidePropsPrependRender,
  OutsidePropsAppendRender,
  InsidePropsSlots,
  InsidePropsRenders,
  InsidePropsRender
} from './components/Form'

// Table
export type {
  TableDefineProps,
  TableInstance,
  TableSlots,
  TableEmits,
  TableProps,
  TableExpose,
  TablePagination,
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
  TableFormAutoRules,
  TableFormImportItemConfig,
  TableFormImportItem
} from './components/Table'

// Icon
export type { IconProps } from './components/Icon'

// Editor
export type {
  EditorDefineProps,
  EditorInstance,
  EditorProps,
  EditorEmits,
  ToolbarKey,
  AddToolItem,
  AddToolItemPosition
} from './components/Editor'
export type { AiEditor } from 'aieditor'
export { SIMPLE_TOOLBAR_KEYS, FULL_TOOLBAR_KEYS } from './components/Editor'

// Upload
export type {
  UploadDefineProps,
  UploadInstance,
  UploadProps,
  UploadEmits,
  UploadFile,
  UploadRawFile,
  FileKeys,
  FileTemplate
} from './components/Upload'

// Rules
export type { AutoRules } from './types/rules'
export { AUTO_RULES_MAP } from './utils/rules'

// Dict
export type { DictMap, DictItem } from './types/dict'
export { useDict } from './utils/dict'

// Format
export { formatAmount, formatDate, formatSensitive } from './utils/format'

// Tree
export { findNode, findNodes } from './utils/tree'

// Install
const install = (app: App) => {
  app.component('AeForm', Form)
  app.component('AeTable', Table)
  app.component('AeIcon', Icon)
  app.component('AeEditor', Editor)
  app.component('AeUpload', Upload)
}
export default {
  install,
  version: '0.0.5'
}
