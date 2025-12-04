import type { VNode } from 'vue'
import { FormSchema } from './schema'

export type FormSchemaType =
  | 'Step'
  | 'Container'
  | 'Decorator'
  | 'Custom'
  | 'Inputer'
  | 'Descriptions'

/**
 * 动态取值函数
 * @description 基于某种逻辑动态取值
 * @param form - 表单数据对象
 * @param column - 当前列配置
 * @param disabled - 表单自身是否禁用
 * @param excontext - 表单数据源上下文
 */
export type FormSchemaFn<T> = (
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => T

/**
 * 自定义组件原生事件
 * @description 当事件触发时，需要执行一些逻辑，则可以使用此属性。
 * @param event - 原始事件参数
 * @param form - 表单数据对象
 * @param column - 当前列配置
 * @param disabled - 表单自身是否禁用
 * @param excontext - 表单数据源上下文
 */
export type ComponentEventFn<T> = (
  event: T,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => void

/**
 * 动态取VNode函数
 * @description 基于某种逻辑动态取值
 * @param form - 表单数据对象
 * @param column - 当前列配置
 * @param disabled - 表单自身是否禁用
 * @param excontext - 表单数据源上下文
 * @param domCreator - 可通过config构建dom内容
 */
export type FormSchemaDomFn<T> = (
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable,
  domCreator: DomCreator
) => T

export type DomCreator = (
  config: any,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => VNode | undefined

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
 *  outsideProps.prependRender: (form, column, disabled, excontext) => (
 *    <el-button>查询</el-button>
 *  ),
 *  // 仅在表单可编辑时添加一个查询按钮
 *  outsideProps.prependRender: (form, column, disabled, excontext) => (
 *    if(disabled) return false
 *    else return <el-button>查询</el-button>
 *  )
 * }
 */
export type OutsidePropsPrependRender = FormSchemaDomFn<VNode | false> | false

/**
 * 自定义组件后置组件
 * @default false 当设置为false时不渲染
 * @description 除了可以使用插槽的方式实现后置组件，也可以使用此属性通过函数渲染后置组件
 * @example
 * {
 *  // 在Form组件下为用户名输入框的后面添加一个查询按钮
 *  outsideProps.appendRender: (form, column, disabled, excontext) => (
 *    <el-button>查询</el-button>
 *  ),
 *  // 仅在表单可编辑时添加一个查询按钮
 *  outsideProps.appendRender: (form, column, disabled, excontext) => (
 *    if(disabled) return false
 *    else return <el-button>查询</el-button>
 *  )
 * }
 */
export type OutsidePropsAppendRender = FormSchemaDomFn<VNode | false> | false

/**
 * 激活插槽类型对象
 * @notes 同时在renders中激活同名插槽时, slots优先级高于renders
 * @description 如果你需要在Form组件内编写组件的自身插槽, 你需要将该插槽的原始名称添加到slots对象中, 并设置为true才会渲染.
 * @example
 * // 1.激活Input组件的自身插槽
 * 组件配置: { insideProps.slots.prepend: true }
 * 页面编写: <template #key--perpend={ form }>...</template>
 * // 2.根据某种条件激活Input组件的自身插槽
 * 组件配置: { insideProps.slots.append: (form, column, disabled, excontext) => form.type === '1' }
 * 页面编写: <template #key--append={ form }>...</template>
 */
export type InsidePropsSlots = Recordable<FormSchemaFn<boolean> | boolean>

/**
 * 渲染插槽类型对象
 * @notes 同时在slots中激活同名插槽时, slots优先级高于renders
 * @description 如果你希望直接在schema配置中直接编写组件自身的插槽代码, 你需要将插槽名称添加到renders中, 并返回对应的页面代码
 * @example
 * // 1.Input组件的自身插槽 添加一个查询按钮
 * { insideProps.renders.prepend: (form, column, disabled, excontext) => (
 *  <el-button>查询</el-button>
 * )}
 * // 2.条件判断(动态化) 仅在表单可编辑时添加一个查询按钮
 * { insideProps.renders.append: (form, column, disabled, excontext) => (
 *   if(disabled) return undefined
 *   else return <el-button>查询</el-button>
 * )}
 * // 3.纯文本
 * { insideProps.renders.suffix: '元' }
 */
export type InsidePropsRenders = Recordable<InsidePropsRender>
export type InsidePropsRender = FormSchemaDomFn<VNode | string | false> | false | string
