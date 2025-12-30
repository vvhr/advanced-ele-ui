# AeTable 表格

基于 Element Plus Table 的高级封装，支持配置化生成表格，内置分页、可编辑、敏感脱敏、字典翻译等强大功能。

## 基础用法

:::demo src="../../../docs/examples/table/Basic.vue"
:::

## 可编辑模式

支持行内编辑，通过 `editable` 属性开启全局编辑模式，或通过 `column.editProps` 配置列的编辑组件。

:::demo src="../../../docs/examples/table/Editable.vue"
:::

## 常规模式特性展示

展示 AeTable 的核心配置特性，包括金额、日期、脱敏、字典翻译和操作列。

:::demo src="../../../docs/examples/table/Feature.vue"
:::

## API 参考

### Table Props

| 属性名 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| modelValue | 表格数据 | `Recordable[]` | `[]` |
| columns | 列配置 | `TableColumn[]` | `[]` |
| editable | 是否开启可编辑 | `boolean` | `false` |
| pagination | 分页配置 | `Pagination` | `undefined` |
| showSummary | 显示合计行 | `boolean` | `false` |
| loading | 加载状态 | `boolean` | `false` |
| rowKey | 行主键 | `string` | `'id'` |

### TableColumn 配置

| 属性名 | 说明 | 类型 |
|---|---|---|
| field | 字段名 | `string` |
| label | 标题 | `string` |
| type | 列类型 | `index` \| `selection` \| `action` \| `date` \| `amount` \| `sensitive` \| `dict` |
| width | 宽度 | `number` \| `string` |
| fixed | 固定列 | `true` \| `'left'` \| `'right'` |
| editProps | 编辑组件配置 | `TableColumnEditProps` |
| typeProps | 类型特有属性 | `TableColumnTypeProps` |

### Column Type Props

- **amount**: `amountThousand` (千分位), `amountUnit` (单位)
- **sensitive**: `sensitiveType` ('phone', 'idCard', 'email'), `sensitiveHover` (悬浮显示)
- **dict**: `dictOptions` (选项), `dictViewType` ('tag', 'text', 'dot-tag')
- **date**: `dateFormat` (格式化字符串)
