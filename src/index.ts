import type { App } from 'vue'
import 'virtual:uno.css'

// Import components
import { Form } from './components/Form'
import { Icon } from './components/Icon'
import { Table } from './components/Table'
import { Editor } from './components/Editor'
import { Upload } from './components/Upload'
import { Dialog } from './components/Dialog'

// Export global types
export * from './types'

// Export components
export {
  Form as AeForm,
  Icon as AeIcon,
  Table as AeTable,
  Editor as AeEditor,
  Upload as AeUpload,
  Dialog as AeDialog
}

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

// Dialog
export type { AeDialogProps, AeDialogEmits } from './components/Dialog'

// Rules
export type { AutoRules } from './types/rules'
export { getAutoRulesMap } from './utils/rules'

// Dict
export type { DictMap, DictItem } from './types/dict'
export { useDict } from './utils/dict'

// Format
export { formatAmount, formatDate, formatSensitive } from './utils/format'

// Tree
export { findNode, findNodes } from './utils/tree'

// Locale (国际化)
export type { Language, LocaleConfig, DeepPartial } from './locale/types'
export { locale, setLocale, getCurrentLocale, setCustomLocale, supportedLocales } from './locale'
export { default as zhCN } from './locale/lang/zh-CN'
export { default as enUS } from './locale/lang/en-US'

// Install options
import { setLocale, setCustomLocale } from './locale'
import type { Language, LocaleConfig, DeepPartial } from './locale/types'

export interface InstallOptions {
  /**
   * 设置默认语言
   * @default 'zh-CN'
   */
  locale?: Language
  /**
   * 自定义语言包（会与默认语言包深度合并）
   */
  customLocale?: Partial<Record<Language, DeepPartial<LocaleConfig>>>
}

// Install
const install = (app: App, options?: InstallOptions) => {
  // 注册组件
  app.component('AeForm', Form)
  app.component('AeTable', Table)
  app.component('AeIcon', Icon)
  app.component('AeEditor', Editor)
  app.component('AeUpload', Upload)
  app.component('AeDialog', Dialog)

  // 设置语言
  if (options?.locale) {
    setLocale(options.locale)
  }

  // 设置自定义语言包
  if (options?.customLocale) {
    Object.entries(options.customLocale).forEach(([locale, config]) => {
      setCustomLocale(locale as Language, config)
    })
  }
}

export default {
  install,
  version: '0.0.9-beta'
}
