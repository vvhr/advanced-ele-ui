# 全局类型参考

这里定义了组件库使用的核心 TypeScript 类型。

## Form

### FormSchema

表单项的核心配置对象。

```typescript
export interface FormSchema {
  // 字段名
  field?: string
  // 标题
  label?: string
  // 组件类型
  component?: ComponentName
  // 默认值
  value?: any
  // 组件属性
  componentProps?: ComponentProps
  // 表单项属性 (Rules 等)
  formItemProps?: FormItemProps
  // 栅格布局属性
  layoutProps?: ColProps
  // 子组件 (用于 Group/Container)
  children?: FormSchema[]
}
```

### ComponentName

支持的组件名称字符串类型。

```typescript
export type ComponentName =
  | 'Input'
  | 'InputNumber'
  | 'Select'
  | 'Radio'
  | 'Checkbox'
  | 'Switch'
  | 'DatePicker'
  | 'TimePicker'
  | 'Upload'
  | 'Editor'
  // ...更多组件
```

### FormItemProps

对应 Element Plus 的 `el-form-item` 属性，并增加了自动化规则配置。

```typescript
export interface FormItemProps {
  // 校验规则
  rules?: FormItemRule[]
  // 自动生成的常用规则
  autoRules?: AutoRuleType[]
  // 标签宽度
  labelWidth?: string | number
  // 是否必填
  required?: boolean
  // 副标题
  subLabel?: string
}
```

## Table

### TableColumn

表格列配置对象。

```typescript
export interface TableColumn {
  // 字段名
  field?: string
  // 标题
  label?: string
  // 列类型
  type?: TableColumnType
  // 列宽
  width?: number | string
  // 固定列
  fixed?: boolean | 'left' | 'right'
  // 格式化函数
  formatter?: (row: any, column: any, cellValue: any, index: number) => any
  // 编辑组件配置
  editProps?: TableColumnEditProps
  // 类型特有配置
  typeProps?: TableColumnTypeProps
}
```

### TableColumnType

表格列的特殊类型。

```typescript
export type TableColumnType =
  | 'index'      // 序号
  | 'selection'  // 多选
  | 'expand'     // 展开
  | 'action'     // 操作列
  | 'date'       // 日期
  | 'amount'     // 金额
  | 'dict'       // 字典
  | 'sensitive'  // 脱敏
```

### TableColumnEditProps

表格列的可编辑配置。

```typescript
export interface TableColumnEditProps {
  // 编辑组件名
  component: ComponentName
  // 组件属性
  componentProps?: Recordable
  // 表单项属性
  formItemProps?: FormItemProps
}
```

### TableAction

操作列按钮配置。

```typescript
export interface TableAction {
  // 按钮文本
  label: string
  // 唯一标识
  name: string
  // 按钮类型
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
  // 图标
  icon?: string
  // 点击事件
  event?: (row: any) => void
  // 是否隐藏
  hidden?: boolean | ((row: any) => boolean)
}
```
