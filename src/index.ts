import type { App } from 'vue'
import 'virtual:uno.css'

// Import components
import { AeForm } from './components/Form'
import { AeIcon } from './components/Icon'
import { AeTable } from './components/Table'
import { AeEditor } from './components/Editor'
import { AeUpload } from './components/Upload'
import { AeDialog } from './components/Dialog'
import { AeDrawer } from './components/Drawer'
import { AeTabs, AeTabPane } from './components/Tabs'
import { AeText } from './components/Text'
import { AeComboInput } from './components/ComboInput'

// Import version info
import { VERSION_INFO, getVersionInfo, printVersionInfo } from './version'

// Import
import type {
  FormImportItem,
  FormImportItemConfig,
  TableFormImportItem,
  TableFormImportItemConfig
} from './types/imports'

// Export global types
export * from './types'

export type { FormImportItem, FormImportItemConfig, TableFormImportItem, TableFormImportItemConfig }
// Export components
export { AeForm, AeIcon, AeTable, AeEditor, AeUpload, AeDialog, AeDrawer, AeTabs, AeTabPane, AeText, AeComboInput }

// Export version info
export { VERSION_INFO, getVersionInfo, printVersionInfo }

// Export component's types
// Form
export type {
  FormDefineProps,
  FormInstance,
  FormExpose,
  FormItemProps,
  ComponentName,
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
  FormSchemaDomFn,
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
  TableFormAutoRules
} from './components/Table'

// Icon
export type { IconProps, IconData, IconCollection } from './components/Icon'
export { addIcon, addIconCollection, addIconCollections } from './components/Icon'

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
export type { DialogProps, DialogEmits, DialogInstance, DialogSlots } from './components/Dialog'
// Drawer
export type { DrawerProps, DrawerEmits, DrawerInstance, DrawerSlots } from './components/Drawer'
// Tabs
export type {
  TabsProps,
  TabPaneProps,
  TabsInstance,
  TabPaneInstance,
  TabsEmits
} from './components/Tabs'

// Text
export type { TextProps, TextEmits, DotType } from './components/Text'

// ComboInput
export type { ComboInputProps, ComboInputEmits, ComboTemplate } from './components/ComboInput'

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
import { globalFormImports, globalTableImports } from './utils/imports'
import { addIconCollections } from './utils/icon'
import type { IconCollection } from './utils/icon'

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
  /**
   * 注册表单自定义组件
   */
  formImports?: FormImportItem[]
  /**
   * 注册表格自定义编辑组件
   */
  tableImports?: TableFormImportItem[]
  /**
   * 注册自定义图标集
   * @example
   * ```ts
   * app.use(AdvancedEleUI, {
   *   iconCollections: [{
   *     prefix: 'my-icons',
   *     width: 24,
   *     height: 24,
   *     icons: {
   *       'home': { body: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' }
   *     }
   *   }]
   * })
   * ```
   */
  iconCollections?: IconCollection[]
}

// Install
const install = (app: App, options?: InstallOptions) => {
  // 注册组件（所有组件都有 install 方法）
  const components = [
    AeForm,
    AeIcon,
    AeTable,
    AeEditor,
    AeUpload,
    AeDialog,
    AeDrawer,
    AeTabs,
    AeTabPane,
    AeText,
    AeComboInput
  ]
  components.forEach(component => {
    app.use(component)
  })

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

  // 注册表单自定义组件
  if (options?.formImports) {
    globalFormImports.registerComponents(options.formImports)
  }

  // 注册表格自定义编辑组件
  if (options?.tableImports) {
    globalTableImports.registerComponents(options.tableImports)
  }

  // 注册自定义图标集
  if (options?.iconCollections) {
    addIconCollections(options.iconCollections)
  }
}

export default {
  install,
  version: VERSION_INFO.version,
  buildVersion: VERSION_INFO.buildVersion,
  versionInfo: VERSION_INFO
}
