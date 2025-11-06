import { FormSchema } from './schema'

export type FormSchemaType = 'Step' | 'Container' | 'Decorator' | 'Custom' | 'Inputer'

/**
 * 动态取值函数
 * @description 基于某种逻辑动态取值
 * @param form - 表单数据对象
 * @param column - 当前列配置
 * @param disabled - 表单自身是否禁用
 * @param dataSource - 表单数据源上下文
 */
export type FormSchemaFn<T> = (
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  dataSource: Recordable
) => T

/**
 * 自定义组件原生事件
 * @description 当事件触发时，需要执行一些逻辑，则可以使用此属性。
 * @param event - 原始事件参数
 * @param form - 表单数据对象
 * @param column - 当前列配置
 * @param disabled - 表单自身是否禁用
 * @param dataSource - 表单数据源上下文
 */
export type ComponentEventFn<T> = (
  event: T,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  dataSource: Recordable
) => void

/**
 * 表单项属性的文本表达式
 * @description 当采用低代码架构时，FormSchema中某属性需要将函数或特殊对象以纯文本方式编写，则可以采用表达式的方式编写。
 * - 必须使用 `{{ xxx }}` 包裹函数内容，并确保有return语句！
 * - 支持的参数：
 * -- `form`: 表单数据对象
 * -- `column`: 当前列对象
 * -- `disabled`: 表单禁用状态
 * -- `dataSource`: 表单数据源上下文
 * -- `tools`: 工具对象（包含lodash/dateFn等工具函数）
 * @example
 * // 1.动态隐藏示例: 当form.status等于1时，该组件被隐藏
 * hidden: '{{ form.status === 1 }}'
 * // 2.动态标题示例: 根据数据源中的type属性值返回对应的标题
 * label: '{{ return dataSource.type === 1 ? '类型1' : '类型2' }}'
 * // 3.动态选项示例: 根据数据源中的xxlx属性值返回对应的选项
 * componentProps.options: `{{
 *  if(form.xxlx === '小学') return [{ value: '1', label: '一年级' }...{ value: '6', label: '六年级' }]
 *  if(form.xxlx === '中学') return [{ value: '7', label: '初一' }...{ value: '9', label: '初三' }]
 *  return [{ value: '10', label: '高一' }...{ value: '12', label: '高三' }]
 * }}`
 */
export type FormSchemaExpression = `{{${string}}}`

/**
 * 组件事件的文本表达式
 * @description 当采用低代码架构时，componentEvent中某事件需要用纯文本编写
 * - 必须使用 `{{ xxx }}` 包裹函数内容，无需返回值
 * - 支持的参数：
 * -- `event`: 原始事件参数
 * -- `form`: 表单数据对象
 * -- `column`: 当前列对象
 * -- `disabled`: 表单禁用状态
 * -- `dataSource`: 表单数据源上下文
 * -- `tools`: 工具对象（包含lodash/dateFn等工具函数）
 * @example
 * // 监听输入框的值被改变: 当用户名称变化时，将idCard字段置空
 * {
 *   field: 'name',
 *   component: 'Input',
 *   componentEvent: {
 *     onChange: '{{ form.idCard = '' }}'
 *   }
 * }
 */
export type ComponentEventExpression = `{{${string}}}`

/**
 * 组件布局方向
 * @default 'row'
 * @description 仅在类型为`Inputer(输入组件)`或`Custom(自定义组件)`时生效
 * - 'row' 等价于 flex-direction: row, 默认值，表示将组件与前后置组件放置在一行。
 * - 'column' 等价于 flex-direction: column, 表示将组件与前后置组件放置在一列。
 */
export type OutsidePropsDirection = 'row' | 'column'

/**
 * 组件前置插槽是否开启
 * @default false
 * @notes prependSlot优先级高于prependRender
 * @description 若需要给组件添加前置插槽，则需要设置为true，将Form组件下的<template #组件key值--out-prepend>...</template>中的内容添加到组件的前置区域.
 * @example
 * // 1. 首先在Form组件下为用户名输入框的前面添加一个查询按钮
 * <template #username-out-prepend><el-button>查询</el-button></template>
 * // 2. 将该插槽激活
 * { outsideProps.prependSlot: true }
 */
export type OutsidePropsPrependSlot = FormSchemaFn<boolean> | boolean
/**
 * 组件后置插槽是否开启
 * @default false
 * @notes appendSlot优先级高于appendRender
 * @description 若需要给组件添加后置插槽，则需要设置为true，将Form组件下的<template #组件key值--out-append>...</template>中的内容添加到组件的前置区域.
 * @example
 * // 1. 首先在Form组件下为用户名输入框的后面添加一个查询按钮
 * <template #username--out-append><el-button>查询</el-button></template>
 * // 2. 将该插槽激活
 * { outsideProps.appendSlot: true }
 */
export type OutsidePropsAppendSlot = FormSchemaFn<boolean> | boolean

/**
 * 自定义组件前置组件
 * @default false 当设置为false时不渲染
 * @description 除了可以使用插槽的方式实现前置组件，也可以使用此属性通过函数渲染前置组件
 * @example
 * {
 *  // 在Form组件下为用户名输入框的前面添加一个查询按钮
 *  outsideProps.prependRender: (form, column, disabled, dataSource) => (
 *    <el-button>查询</el-button>
 *  ),
 *  // 仅在表单可编辑时添加一个查询按钮
 *  outsideProps.prependRender: (form, column, disabled, dataSource) => (
 *    if(disabled) return false
 *    else return <el-button>查询</el-button>
 *  )
 * }
 */
export type OutsidePropsPrependRender = FormSchemaFn<VNode | false> | false

/**
 * 自定义组件后置组件
 * @default false 当设置为false时不渲染
 * @description 除了可以使用插槽的方式实现后置组件，也可以使用此属性通过函数渲染后置组件
 * @example
 * {
 *  // 在Form组件下为用户名输入框的后面添加一个查询按钮
 *  outsideProps.appendRender: (form, column, disabled, dataSource) => (
 *    <el-button>查询</el-button>
 *  ),
 *  // 仅在表单可编辑时添加一个查询按钮
 *  outsideProps.appendRender: (form, column, disabled, dataSource) => (
 *    if(disabled) return false
 *    else return <el-button>查询</el-button>
 *  )
 * }
 */
export type OutsidePropsAppendRender = FormSchemaFn<VNode | false> | false

/**
 * 激活插槽类型对象
 * @notes 同时在renders中激活同名插槽时, slots优先级高于renders
 * @description 如果你需要在Form组件内编写组件的自身插槽, 你需要将该插槽的原始名称添加到slots对象中, 并设置为true才会渲染.
 * @example
 * // 1.激活Input组件的自身插槽
 * 组件配置: { insideProps.slots.prepend: true }
 * 页面编写: <template #key--perpend={ form }>...</template>
 * // 2.根据某种条件激活Input组件的自身插槽
 * 组件配置: { insideProps.slots.append: (form, column, disabled, dataSource) => form.type === '1' }
 * 页面编写: <template #key--append={ form }>...</template>
 */
export type InsidePropsSlots = Recordable<FormSchemaFn<boolean> | boolean>

/**
 * 渲染插槽类型对象
 * @notes 同时在slots中激活同名插槽时, slots优先级高于renders
 * @description 如果你希望直接在schema配置中直接编写组件自身的插槽代码, 你需要将插槽名称添加到renders中, 并返回对应的页面代码
 * @example
 * // 1.Input组件的自身插槽 添加一个查询按钮
 * { insideProps.renders.prepend: (form, column, disabled, dataSource) => (
 *  <el-button>查询</el-button>
 * )}
 * // 2.条件判断(动态化) 仅在表单可编辑时添加一个查询按钮
 * { insideProps.renders.append: (form, column, disabled, dataSource) => (
 *   if(disabled) return undefined
 *   else return <el-button>查询</el-button>
 * )}
 * // 3.纯文本
 * { insideProps.renders.suffix: '元' }
 */
export type InsidePropsRenders = Recordable<InsidePropsRender>
export type InsidePropsRender = FormSchemaFn<VNode | string | false> | false | string