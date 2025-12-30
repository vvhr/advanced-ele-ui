# AeForm 表单

基于 JSON Schema 配置驱动的高级表单组件，支持数据驱动渲染、自动校验、布局控制等强大功能。

## 基础用法

最简单的表单使用方式。

:::demo src="../../../docs/examples/form/Basic.vue"
:::

## 组件示例

AeForm 内置支持多种常用表单组件，并允许通过 `imports` 扩展任意组件。

:::demo src="../../../docs/examples/form/Components.vue"
:::

## JSX 渲染支持

支持在 schema 配置中直接使用 JSX/TSX 渲染函数，极大增强了灵活性。

:::demo src="../../../docs/examples/form/JsxRender.vue"
:::

## API 参考

### AeForm Props

| 属性名 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| model | 表单数据对象 | `Recordable` | `{}` |
| schemas | 表单配置项数组 | `FormSchema[]` | `[]` |
| disabled | 全局禁用 | `boolean` | `false` |
| type | 表单模式 | `'form' \| 'desc'` | `'form'` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| imports | 按需加载外部组件 | `FormImportItem[]` | `[]` |
| autoInitField | 是否自动初始化字段 | `boolean` | `true` |

### FormSchema 配置

`FormSchema` 是构建表单的核心配置对象。

| 属性名 | 说明 | 类型 |
|---|---|---|
| field | 绑定的字段名 | `string` |
| label | 标签文本 | `string` |
| component | 组件类型 | `string` |
| value | 默认值 | `any` |
| componentProps | 组件属性 (props) | `Recordable` |
| formItemProps | FormItem 属性 (rules等) | `FormItemProps` |
| layoutProps | 栅格布局属性 (span等) | `ColProps` |

### Expose Methods

| 方法名 | 说明 | 参数 |
|---|---|---|
| validate | 执行表单校验 | `() => Promise<boolean>` |
| resetValidate | 重置校验状态 | - |
| getFormModel | 获取表单数据 | `() => Recordable` |
| clearValues | 清空表单值 | - |
| setValues | 设置表单值 | `(values: Recordable) => void` |
