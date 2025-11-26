import type { ComponentName, ContainerName, DecoratorName, InputerName } from './components'
import type { CSSProperties, VNode } from 'vue'
import type { FormItemRule } from 'element-plus'
import type { AutoRules } from '@/types/rules'
import type {
  FormSchemaType,
  FormSchemaFn,
  OutsidePropsDirection,
  OutsidePropsAppendSlot,
  OutsidePropsAppendRender,
  OutsidePropsPrependRender,
  OutsidePropsPrependSlot,
  InsidePropsRenders,
  InsidePropsSlots
} from './schema-ext'
import type { ComponentEvent, ComponentProps, DescriptionsProps } from './schema-component'

/**
 * 表单配置项
 * @description 根据配置块的类型参阅具体的配置项说明
 * - {@link StepSchema} - 步骤块配置声明
 * - {@link ContainerSchema} - 容器块配置声明
 * - {@link DescriptionsSchema} - 仅在`desc`模式下可用，用于渲染描述组件
 * - {@link DecoratorSchema} - 装饰类组件配置声明
 * - {@link InputerSchema} - 输入类组件配置声明
 * - {@link CustomSchema} - 自定义组件配置声明
 */
export type FormSchema =
  | StepSchema
  | ContainerSchema
  | DecoratorSchema
  | InputerSchema
  | CustomSchema
  | DescriptionsSchema

/**
 * 步骤块类型声明
 * @description 步骤块可配置参数如下:
 * @properties
 * - `key`: 必传参数，标识步骤块的唯一标志。
 * - `type`: 必传参数且始终为`Step`，标识当前配置块为步骤类型。
 * - `step`: 必传参数，当前步骤数，建议从1开始。表单会根据`FormProps.step`属性过滤对应的步骤块。
 * - `children`: 必传参数，标识当前步骤内的子组件。
 * - `label`: 标题，可用于存放步骤名称。
 * - `hidden`: 是否隐藏，用于隐藏当前步骤块及步骤内所有子组件。
 */
export interface StepSchema extends FormSchemaBase {
  key: string
  type: 'Step'
  step: number
  children: FormSchema[]
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  // Step类型不需要的属性设为never
  field?: never
  value?: never
  component?: never
  render?: never
  componentProps?: never
  componentEvent?: never
  formItemProps?: never
  layoutProps?: never
  outsideProps?: never
  insideProps?: never
}

/**
 * 容器块类型声明
 * @description 容器块可配置参数如下:
 * @properties
 * - `key`: 必传参数，标识组件的唯一标志。
 * - `type`: 必传参数且始终为`Container`，标识组件为容器。
 * - `component`: {@link ContainerName} 必传参数，标识当前容器块所使用的容器组件类型。
 * - `children`: 必传参数，标识组件的子级。
 * - `label`: 标题，用于`容器组件`的标题。
 * - `hidden`: 是否隐藏，用于隐藏当前容器块及容器内所有子组件。
 * - `insideProps`: 为容器组件自身添加插槽内容
 * - `componentProps`: 为容器组件添加属性
 * - `layoutProps`: 布局属性，可设置容器外层的el-col的属性
 */
export interface ContainerSchema extends FormSchemaBase {
  key: string
  type: 'Container'
  component: ContainerName | string
  children: FormSchema[]
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  insideProps?: InsideProps
  componentProps?: ComponentProps
  layoutProps?: LayoutProps
  // Container类型不需要的属性
  field?: never
  step?: never
  value?: never
  render?: never
  componentEvent?: never
  formItemProps?: never
  outsideProps?: never
}

/**
 * 描述块类型声明
 * @description 这是一种专用于`desc`模式下的特殊容器，当处于`desc`模式下，`Container`类型的容器会自动转换为`Descriptions`容器，可配置参数如下:
 * @properties
 * - `key`: 必传参数，标识组件的唯一标志。
 * - `type`: 必传参数且始终为`Descriptions`，标识组件为描述块容器。
 * - `children`: 必传参数，标识组件的子级。
 * - `label`: 标题，用于`容器组件`的标题。
 * - `hidden`: 是否隐藏，用于隐藏当前容器块及容器内所有子组件。
 * - `insideProps`: 为容器组件自身添加插槽内容
 * - `componentProps`: {@link DescriptionsProps} 为描述组件添加属性
 * - `layoutProps`: 布局属性，可设置容器外层的el-col的属性
 */
export interface DescriptionsSchema extends FormSchemaBase {
  key: string
  type: 'Descriptions'
  children: FormSchema[]
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  insideProps?: InsideProps
  componentProps?: DescriptionsProps
  layoutProps?: LayoutProps
  // Container类型不需要的属性
  field?: never
  step?: never
  value?: never
  render?: never
  component?: never
  componentEvent?: never
  outsideProps?: never
  formItemProps?: never
}

/**
 * 装饰类组件类型声明
 * @description 装饰类组件可配置参数如下:
 * @properties
 * - `key`: 必传参数，标识组件的唯一标志。
 * - `type`: 必传参数且始终为`Decorator`，标识组件为装饰组件。
 * - `component`: {@link DecoratorName} 必传参数，标识当前所使用的装饰类组件类型。
 * - `label`: 标题，用于`装饰类组件`的标题。
 * - `hidden`: 是否隐藏，用于隐藏当前组件。
 * - `componentProps`: 为组件添加属性
 * - `componentEvent`: 为组件添加事件
 * - `layoutProps`: 布局属性，可设置组件外层的el-col的属性
 * - `outsideProps`: 为任何组件前置及后置添加自定义组件
 * - `insideProps`: 为组件自身添加插槽内容
 */
export interface DecoratorSchema extends FormSchemaBase {
  key: string
  type: 'Decorator'
  component: DecoratorName | string
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  componentProps?: ComponentProps
  componentEvent?: ComponentEvent
  layoutProps?: LayoutProps
  outsideProps?: OutsideProps
  insideProps?: InsideProps
  // Decorator类不需要的属性
  field?: never
  step?: never
  value?: never
  children?: never
  render?: never
  formItemProps?: never
}

/**
 * 输入组件类型声明
 * @description 输入组件可配置参数如下:
 * @properties
 * - `field`: 必传参数，标识组件的`v-model`绑定值，支持嵌套属性如`userinfo.username`。
 * - `component`: {@link InputerName} 必传参数，标识当前所使用的输入类组件类型。
 * - `key`: 组件唯一标识符，默认为`field`属性值，可自定义。如果两个输入组件共用同一个`field`则务必给他们设置不同的`key`。
 * - `type`: 默认为`Inputer`，标识当前配置项为输入组件。
 * - `label`: 标题，用于`输入类组件`的标题。
 * - `hidden`: 是否隐藏，用于隐藏当前组件。
 * - `value`: 默认值，用于设置组件的默认值。
 * - `componentProps`: 为组件添加属性
 * - `componentEvent`: 为组件添加事件
 * - `formItemProps`: 为组件添加表单属性
 * - `layoutProps`: 布局属性，可设置组件外层的el-col的属性
 * - `outsideProps`: 为任何组件前置及后置添加自定义组件
 * - `insideProps`: 为组件自身添加插槽内容
 */
export interface InputerSchema extends FormSchemaBase {
  field: string
  component: InputerName | string
  key?: string
  type?: 'Inputer'
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  value?: FormSchemaFn<any> | any
  componentProps?: ComponentProps
  componentEvent?: ComponentEvent
  formItemProps?: FormItemProps
  layoutProps?: LayoutProps
  outsideProps?: OutsideProps
  insideProps?: InsideProps
  // Inputer类型不需要的属性
  step?: never
  children?: never
  render?: never
}

/**
 * 自定义组件类型声明
 * @description 自定义组件可配置参数如下:
 * @properties
 * - `field`: 必传参数，标识组件的`v-model`绑定值，支持嵌套属性如`userinfo.username`。
 * - `type`: 必传参数且始终为`Custom`，标识当前配置项为自定义组件。
 * - `key`: 组件唯一标识符，默认为`field`属性值，可自定义。如果两个输入组件共用同一个`field`则务必给他们设置不同的`key`。
 * - `label`: 标题，用于`输入类组件`的标题。
 * - `hidden`: 是否隐藏，用于隐藏当前组件。
 * - `value`: 默认值，用于设置组件的默认值。
 * - `render`: 自定义渲染函数，用于自定义组件的渲染，如果通过template插槽渲染则无需使用render。
 * - `formItemProps`: 为组件添加表单属性
 * - `layoutProps`: 布局属性，可设置组件外层的el-col的属性
 */
export interface CustomSchema extends FormSchemaBase {
  field: string
  type: 'Custom'
  key?: string
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  value?: FormSchemaFn<any> | any
  render?: FormSchemaFn<VNode>
  formItemProps?: FormItemProps
  layoutProps?: LayoutProps
  // Custom类型不需要的属性
  step?: never
  component?: never
  children?: never
  componentProps?: never
  componentEvent?: never
  outsideProps?: never
  insideProps?: never
}

/**
 * 表单项配置基类
 */
export interface FormSchemaBase {
  /**
   * 组件唯一键
   * @description 标识组件的唯一标志，若未定义时默认取该组件的`field`属性值。
   * - 非输入性组件必须设置此属性且确保与其他组件不得重复
   * - 输入性组件可不设置该属性，但仅限于`field`属性值是唯一的，如果两个输入组件共用同一个`field`则务必给他们设置不同的`key`
   */
  key?: string
  /**
   * 字段名
   * @description 输入性组件的`v-model`绑定值，支持嵌套属性如`userinfo.username`
   * - 未设置`key`时,会默认使用此属性作为组件的`key`
   */
  field?: string
  /**
   * 类型
   * @default 'Inputer' - 默认为输入组件
   * @values 'Step', 'Container', 'Decorator', 'Custom', 'Inputer'
   * @description 当前Schema的类型，默认为`Inputer`
   * - `Step`: 步骤块，无FormItem包裹，表示当前对象的子级`children`都属于同一个步骤下，渲染时将根据`Form.step`属性进行显示。
   * - `Container`: 容器块，无FormItem包裹，表示当前对象是一个容器并根据`component`属性渲染具体的容器组件，其子级`children`都属于当前容器下。
   * - `Decorator`: 装饰性，无FormItem包裹，表示当前对象是一个装饰组件，比如`Divider(分割线)` / `Alert(提示)` 等，用于非输入性的组件。
   * - `Custom`: 自定义组件，有FormItem包裹，表示当前对象是一个自定义组件，根据`render`函数或Form下的`slot`渲染组件。
   * - `Inputer`: 输入组件，有FormItem包裹，表示当前对象是一个输入组件，根据`component`属性渲染具体的输入组件，会将组件的`v-model`绑定为`field`。
   */
  type?: FormSchemaType
  /**
   * 步骤数
   * @default 1
   * @description 步骤块的步骤数，建议从1开始。表单会根据`Form.step`属性进行对应的步骤块。
   * @notes 当前类型为`Step`时生效
   */
  step?: number
  /**
   * 标题
   * @description 用于`FormItem`的标题或`容器组件`的标题。
   * @remarks 若希望不显示标题，建议通过`formItemProps.noLabel`属性控制，而不要将本字符串设置为空字符串。
   * - 函数式：`label: (form, column, disabled, excontext) => '标题'`
   * - 静态：`label: '标题'`
   * - 表达式：`label: '{{ return form.status === 1 ? '标题1' : '标题2' }}'`
   */
  label?: FormSchemaFn<string> | string
  /**
   * 是否隐藏
   * @default false 默认不隐藏
   * @description 隐藏当前块或组件
   * - 函数式：`hidden: (form, column, disabled, excontext) => true`
   * - 静态：`hidden: true`
   * - 表达式：`hidden: '{{ form.status === 1 }}'`
   */
  hidden?: FormSchemaFn<boolean> | boolean
  /**
   * 组件字段初始值
   * @defualt
   * - null - 非数组型组件默认为空
   * - Array([]) - 多选/表格组件的初始值默认为空数组
   * @description 输入组件的初始值，初始化或重置表单时会根据此属性进行初始化。
   * - 函数式：`value: (form, column, disabled, excontext) => '初始值'`
   * - 静态：`value: '初始值'`
   * - 表达式：`value: '{{ return form.status === 1 ? '初始值1' : '初始值2' }}'`
   * @notes 仅对`Inputer` 或 `Custom` 类型的组件生效
   * @notes 表单组件会根据schemas数组的顺序依次初始化或重置每个组件字段的值，因此若在`函数式`或`表达式`中根据form的值取值时，请注意顺序。
   */
  value?: FormSchemaFn<any> | any
  /**
   * 子组件
   * @description 存放子组件。
   * @notes 当前类型为`Step(步骤块)`或`Container(容器块)`时生效
   * @remarks 不支持嵌套`Step(步骤块)`
   */
  children?: FormSchema[]
  /**
   * 组件
   * @default 'Input'
   * @description 组件的组件名，会根据此属性进行渲染对应的组件。
   * @notes 当前类型为`Step(步骤块)`或`Custom(自定义渲染)`时无效
   */
  component?: ComponentName
  /**
   * 自定义组件渲染
   * @description 自定义通过参数渲染组件
   * @notes 仅在类型为`Custom(自定义渲染)`时生效
   * @example render: (form, column, disabled, excontext) => <el-input vModel={form.username} />
   * @remarks 如果您希望通过插槽方式编写，则在Form组件内使用<template #{组件的key或field}={ form }>...</template>方式编写
   */
  render?: FormSchemaFn<VNode>
  /**
   * 组件属性
   * @description 组件的属性，会根据此属性进行渲染对应的组件属性。
   * @notes 当前类型为`Step(步骤块)`或`Custom(自定义组件)`时无效
   */
  componentProps?: ComponentProps
  /**
   * 组件事件
   * @description 绑定组件事件，自定义事件触发后的行为。
   * @notes 仅在类型为`Inputer(输入组件)`或`Decorator(装饰组件)`时生效
   */
  componentEvent?: ComponentEvent
  /**
   * FormItem属性
   * @description FormItem的属性，会根据此属性进行渲染对应的FormItem属性。
   * @notes 仅当前类型为`Inputer(输入组件)`或`Custom(自定义组件)`时生效
   */
  formItemProps?: FormItemProps
  /**
   * 布局属性
   * @description 所有组件都会被`el-col`包裹，此属性用于控制`el-col`的属性。
   */
  layoutProps?: LayoutProps
  /**
   * 组件外设置
   * @description 为任何组件前置及后置添加自定义组件
   * @notes 仅在类型为`Inputer(输入组件)/`Decorator(装饰组件)`时生效
   */
  outsideProps?: OutsideProps
  /**
   * 组件内设置
   * @description 为组件自身添加插槽内容
   * @notes 仅在类型为`Inputer(输入组件)`、`Container(容器组件)`、`Decorator(装饰组件)`时生效
   */
  insideProps?: InsideProps
}

/**
 * 组件外设置
 * @description 为任何组件前置及后置添加自定义组件
 * @notes 仅在类型为`Inputer(输入组件)/`Decorator(装饰组件)`时生效
 * @properties
 * - enable: {@link boolean} 默认为`false`，标志组件外容器是否开启，默认情况下FormItem会直接渲染组件, 开启此属性后, 会给组件包裹一个<div>容器用于存放前后置额外组件内容
 * - direction: {@link OutsidePropsDirection} 默认为`row`，控制组件外容器的布局方向
 * - style: {@link CSSProperties} 组件外容器样式, 当使用组件前后置插槽时，组件和前后组件都会被一个<div>容器包裹，该属性用于控制容器的样式。
 * - prependSlot: {@link OutsidePropsPrependSlot} 默认为`false`，标志组件外容器是否添加前置插槽
 * - appendSlot: {@link OutsidePropsAppendSlot} 默认为`false`，标志组件外容器是否添加后置插槽
 * - prependRender: {@link OutsidePropsPrependRender} 默认为`false`，通过函数渲染前置组件
 * - appendRender: {@link OutsidePropsAppendRender} 默认为`false`，通过函数渲染后置组件
 */
export interface OutsideProps {
  /**
   * 组件外容器是否开启
   * @default false
   * @description 默认情况下FormItem会直接渲染组件, 开启此属性后, 会给组件包裹一个<div>容器用于存放前后置额外组件内容
   */
  enable?: boolean

  direction?: OutsidePropsDirection

  /**
   * 组件外容器样式
   * 当使用组件前后置插槽时，组件和前后组件都会被一个<div>容器包裹，该属性用于控制容器的样式。
   */
  style?: CSSProperties

  prependSlot?: OutsidePropsPrependSlot

  appendSlot?: OutsidePropsAppendSlot

  prependRender?: OutsidePropsPrependRender

  appendRender?: OutsidePropsAppendRender
}

/**
 * 组件内设置
 * @description 为组件自身插槽添加内容, 提供了两种渲染方式, 一种为插槽方式，一种为函数式方式
 * @notes 仅在类型为`Inputer(输入组件)`、`Container(容器组件)`、`Decorator(装饰组件)`时生效
 * @properties
 * - slots: {@link InsidePropsSlots} 激活插槽类型对象
 * - renders: {@link InsidePropsRenders} 渲染插槽类型对象
 */
export interface InsideProps {
  slots?: InsidePropsSlots
  renders?: InsidePropsRenders
}

/**
 * FormItem属性
 * @description FormItem的属性，会根据此属性进行渲染对应的FormItem属性。
 * @notes 仅当前类型为`Inputer(输入组件)`或`Custom(自定义组件)`时生效
 */
export interface FormItemProps {
  noLabel?: FormSchemaFn<boolean> | boolean // 是否隐藏标题
  /**
   * 标题位置
   * @default 默认继承Form组件自身的labelPosition属性
   * @description 可单独设置某表单项的布局位置
   * - 'left': 表示标题在左侧居左对齐，支持`labelWidth`属性和`labelMaxWidth`属性
   * - 'right': 表示标题在右侧居右对齐，支持`labelWidth`属性和`labelMaxWidth`属性
   * - 'top': 表示标题在上方，支持副标题`subLabel`
   */
  labelPosition?: '' | 'left' | 'right' | 'top'
  /**
   * 副标题
   * @description 在主标题下显示副标题
   * @notes 仅在`labelPosition`为`top`时显示在主标题下方，其他情况时无效
   */
  subLabel?: FormSchemaFn<string> | string
  /**
   * 副标题自定义渲染
   * @default false
   * @description 使用render函数自定义副标题的内容, 返回false则不显示, 优先级高于`subLabel`
   * @notes 仅在`labelPosition`为`top`时显示在主标题下方，其他情况时无效
   */
  subLabelRender?: FormSchemaFn<VNode | false>
  /**
   * formItem组件的标题宽度
   * @default 'auto'
   * @description 可单独设置某表单项的label宽度
   * @notes 仅当`labelPosition`为`left`或`right`时生效
   */
  labelWidth?: string | number
  /**
   * formItem组件的标题最大宽度
   * @default undefined
   * @description 当某标题过长需要换行显示时，可设置最大宽度来实现换行，一般建议设置为表单labelWidth-20px
   * @notes 仅当`labelPosition`为`left`或`right`时生效
   */
  labelMaxWidth?: string | number
  required?: boolean // 是否强制显示必填星号
  /**
   * 表单校验规则
   * @description 原生el-form-item的rules属性
   * @notes 若已设置`autoRules`则`rules`不生效
   */
  rules?: FormItemRule[]
  /**
   * 内置校验规则
   * @description 使用内置的表单校验方法，快速实现`必填`/`身份证`/`手机号`等校验。
   * @notes 优先级高于`rules`
   */
  autoRules?: AutoRules[] // 使用内置校验方法
  style?: CSSProperties | string // 该表单项的样式
  /**
   * 描述项宽度
   * @default ''
   * @notes 仅在表单为`desc`类型时生效
   */
  width?: string | number
  /**
   * 描述项最小宽度
   * @default ''
   * @notes 仅在表单为`desc`类型时生效
   */
  minWidth?: string | number
  /**
   * 描述项内容布局
   * @default 'left'
   * @notes 仅在表单为`desc`类型时生效
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 描述项标题布局
   * @default undefined
   * @notes 仅在表单为`desc`类型时生效
   */
  labelAlign?: 'left' | 'center' | 'right'
}

/**
 * 布局属性
 * @description 所有组件都会被`el-col`包裹，此属性用于控制`el-col`的属性。
 * @remarks
 * - `span`: 设置包裹组件的栅格组件的占位格数，可取1-24，默认值为12
 * - `alone`: 是否单独占一行，独占一行的组件会额外被el-row包裹，这样即便span为12，组件也会占满一行
 * - `rowspan`: 仅在Form的`type`为`desc`时生效，设置组件占的行数，可取1-24，默认值为1
 * - `colStyle`: `(ver >= 0.1.6)` 自定义el-col样式
 */
export interface LayoutProps {
  span?: number
  alone?: boolean
  /**
   * 仅在Form的`type`为`desc`时生效
   */
  rowspan?: number
  /**
   * 自定义el-col样式
   * @version `0.1.6`
   */
  colStyle?: CSSProperties | string
}
