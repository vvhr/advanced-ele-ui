# AeTable 表格

基于 Element Plus Table 的高级封装，支持配置化生成表格，内置分页、可编辑、敏感脱敏、字典翻译等强大功能。

## 基础用法

:::demo
```vue
<template>
  <AeTable
    v-model="data"
    :columns="columns"
    :pagination="pagination"
    @page-change="onPageChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const data = ref([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 }
])

const columns = [
  { type: 'index', label: '序号', width: 60 },
  { field: 'name', label: '姓名' },
  { field: 'age', label: '年龄' }
]

const pagination = reactive({
  total: 2,
  page: 1,
  pageSize: 10
})

const onPageChange = ({ page, pageSize }) => {
  console.log('Page changed:', page, pageSize)
}
</script>
```
:::

## 可编辑模式

支持行内编辑，通过 `editable` 属性开启全局编辑模式，或通过 `column.editProps` 配置列的编辑组件。

以下展示 5 种不同类型的编辑组件示例。

:::demo
```vue
<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button @click="editable = !editable">
        {{ editable ? '退出编辑' : '进入编辑' }}
      </el-button>
      <el-button type="primary" @click="onSubmit">获取数据</el-button>
    </div>
    <AeTable
      ref="tableRef"
      v-model="data"
      :columns="columns"
      :editable="editable"
      border
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const editable = ref(true)
const tableRef = ref()

const data = ref([
  {
    input: '示例文本',
    number: 10,
    select: '1',
    radio: '1',
    checkbox: ['html']
  }
])

const columns = [
  {
    field: 'input',
    label: 'Input 输入框',
    editProps: {
      component: 'Input',
      formItemProps: { rules: [{ required: true, message: '必填' }] }
    }
  },
  {
    field: 'number',
    label: 'InputNumber',
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0, max: 100 }
    }
  },
  {
    field: 'select',
    label: 'Select 选择',
    editProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '选项A', value: '1' },
          { label: '选项B', value: '2' }
        ]
      }
    }
  },
  {
    field: 'radio',
    label: 'Radio 单选',
    editProps: {
      component: 'Radio',
      componentProps: {
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      }
    }
  },
  {
    field: 'checkbox',
    label: 'Checkbox 多选',
    width: 200,
    editProps: {
      component: 'Checkbox',
      componentProps: {
        options: [
          { label: 'HTML', value: 'html' },
          { label: 'CSS', value: 'css' }
        ]
      }
    }
  }
]

const onSubmit = async () => {
  if (await tableRef.value.validate()) {
    ElMessage.success('校验通过')
    console.log(data.value)
  }
}
</script>
```
:::

## 常规模式特性展示

展示 AeTable 的核心配置特性，包括金额、日期、脱敏、字典翻译和操作列。

:::demo
```vue
<template>
  <AeTable
    v-model="data"
    :columns="columns"
    border
    stripe
    :show-summary="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const data = ref([
  {
    name: '张三',
    amount: 1234567.89,
    phone: '13812345678',
    status: '1',
    date: '2025-01-01 12:00:00'
  },
  {
    name: '李四',
    amount: 98765.43,
    phone: '13987654321',
    status: '0',
    date: '2025-02-15 09:30:00'
  }
])

const columns = [
  { type: 'index', label: '#', width: 50, fixed: 'left' },
  { field: 'name', label: '姓名 (固定列)', width: 120, fixed: 'left' },
  {
    field: 'amount',
    label: '金额 (千分位)',
    type: 'amount',
    minWidth: 150,
    summable: true, // 开启合计
    typeProps: {
      amountThousand: true,
      amountUnit: '¥',
      amountUnitPosition: 'left'
    }
  },
  {
    field: 'phone',
    label: '手机号 (脱敏)',
    minWidth: 140,
    type: 'sensitive',
    typeProps: {
      sensitiveType: 'phone',
      sensitiveHover: true // 悬浮显示明文
    }
  },
  {
    field: 'status',
    label: '状态 (字典Tag)',
    type: 'dict',
    typeProps: {
      dictViewType: 'tag',
      dictOptions: [
        { label: '启用', value: '1', type: 'success' },
        { label: '禁用', value: '0', type: 'danger' }
      ]
    }
  },
  {
    field: 'date',
    label: '日期格式化',
    type: 'date',
    minWidth: 160,
    typeProps: {
      dateFormat: 'YYYY年MM月DD日'
    }
  },
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 180,
    fixed: 'right',
    typeProps: {
      actions: [
        {
          label: '编辑',
          name: 'edit',
          type: 'primary',
          event: (row) => ElMessage.success(`编辑: ${row.name}`)
        },
        {
          label: '删除',
          name: 'delete',
          type: '', // 默认样式
          event: (row) => ElMessage.warning(`删除: ${row.name}`)
        }
      ]
    }
  }
]
</script>
```
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

