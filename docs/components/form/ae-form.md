# AeForm 表单

基于 JSON Schema 配置驱动的高级表单组件，支持数据驱动渲染、自动校验、布局控制等强大功能。

## 基础用法

最简单的表单使用方式。

:::demo
```vue
<template>
  <AeForm
    ref="aeFormRef"
    :model="formModel"
    :schemas="schemas"
  />
  <el-button type="primary" @click="onSubmit">提交</el-button>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formModel = ref({
  username: '',
  password: ''
})

const schemas = reactive([
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
    componentProps: {
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      autoRules: ['isRequired']
    }
  }
])

const aeFormRef = ref()

const onSubmit = async () => {
  if (await aeFormRef.value.validate()) {
    ElMessage.success('校验通过')
    console.log(aeFormRef.value.getFormModel())
  }
}
</script>
```
:::

## 组件示例

AeForm 内置支持多种常用表单组件，并允许通过 `imports` 扩展任意组件。以下展示 10 种常见类型的组件配置。

### 1. Input 输入框

支持文本、文本域、密码等多种类型。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  text: '默认文本',
  textarea: '',
  long: ''
})

const schemas = [
  {
    field: 'text',
    label: '普通文本',
    component: 'Input'
  },
  {
    field: 'textarea',
    label: '多行文本',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 2
    }
  },
  {
    field: 'long',
    label: '超长标题演示',
    component: 'Input',
    formItemProps: {
      labelMaxWidth: 80, // 自动处理长标题
      subLabel: '这是一个副标题提示'
    }
  }
]
</script>
```
:::

### 2. InputNumber 数字输入

支持控制按钮位置、精度、最大最小值配置。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  num1: 1,
  num2: 0,
  num3: 10
})

const schemas = [
  {
    field: 'num1',
    label: '默认',
    component: 'InputNumber'
  },
  {
    field: 'num2',
    label: '按钮居右',
    component: 'InputNumber',
    componentProps: {
      controlsPosition: 'right',
      min: 0,
      max: 100
    }
  },
  {
    field: 'num3',
    label: '无按钮',
    component: 'InputNumber',
    componentProps: {
      controls: false,
      align: 'left'
    },
    insideProps: {
      renders: {
        suffix: () => '岁'
      }
    }
  }
]
</script>
```
:::

### 3. Select 选择器

支持单选、多选、自定义 Tag 样式。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  single: '',
  multiple: []
})

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

const schemas = [
  {
    field: 'single',
    label: '单选',
    component: 'Select',
    componentProps: { options }
  },
  {
    field: 'multiple',
    label: '多选美化',
    component: 'Select',
    componentProps: {
      multiple: true,
      options,
      tagType: 'success', // 选中标签颜色
      tagEffect: 'dark'
    }
  }
]
</script>
```
:::

### 4. Radio 单选框

支持普通样式、按钮样式、带边框样式。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  r1: '1',
  r2: '1',
  r3: '1'
})

const options = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]

const schemas = [
  {
    field: 'r1',
    label: '普通',
    component: 'Radio',
    componentProps: { options }
  },
  {
    field: 'r2',
    label: '带边框',
    component: 'Radio',
    componentProps: {
      options: options.map(o => ({ ...o, border: true }))
    }
  },
  {
    field: 'r3',
    label: '按钮样式',
    component: 'RadioButton',
    componentProps: { options }
  }
]
</script>
```
:::

### 5. Checkbox 多选框

支持复选组、按钮组。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  c1: [],
  c2: []
})

const options = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JS', value: 'js' }
]

const schemas = [
  {
    field: 'c1',
    label: '基础多选',
    component: 'Checkbox',
    componentProps: { options }
  },
  {
    field: 'c2',
    label: '按钮多选',
    component: 'CheckboxButton',
    componentProps: { options }
  }
]
</script>
```
:::

### 6. Cascader 级联选择

支持多级联动、任意级可选。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  area: []
})

const options = [
  {
    label: '中国',
    value: 'cn',
    children: [
      { label: '北京', value: 'bj' },
      { label: '上海', value: 'sh' }
    ]
  }
]

const schemas = [
  {
    field: 'area',
    label: '地区',
    component: 'Cascader',
    componentProps: {
      options,
      style: { width: '100%' },
      props: { checkStrictly: true } // 允许选择任意一级
    }
  }
]
</script>
```
:::

### 7. AeUpload 上传

内置的高级上传组件，支持照片墙、列表、拖拽。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  files: [],
  images: []
})

const schemas = [
  {
    field: 'images',
    label: '照片墙',
    component: 'Upload',
    componentProps: {
      listType: 'picture',
      sizeLimit: '2MB',
      limit: 3,
      // 模拟上传
      upload: async (file) => ({
         url: URL.createObjectURL(file),
         name: file.name
      })
    }
  },
  {
    field: 'files',
    label: '文件列表',
    component: 'Upload',
    componentProps: {
      listType: 'text',
      tips: '支持 PDF, Docx'
    }
  }
]
</script>
```
:::

### 8. AeEditor 富文本编辑器

集成的富文本编辑器。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  content: '<p>初始内容</p>'
})

const schemas = [
  {
    field: 'content',
    label: '文章内容',
    component: 'Editor',
    componentProps: {
      viewHeight: 200
    },
    layoutProps: { span: 24 }
  }
]
</script>
```
:::

### 9. Group & Container 布局容器

使用 Group 或 Card 进行分组布局。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  field1: '',
  field2: ''
})

const schemas = [
  {
    key: 'group1',
    type: 'Container',
    component: 'Group',
    label: '基础分组',
    children: [
      { field: 'field1', label: '字段1', component: 'Input' }
    ],
    layoutProps: { span: 24 }
  },
  {
    key: 'group2',
    type: 'Container',
    component: 'ElCard', // 需要通过 imports 引入 ElCard 或全局注册
    label: '卡片分组',
    componentProps: { shadow: 'hover' },
    children: [
       { field: 'field2', label: '字段2', component: 'Input' }
    ],
    layoutProps: { span: 24 }
  }
]
</script>
```
:::

### 10. 自定义插槽与扩展

通过 `outsideProps` 或 `insideProps` 插入自定义内容。

:::demo
```vue
<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="tsx">
import { ref } from 'vue'

const model = ref({
  email: '',
  domain: '@gmail.com'
})

const schemas = [
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    outsideProps: {
      enable: true,
      direction: 'row',
      appendRender: (form) => (
        <div style="margin-left: 10px; color: #999">
          当前后缀: {model.value.domain}
        </div>
      )
    }
  }
]
</script>
```
:::

## API 参考

### AeForm Props

| 属性名 | 说明 | 类型 | 默认值 |
|Data | Description | Type | Default |
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

