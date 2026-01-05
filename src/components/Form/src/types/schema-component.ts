import type { ComponentEventFn, FormSchemaFn } from './schema-ext'
import type { CSSProperties } from 'vue'

/**
 * 动态属性值
 * @description 任何组件的ComponentProps属性都可以使用_v_前缀修饰，便可以使用函数来动态计算
 * @notes 同名属性存在时，本属性优先级高于原属性，例如：`_v_disabled` 将覆盖 `disabled`
 * @example
 * // 动态设置Input组件的type值
 * {
 *   component: 'Input',
 *   componentProps: {
 *     v_type: (form, column, disabled, excontext) => {
 *        return form.type === '1' ? 'text' : 'textarea'
 *     }
 *   }
 * }
 */
export type AnyComponentProps = {
  [K in `_v_${string}`]?: FormSchemaFn<any>
}

export interface ComponentProps extends AnyComponentProps {
  /**
   * 组件强制刷新标志
   * @default 0
   * @description 需要重绘组件时将其值进行更新
   */
  freshKey?: string | number
  /**
   * 是否禁用组件
   * @default false
   * @description 组件是否禁用首先受控于`FormProps.disabled`属性,其次是组件内部定义的`disabled`属性
   */
  disabled?: FormSchemaFn<boolean> | boolean
  /**
   * 显示清空按钮
   * @default false
   * @description 当为true时，会显示清空按钮点击后触发onClear事件
   */
  clearable?: boolean
  /**
   * 选项
   * @description 适用于`Select`,`Radio`,`Checkbox`,`Cascader`等组件渲染选项
   */
  options?: any[] | FormSchemaFn<any[]>
  /**
   * 自定义选项字段
   * @description 自定义`label`,`value`,`children`等字段名
   */
  optionKeys?: OptionKeys
  // 组件上的style属性
  style?: CSSProperties | string
  /**
   * 占位符
   * @default 默认根据组件类型及组件标题生成
   * @description 适用于`Select` `Input` 等组件
   */
  placeholder?: string
  /**
   * 其他需要双向绑定的属性
   * @description
   * 如果组件自身支持多个`双向绑定属性`，且你需要调用除 `modelValue` 以外的`双向绑定属性`则在此定义。
   * `键`为组件的`属性名`，`值`为 formModel 中的`字段名`。
   * 需要注意的是, `Form`的`autoInitFields`功能并不会自动为这些属性进行初始化，建议你自行初始化。
   * @notes 仅对 `Inputer` 类型的组件有效，且当前`FormSchema`中必须已设置`field`。
   * @experimental 此功能为实验性功能，API 可能会变更
   * @since 0.1.6-beta.0
   * @example
   * {
   *   // v-model:fileList = formModel.attachments
   *   fileList: 'attachments'
   *   // v-model:bizNo = formModel.businessId
   *   bizNo: 'businessId'
   * }
   */
  vBinds?: Recordable<string, string>
  // 其他组件自身属性
  [key: string]: any
}

export interface ComponentEvent {
  /**
   * 值发生变化时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onChange?: ComponentEventFn<[any]>
  /**
   * 在点击由 `clearable` 属性生成的清空按钮时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onClear?: ComponentEventFn<[void]>
  /**
   * 输入框失去焦点时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onBlur?: ComponentEventFn<[FocusEvent]>
  /**
   * 输入框获得焦点时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onFocus?: ComponentEventFn<[FocusEvent]>
  // 其他事件，以element plus的组件文档中的事件为准
  [key: string]: ComponentEventFn<any[]>
}
export type OptionKeys = {
  label?: string // 自定义标题字段名
  value?: string // 自定义取值字段名
  children?: string // 自定义子级字段名
  disabled?: string // 自定义禁用字段名
}

export interface DescriptionsProps extends AnyComponentProps {
  /**
   * 是否显示边框
   * @default true
   */
  border?: boolean
  /**
   * 列数
   * @default 3
   */
  column?: number
  /**
   * 排列方向
   * @default horizontal
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * 组件尺寸
   * @default 'default' 未设置时，继承Form组件的size属性
   */
  size?: '' | 'large' | 'default' | 'small'
  /**
   * 标题
   * @default 为空时将使用label作为标题
   */
  title?: string
  /**
   * 标题宽度
   * @default ''
   */
  labelWidth?: string | number
  /**
   * 额外信息
   * @default ''
   * @description 也可通过插槽自定义
   */
  extra?: string
  // 其他组件自身属性
  [key: string]: any
}
