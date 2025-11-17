# AeDialog 使用指南

## 快速开始

```vue
<template>
  <el-button @click="visible = true">打开对话框</el-button>
  
  <AeDialog v-model="visible" title="标题" @confirm="handleConfirm">
    对话框内容
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

## 核心特性

### 1. 自动销毁内容（默认开启）

这是 AeDialog 最重要的特性之一。默认情况下，关闭对话框会销毁内部组件，每次打开都是全新的状态。

**适用场景：**
- ✅ 表单输入（无需手动重置表单）
- ✅ 新增/编辑数据
- ✅ 需要每次都从初始状态开始的场景

```vue
<AeDialog v-model="visible" title="新增用户">
  <!-- 每次打开都会重新创建，表单自动重置 -->
  <UserForm />
</AeDialog>
```

**如果不需要销毁：**

```vue
<AeDialog
  v-model="visible"
  title="用户详情"
  :destroy-on-close="false"
>
  <!-- 关闭后保持状态 -->
  <UserDetail />
</AeDialog>
```

### 2. 拖拽功能（默认开启）

拖动标题栏可以移动对话框位置。

```vue
<AeDialog
  v-model="visible"
  title="可拖拽对话框"
  :draggable="true"
>
  内容
</AeDialog>
```

### 3. 最大化/还原

点击标题栏的最大化按钮可以将对话框最大化。

```vue
<AeDialog
  v-model="visible"
  title="对话框"
  :show-maximize="true"
>
  内容
</AeDialog>
```

### 4. 全屏模式

```vue
<AeDialog
  v-model="visible"
  title="对话框"
  :show-fullscreen="true"
>
  内容
</AeDialog>
```

### 5. 确认按钮加载状态

```vue
<template>
  <AeDialog
    v-model="visible"
    title="提交数据"
    :confirm-loading="loading"
    @confirm="handleSubmit"
  >
    内容
  </AeDialog>
</template>

<script setup>
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  await api.submit()
  loading.value = false
  visible.value = false
}
</script>
```

### 6. 关闭前确认

```vue
<AeDialog
  v-model="visible"
  title="编辑文档"
  :before-close="handleBeforeClose"
>
  内容
</AeDialog>

<script setup>
const handleBeforeClose = (done) => {
  ElMessageBox.confirm('确定要关闭吗？')
    .then(() => done())
    .catch(() => {})
}
</script>
```

## 常见场景

### 场景1：新增/编辑表单

```vue
<template>
  <AeDialog
    v-model="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    :confirm-loading="loading"
    @confirm="handleSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>
  </AeDialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = ref({
  name: '',
  email: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }]
}

const handleSubmit = async () => {
  await formRef.value.validate()
  loading.value = true
  
  try {
    if (isEdit.value) {
      await api.update(form.value)
    } else {
      await api.create(form.value)
    }
    ElMessage.success('操作成功')
    visible.value = false
  } finally {
    loading.value = false
  }
}
</script>
```

### 场景2：详情展示

```vue
<template>
  <AeDialog
    v-model="visible"
    title="用户详情"
    :footer="false"
    :show-footer-border="false"
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ user.phone }}</el-descriptions-item>
      <el-descriptions-item label="地址">{{ user.address }}</el-descriptions-item>
    </el-descriptions>
  </AeDialog>
</template>
```

### 场景3：确认操作

```vue
<template>
  <AeDialog
    v-model="visible"
    title="确认删除"
    width="400px"
    confirm-type="danger"
    confirm-text="删除"
    :confirm-loading="loading"
    @confirm="handleDelete"
  >
    <p>确定要删除该用户吗？此操作不可恢复。</p>
  </AeDialog>
</template>

<script setup>
const handleDelete = async () => {
  loading.value = true
  await api.delete(userId)
  ElMessage.success('删除成功')
  visible.value = false
  loading.value = false
}
</script>
```

### 场景4：自定义底部按钮

```vue
<template>
  <AeDialog v-model="visible" title="审批">
    <p>请审批该申请</p>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="handleReject">驳回</el-button>
      <el-button type="success" @click="handleApprove">通过</el-button>
    </template>
  </AeDialog>
</template>
```

## 配置对比

### 默认配置（推荐）

```vue
<AeDialog v-model="visible" title="标题">
  内容
</AeDialog>
```

等同于：

```vue
<AeDialog
  v-model="visible"
  title="标题"
  width="50%"
  :draggable="true"
  :show-maximize="true"
  :show-fullscreen="false"
  :destroy-on-close="true"
  :show-header-border="true"
  :show-footer-border="true"
  :close-on-click-modal="false"
  :close-on-press-escape="true"
  :show-cancel-button="true"
  :show-confirm-button="true"
  confirm-text="确定"
  cancel-text="取消"
  confirm-type="primary"
>
  内容
</AeDialog>
```

## 注意事项

1. **destroyOnClose 的影响**
   - 设置为 `true`（默认）：关闭时销毁内容，适合表单场景
   - 设置为 `false`：关闭时保持状态，适合详情展示

2. **拖拽限制**
   - 最大化或全屏状态下，拖拽功能会自动禁用
   - 拖拽时会限制在可视区域内

3. **按钮配置**
   - 设置 `footer: false` 可以完全隐藏底部区域
   - 使用 `footer` 插槽可以自定义底部内容

4. **事件处理**
   - `confirm` 事件：点击确认按钮触发
   - `cancel` 事件：点击取消按钮触发
   - 关闭对话框需要手动设置 `visible.value = false`

5. **样式定制**
   - 组件完全遵循 Element Plus 的 CSS 变量
   - 可以通过修改 CSS 变量来定制样式
