import { ElForm } from 'element-plus'
import type { Slots } from 'vue'
import type { FormSchema } from './schema'

/**
 * 表单插槽规范
 * @description 目前支持自定义FormItem的label插槽以及自定义组件插槽
 * @param key 组件插槽名称取自组件配置的key属性（未配置key属性时取自field属性），若key中包含.会自动转换为-，因此使用插槽时需要注意
 */
export interface FormSlots extends Slots {
  // 自定义组件插槽命名方式 ${key}={ form }
  [key: string]: (form: Recordable) => any
  /**
   * 自定义表单项标题插槽
   * @description 该插槽对应FormItem组件的label插槽
   * 文档: https://cn.element-plus.org/zh-CN/component/form#formitem-slots
   */
  [key: `${string}--label`]: () => any
  /**
   * 自定义表单项错误内容插槽
   * @description 该插槽对应FormItem组件的error插槽
   * 文档: https://cn.element-plus.org/zh-CN/component/form#formitem-slots
   */
  [key: `${string}--error`]: () => any

  /**
   * 自定义组件自身插槽
   * @description 该插槽对应组件自身插槽，支持作用域插槽参数
   * 例如: Input组件的prefix/suffix/append/prepend插槽
   * @param data - 插槽数据，包含 form 属性和可能的作用域插槽参数
   */
  [key: `${string}--${string}`]: (data: { form: Recordable; [key: string]: any }) => any

  /**
   * 自定义组件前置插槽
   * @description 为了更通用，支持给任何组件的前置直接插入自定义组件
   * 例如：在Table组件插入一个添加按钮
   * @param form - 表单数据对象
   */
  [key: `${string}--out-prepend`]: (form: Recordable) => any

  /**
   * 自定义组件后置插槽
   * @description 为了更通用，支持给任何组件的后置直接插入自定义组件
   * 例如：在Input组件后面插入一个查询按钮，注意不是在Input输入框内部，而是在后面
   * @param form - 表单数据对象
   */
  [key: `${string}--out-append`]: (form: Recordable) => any

  /**
   * 自定义设计模式组件容器插槽
   * @description 设计模式中通常需要为组件容器添加一些操作栏, 可使用本插槽来自定义
   */
  design?: (column: FormSchema) => any
}

export interface FormEmits {
  (e: 'register', elFormRef: ComponentRef<typeof ElForm>): void
  (e: 'update:stepValue', stepValue: number | null): void
  (e: 'init', form: Recordable): void
  (e: 'change', data: { value: any; field: string; oldValue: any }): void
  (e: 'update:model', model: Recordable): void
}

/**
 * 全局表单项默认配置
 * @description 为所有表单项添加默认配置，以避免重复劳动
 * @remarks
 * - `layoutProps`: 布局属性({@link FspLayoutProps})
 * - `formItemProps`: 表单项属性({@link FspLayoutFormItemProps})
 * - `componentProps`: 组件属性({@link FspComponentProps})
 * - `descriptionsProps`: 描述块属性({@link FspDescriptionsProps})
 * - `descriptionsItemProps`: 描述列属性({@link FspDescriptionsItemProps})
 */
export interface FormSchemaProps {
  layoutProps?: FspLayoutProps
  formItemProps?: FspLayoutFormItemProps
  componentProps?: FspComponentProps
  descriptionsProps?: FspDescriptionsProps
  descriptionsItemProps?: FspDescriptionsItemProps
}

/**
 * 全局表单项默认配置 - 布局属性
 * @description 为所有表单项添加默认布局属性，以避免重复劳动
 * @remarks
 * - `span`: default: `12`(form) / `1`(desc), 栅格占位格数
 * - `alone`: default: `false`, 是否独占一行
 */
interface FspLayoutProps {
  span?: number
  alone?: boolean
}

/**
 * 全局表单项默认配置 - 表单项属性
 * @description 为所有表单项添加默认表单项属性，以避免重复劳动
 * @remarks
 * - `noLabel`: default: `false`, 所有组件的label不可见
 * - `labelPosition`: default: `right`, 设置所有表单组件的label布局方向
 * - `align`: default: `left`, 描述列的内容对齐方式
 * - `labelAlign`: default: `left`, 设置所有描述列标题对齐方式
 */
interface FspLayoutFormItemProps {
  noLabel?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  align?: 'left' | 'right' | 'top'
  labelAlign?: 'left' | 'center' | 'right'
}

/**
 * 全局表单项默认配置 - 组件属性
 * @description 为所有表单项添加默认组件属性，以避免重复劳动
 * @remarks
 * - `disabled`: default: `false`, 是否自动给所有组件添加disabled属性
 * - `clearable`: default: `true`, 是否自动给所有组件添加clearable属性
 * - `autoPlaceholder`: default: `true`, 是否自动根据组件标题和组件类型生成占位文本
 * - `setPlaceholderInDisabled`: 统一设置表单全局禁用时所有占位文本
 */
interface FspComponentProps {
  disabled?: boolean
  clearable?: boolean
  autoPlaceholder?: boolean
  setPlaceholderInDisabled?: string
}

/**
 * 全局表单项默认配置 - 描述块属性
 * @description 为所有表单项的描述块添加默认属性，以避免重复劳动
 * @remarks
 * - `column`: 默认: `3`, 列数
 * - `direction`: 默认: `'horizontal'`, 排列方向
 * - `border`: 默认: `true`, 是否显示边框
 */
interface FspDescriptionsProps {
  column?: number
  direction?: 'vertical' | 'horizontal'
  border?: boolean
}

/**
 * 全局表单项默认配置 - 描述列属性
 * @description 为所有表单项的描述列添加默认属性，以避免重复劳动
 */
interface FspDescriptionsItemProps {
  span?: number
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  labelWidth?: string | number
}

export interface DesignableDirectives {
  baseRow: Recordable
  containerRow: Recordable
}

export type DesignableColProps = (key: string, column: FormSchema, isHidden: boolean) => Recordable
