# AeDialog 对话框组件

基于 `el-dialog` 二次封装的高级对话框组件，提供更强大的功能和更好的用户体验。

## 特性

- ✅ **拖拽功能**：支持拖拽标题栏移动对话框位置
- ✅ **最大化/还原**：一键最大化对话框或还原到原始大小
- ✅ **全屏显示**：支持全屏模式
- ✅ **自动销毁**：关闭时自动销毁内容，避免表单数据污染
- ✅ **样式优化**：标题栏和底部区域带有边框，视觉层次更清晰
- ✅ **内置按钮**：提供确认/取消按钮，支持加载状态
- ✅ **关闭确认**：支持关闭前确认回调
- ✅ **样式变量**：完全遵循 Element Plus 样式变量

## 基础用法

```vue
<template>
  <el-button @click="visible = true">打开对话框</el-button>
  
  <AeDialog
    v-model="visible"
    title="基础对话框"
    @confirm="handleConfirm"
  >
    <p>这是对话框内容</p>
  </AeDialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const handleConfirm = () => {
  console.log('确认')
  visible.value = false
}
</script>
```

## 拖拽对话框

```vue
<AeDialog
  v-model="visible"
  title="可拖拽对话框"
  :draggable="true"
>
  拖动标题栏可以移动对话框位置
</AeDialog>
```

## 最大化功能

```vue
<AeDialog
  v-model="visible"
  title="带最大化的对话框"
  :show-maximize="true"
>
  点击标题栏的最大化按钮可以最大化对话框
</AeDialog>
```

## 表单对话框

利用 `destroyOnClose` 特性，每次打开对话框都会重新创建内容，无需手动重置表单：

```vue
<template>
  <AeDialog
    v-model="visible"
    title="用户信息"
    :confirm-loading="loading"
    @confirm="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>
  </AeDialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)
const form = ref({
  name: '',
  email: ''
})

const handleSubmit = async () => {
  loading.value = true
  // 提交表单...
  await submitForm(form.value)
  loading.value = false
  visible.value = false
}
</script>
```

## 自定义底部

```vue
<AeDialog v-model="visible" title="自定义底部">
  <p>对话框内容</p>
  
  <template #footer>
    <el-button @click="visible = false">关闭</el-button>
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button type="danger" @click="handleDelete">删除</el-button>
  </template>
</AeDialog>
```

## 关闭前确认

```vue
<AeDialog
  v-model="visible"
  title="关闭前确认"
  :before-close="handleBeforeClose"
>
  <p>尝试关闭对话框会弹出确认提示</p>
</AeDialog>

<script setup>
const handleBeforeClose = (done) => {
  ElMessageBox.confirm('确定要关闭吗？')
    .then(() => done())
    .catch(() => {})
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 是否显示对话框 | boolean | false |
| title | 对话框标题 | string | '' |
| width | 对话框宽度 | string / number | '50%' |
| draggable | 是否可拖拽 | boolean | true |
| show-maximize | 是否显示最大化按钮 | boolean | true |
| show-fullscreen | 是否显示全屏按钮 | boolean | false |
| destroy-on-close | 关闭时是否销毁内容 | boolean | true |
| show-header-border | 是否显示标题栏底部边框 | boolean | true |
| show-footer-border | 是否显示底部区域顶部边框 | boolean | true |
| auto-focus | 是否在打开时自动聚焦 | boolean | true |
| before-close | 关闭前的回调 | (done: () => void) => void | - |
| footer | 底部按钮配置 | boolean / 'default' | 'default' |
| confirm-text | 确认按钮文本 | string | '确定' |
| cancel-text | 取消按钮文本 | string | '取消' |
| confirm-type | 确认按钮类型 | string | 'primary' |
| show-cancel-button | 是否显示取消按钮 | boolean | true |
| show-confirm-button | 是否显示确认按钮 | boolean | true |
| confirm-loading | 确认按钮加载状态 | boolean | false |
| close-on-click-modal | 是否点击遮罩层关闭 | boolean | false |
| close-on-press-escape | 是否按 ESC 键关闭 | boolean | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 点击确认按钮时触发 | - |
| cancel | 点击取消按钮时触发 | - |
| open | 对话框打开时触发 | - |
| opened | 对话框打开动画结束时触发 | - |
| close | 对话框关闭时触发 | - |
| closed | 对话框关闭动画结束时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 对话框内容 |
| title | 对话框标题 |
| footer | 对话框底部 |

### Exposes

| 方法名 | 说明 | 参数 |
|--------|------|------|
| toggleMaximize | 切换最大化状态 | - |
| toggleFullscreen | 切换全屏状态 | - |

## 与 el-dialog 的区别

| 特性 | el-dialog | AeDialog |
|------|-----------|----------|
| 拖拽功能 | ❌ | ✅ |
| 最大化按钮 | ❌ | ✅ |
| 全屏按钮 | ❌ | ✅ |
| 自动销毁内容 | ❌ | ✅ (默认) |
| 标题栏边框 | ❌ | ✅ |
| 底部边框 | ❌ | ✅ |
| 内置确认/取消按钮 | ❌ | ✅ |
| 确认按钮加载状态 | ❌ | ✅ |

## 最佳实践

### 1. 表单场景

对于表单场景，建议使用默认的 `destroyOnClose: true`，这样每次打开对话框都会重新创建表单，无需手动重置：

```vue
<AeDialog v-model="visible" title="新增用户">
  <UserForm />
</AeDialog>
```

### 2. 详情展示

对于详情展示场景，如果不希望每次都重新加载数据，可以设置 `destroyOnClose: false`：

```vue
<AeDialog
  v-model="visible"
  title="用户详情"
  :destroy-on-close="false"
  :footer="false"
>
  <UserDetail :id="userId" />
</AeDialog>
```

### 3. 异步操作

对于需要异步操作的场景，使用 `confirm-loading` 提供更好的用户体验：

```vue
<AeDialog
  v-model="visible"
  title="提交数据"
  :confirm-loading="loading"
  @confirm="handleSubmit"
>
  <!-- 内容 -->
</AeDialog>
```

### 4. 防止误关闭

对于重要操作，使用 `before-close` 防止用户误关闭：

```vue
<AeDialog
  v-model="visible"
  title="编辑文档"
  :before-close="confirmClose"
>
  <!-- 内容 -->
</AeDialog>
```
