# 工具函数

AeForm 和 AeTable 内部使用的核心格式化函数，也可单独导入使用。

## formatAmount

格式化金额，支持千分位、小数位控制、单位添加。

```typescript
import { formatAmount } from 'advanced-ele-ui'

const result = formatAmount(12345.67, {
  amountThousand: true,
  amountUnit: '¥'
})
// 输出: "¥12,345.67"
```

### 参数

| 参数名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| value | `number \| string` | - | 需要格式化的数值 |
| config | `AmountConfig` | `{}` | 配置对象 |

### AmountConfig

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| amountThousand | `boolean` | `true` | 是否显示千分位 |
| amountDecimal | `boolean` | `true` | 是否显示小数位 |
| amountDigits | `number` | `2` | 小数位数 |
| amountUnit | `string` | `''` | 金额单位 |
| amountUnitPosition | `'left' \| 'right'` | `'left'` | 单位位置 |
| defaultValue | `string` | `'0'` | 无效值时的默认显示 |

## formatDate

基于 Dayjs 的日期格式化函数。

```typescript
import { formatDate } from 'advanced-ele-ui'

formatDate(new Date(), 'YYYY-MM-DD')
```

### 参数

| 参数名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| value | `Date \| string \| number` | - | 日期对象或时间戳 |
| formatString | `string` | `'YYYY-MM-DD'` | 格式化模板 |

## formatSensitive

敏感数据脱敏工具。

```typescript
import { formatSensitive } from 'advanced-ele-ui'

// 手机号脱敏
formatSensitive('13812345678', /(\d{3})\d{4}(\d{4})/, '$1****$2')
```

### 参数

| 参数名 | 类型 | 说明 |
|---|---|---|
| value | `string` | 原始字符串 |
| searchRegex | `RegExp \| string` | 匹配正则 |
| replacement | `string` | 替换内容 |
