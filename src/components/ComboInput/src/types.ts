import type { ExtractPropTypes, PropType, CSSProperties } from 'vue'

/**
 * 组合模板项的标签类型
 */
export type ComboTemplateTag = 'span' | 'select' | 'input' | 'date-picker'

/**
 * ElInput 常用属性
 */
export interface InputComponentProps {
  placeholder?: string
  clearable?: boolean
  showPassword?: boolean
  maxlength?: string | number
  minlength?: string | number
  showWordLimit?: boolean
  prefixIcon?: string | object
  suffixIcon?: string | object
  rows?: number
  type?: 'text' | 'textarea' | 'password' | 'number'
  readonly?: boolean
  autofocus?: boolean
  autocomplete?: string
  validateEvent?: boolean
  inputStyle?: CSSProperties
  formatter?: (value: string | number) => string
  parser?: (value: string) => string
}

/**
 * ElSelect 常用属性
 */
export interface SelectComponentProps {
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  multiple?: boolean
  multipleLimit?: number
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  popperClass?: string
  remote?: boolean
  remoteMethod?: (query: string) => void
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  valueKey?: string
  teleported?: boolean
  persistent?: boolean
  automaticDropdown?: boolean
  fitInputWidth?: boolean
  tagType?: 'success' | 'info' | 'warning' | 'danger'
}

/**
 * ElDatePicker 常用属性
 */
export interface DatePickerComponentProps {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  clearable?: boolean
  format?: string
  valueFormat?: string
  type?: 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange'
  popperClass?: string
  rangeSeparator?: string
  defaultValue?: Date | [Date, Date]
  defaultTime?: Date | [Date, Date]
  editable?: boolean
  shortcuts?: Array<{ text: string; value: Date | (() => Date) }>
  disabledDate?: (date: Date) => boolean
  teleported?: boolean
  unlinkPanels?: boolean
}

/**
 * 组合类型：已知属性 + 任意扩展属性
 */
export type ComboComponentProps<T extends object = object> = T & Record<string, any>

/**
 * 根据 tag 类型获取对应的 componentProps 类型
 */
export type ComponentPropsMap = {
  input: ComboComponentProps<InputComponentProps>
  select: ComboComponentProps<SelectComponentProps>
  'date-picker': ComboComponentProps<DatePickerComponentProps>
  span: never
}

/**
 * 组合模板项配置
 */
export interface ComboTemplate<T extends ComboTemplateTag = ComboTemplateTag> {
  /**
   * 组件标签类型
   */
  tag: T
  /**
   * 输入性组件的自定义变量名，若未定义组件会自动生成一个如: select_1
   */
  prop?: string
  /**
   * 非输入性组件的文本内容
   */
  content?: string
  /**
   * 输入性组件的自身属性
   */
  componentProps?: T extends keyof ComponentPropsMap ? ComponentPropsMap[T] : never
}

/**
 * 内部模板模型类型
 */
export type TemplateModel = Record<string, any>

/**
 * ComboInput 组件的 Props 定义
 */
export const comboInputProps = {
  /**
   * 组合输入的完整值（字符串）
   */
  modelValue: {
    type: String,
    default: ''
  },
  /**
   * 组合模板配置（字符串模板或详细配置数组）
   */
  template: {
    type: [String, Array] as PropType<string | ComboTemplate[]>,
    required: true
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 尺寸
   */
  size: {
    type: String as PropType<'small' | 'default' | 'large'>,
    default: 'default'
  },
  /**
   * 输入防抖延迟时间（毫秒），0 表示不防抖
   */
  debounce: {
    type: Number,
    default: 0
  }
} as const

/**
 * ComboInput 组件的 Props 类型
 */
export type ComboInputProps = ExtractPropTypes<typeof comboInputProps>

/**
 * Change 事件参数类型
 */
export interface ComboInputChangeEvent {
  value: string
  params: TemplateModel
}

/**
 * ComboInput 组件的 Emits 定义
 */
export const comboInputEmits = {
  /**
   * 更新 modelValue
   * @param value 新的值
   */
  'update:modelValue': (value: string) => typeof value === 'string',
  /**
   * 值变化事件
   * @param event 包含完整值和参数的对象
   */
  change: (event: ComboInputChangeEvent) => true
}

/**
 * ComboInput 组件的 Emits 类型
 */
export type ComboInputEmits = typeof comboInputEmits
