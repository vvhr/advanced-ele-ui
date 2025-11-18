# Dialog 组件

基于 Element Plus ElDialog 的二次封装组件，提供更好的用户体验和一致的样式。

## 特性

- 📦 继承 ElDialog 所有原生属性
- 🎨 统一的样式设计
- 🔧 优化的操作按钮（全屏切换、关闭按钮）
- 📜 内置滚动条支持
- 🖱️ 可选的拖拽功能
- 🎯 更好的类型提示

## 基础用法

```vue
<template>
  <Dialog v-model="visible" title="对话框标题">
    <div>对话框内容</div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'

const visible = ref(false)
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否显示 | boolean | false |
| title | 标题 | string | '' |
| fullscreen | 是否显示全屏切换按钮 | boolean | false |
| maxHeight | 内容区域最大高度 | string \| number | '400px' |
| draggable | 是否可拖拽 | boolean | false |
| scrollable | 是否使用滚动条包裹内容 | boolean | true |
| beforeClose | 关闭前的回调 | (done: () => void) => void | - |
| ...其他 | 继承 ElDialog 所有属性 | - | - |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 自定义标题内容 |
| header-actions | 标题栏自定义操作按钮（位于关闭按钮之前） |
| default | 对话框内容 |
| footer | 底部内容 |

## 示例

### 可拖拽对话框

```vue
<Dialog v-model="visible" title="可拖拽对话框" :draggable="true">
  <div>拖动标题栏可以移动对话框</div>
</Dialog>
```

### 全屏切换

```vue
<Dialog v-model="visible" title="全屏对话框" :fullscreen="true">
  <div>点击标题栏的全屏按钮可以切换全屏模式</div>
</Dialog>
```

### 带底部操作栏

```vue
<Dialog v-model="visible" title="确认操作">
  <div>对话框内容</div>
  <template #footer>
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="handleConfirm">确认</el-button>
  </template>
</Dialog>
```

### 自定义标题

```vue
<Dialog v-model="visible">
  <template #title>
    <div class="flex items-center gap-2">
      <Icon icon="ep:setting" />
      <span>设置</span>
    </div>
  </template>
  <div>对话框内容</div>
</Dialog>
```

### 关闭前确认

```vue
<template>
  <Dialog v-model="visible" title="编辑表单" :before-close="handleBeforeClose">
    <el-form>
      <!-- 表单内容 -->
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗？未保存的内容将丢失。')
    .then(() => done())
    .catch(() => {})
}
</script>
```

### 自定义标题栏操作按钮

```vue
<Dialog v-model="visible" title="数据详情" :fullscreen="true">
  <template #header-actions>
    <div class="dialog-action-btn" @click="handleRefresh">
      <Icon icon="ep:refresh" />
    </div>
    <div class="dialog-action-btn" @click="handleDownload">
      <Icon icon="ep:download" />
    </div>
  </template>
  <div>对话框内容</div>
</Dialog>
```

> 💡 自定义按钮会显示在全屏切换和关闭按钮之前，可以添加刷新、下载、打印等操作按钮。

### 禁用滚动条（适用于 Tabs 等需要自动撑开的内容）

```vue
<Dialog v-model="visible" title="标签页" :scrollable="false" width="800px">
  <el-tabs v-model="activeTab" style="height: 100%">
    <el-tab-pane label="用户管理" name="first">
      <div>用户管理内容</div>
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">
      <div>配置管理内容</div>
    </el-tab-pane>
  </el-tabs>
</Dialog>
```

> 💡 当 `scrollable` 为 `false` 时，内容区域会使用 flex 布局自动撑开，适合嵌套 Tabs、Tree 等需要占满高度的组件。
