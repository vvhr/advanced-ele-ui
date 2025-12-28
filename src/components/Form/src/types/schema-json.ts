import type { FormSchema, FormSchemaBase } from './schema'
import type { FormSchemaFn } from './schema-ext'

/**
 * 组件配置对象
 * @description 用于在 JSON 中描述组件结构，可以完全序列化
 * @example
 * {
 *   type: 'el-button',
 *   props: { type: 'primary', onClick: '{{ form.submit() }}' },
 *   children: ['查询']
 * }
 * 
 * {
 *   type: 'el-select',
 *   props: { vModel: 'form.emailDomain', style: { width: '120px' } },
 *   children: [
 *     { type: 'el-option', props: { value: '@163.com' }, children: ['@163.com'] }
 *   ]
 * }
 */
export interface ComponentConfig {
  /**
   * 组件类型，可以是：
   * - Element Plus 组件名（如 'el-button', 'el-input'）
   * - 自定义组件名（需要在 Form 组件中注册）
   * - 原生 HTML 标签名（如 'div', 'span'）
   */
  type: string
  /**
   * 组件属性
   * - 普通属性：直接设置
   * - 事件属性：使用字符串表达式 `{{ ... }}` 或函数表达式
   * - vModel 绑定：使用字符串，如 'form.fieldName'
   */
  props?: Record<string, any>
  /**
   * 组件子元素
   * - 字符串：文本内容
   * - ComponentConfig：子组件
   * - ComponentConfig[]：多个子组件
   */
  children?: string | ComponentConfig | ComponentConfig[]
  /**
   * 组件插槽（用于复杂插槽结构）
   * @example
   * {
   *   type: 'el-dialog',
   *   slots: {
   *     header: { type: 'div', children: ['标题'] },
   *     footer: { type: 'div', children: ['底部'] }
   *   }
   * }
   */
  slots?: Record<string, ComponentConfig | ComponentConfig[]>
}

/**
 * Render 属性的 JSON 表示
 * @description 支持三种方式：
 * 1. 组件配置对象：简单场景，完全可序列化
 * 2. 字符串表达式：复杂场景，使用 `{{ }}` 包裹 JSX 代码
 * 3. false：不渲染
 */
export type RenderForJson = ComponentConfig | string | false

/**
 * 组件配置对象或表达式字符串
 * @description 用于描述可能包含表达式的属性值
 */
export type ComponentConfigOrExpression = ComponentConfig | string

/**
 * FormSchema 的 JSON 序列化版本
 * @description 所有函数类型属性都转换为字符串表达式或配置对象
 */
export type FormSchemaForJson = FormSchemaForJsonBase & {
  // Step 类型
  type?: 'Step'
  step?: number
  children?: FormSchemaForJson[]
  // Container 类型
  component?: string
  // Decorator 类型
  // Inputer 类型
  field?: string
  // Custom 类型
  render?: RenderForJson
  // 通用属性
  label?: string | FormSchemaFn<string>
  hidden?: string | boolean | FormSchemaFn<boolean>
  value?: string | any | FormSchemaFn<any>
  componentProps?: Record<string, any>
  componentEvent?: Record<string, string>
  formItemProps?: FormItemPropsForJson
  layoutProps?: LayoutPropsForJson
  outsideProps?: OutsidePropsForJson
  insideProps?: InsidePropsForJson
  anchorLinkProps?: AnchorLinkPropsForJson
}

/**
 * FormSchemaForJson 的基础类型
 */
export interface FormSchemaForJsonBase {
  key?: string
  type?: 'Step' | 'Container' | 'Decorator' | 'Custom' | 'Inputer' | 'Descriptions'
  step?: number
  field?: string
  component?: string
  label?: string
  hidden?: string | boolean
  value?: string | any
  children?: FormSchemaForJson[]
  render?: RenderForJson
  componentProps?: Record<string, any>
  componentEvent?: Record<string, string>
  formItemProps?: FormItemPropsForJson
  layoutProps?: LayoutPropsForJson
  outsideProps?: OutsidePropsForJson
  insideProps?: InsidePropsForJson
  anchorLinkProps?: AnchorLinkPropsForJson
}

/**
 * FormItemProps 的 JSON 版本
 */
export interface FormItemPropsForJson {
  noLabel?: string | boolean
  labelPosition?: '' | 'left' | 'right' | 'top'
  subLabel?: string
  subLabelRender?: RenderForJson
  labelWidth?: string | number
  labelMaxWidth?: string | number
  required?: boolean
  rules?: any[]
  autoRules?: string[]
  style?: string | Record<string, any>
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
}

/**
 * LayoutProps 的 JSON 版本
 */
export interface LayoutPropsForJson {
  span?: number
  alone?: boolean
  rowspan?: number
  colStyle?: string | Record<string, any>
}

/**
 * OutsideProps 的 JSON 版本
 */
export interface OutsidePropsForJson {
  enable?: string | boolean
  direction?: 'row' | 'column'
  style?: string | Record<string, any>
  prependSlot?: string | boolean
  appendSlot?: string | boolean
  prependRender?: RenderForJson
  appendRender?: RenderForJson
}

/**
 * InsideProps 的 JSON 版本
 */
export interface InsidePropsForJson {
  slots?: Record<string, string | boolean>
  renders?: Record<string, RenderForJson>
}

/**
 * AnchorLinkProps 的 JSON 版本
 */
export interface AnchorLinkPropsForJson {
  enable?: boolean
  title?: string
  href?: string
}
