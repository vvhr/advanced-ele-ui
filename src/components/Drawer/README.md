# Drawer 组件

基于 Element Plus ElDrawer 的二次封装组件，提供更好的用户体验和一致的样式。

## 特性

- 📦 继承 ElDrawer 所有原生属性
- 🎨 统一的样式设计
- 🔧 优化的操作按钮（关闭按钮）
- 📜 内置滚动条支持
- 🎯 更好的类型提示

## 基础用法

```vue
<template>
  <Drawer v-model="visible" title="抽屉标题">
    <div>抽屉内容</div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Drawer } from '@/components/Drawer'

const visible = ref(false)
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否显示 | boolean | false |
| title | 标题 | string | '' |
| direction | 抽屉打开方向 | 'rtl' \| 'ltr' \| 'ttb' \| 'btt' | 'rtl' |
| size | 抽屉尺寸 | string \| number | '30%' |
| scrollable | 是否使用滚动条包裹内容 | boolean | true |
| ...其他 | 继承 ElDrawer 所有属性 | - | - |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 自定义标题内容 |
| header-actions | 标题栏自定义操作按钮（位于关闭按钮之前） |
| default | 抽屉内容 |
| footer | 底部内容 |

## 示例

### 自定义方向和尺寸

```vue
<Drawer v-model="visible" direction="ltr" size="50%">
  <div>从左侧打开的抽屉</div>
</Drawer>
```

### 带底部操作栏

```vue
<Drawer v-model="visible" title="确认操作">
  <div>抽屉内容</div>
  <template #footer>
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="handleConfirm">确认</el-button>
  </template>
</Drawer>
```

### 自定义标题

```vue
<Drawer v-model="visible">
  <template #title>
    <div class="flex items-center gap-2">
      <Icon icon="ep:setting" />
      <span>设置</span>
    </div>
  </template>
  <div>抽屉内容</div>
</Drawer>
```

### 自定义标题栏操作按钮

```vue
<Drawer v-model="visible" title="设置">
  <template #header-actions>
    <div class="drawer-action-btn" @click="handleRefresh">
      <Icon icon="ep:refresh" />
    </div>
    <div class="drawer-action-btn" @click="handleHelp">
      <Icon icon="ep:question-filled" />
    </div>
  </template>
  <div>抽屉内容</div>
</Drawer>
```

> 💡 自定义按钮会显示在关闭按钮之前，可以添加刷新、帮助、设置等操作按钮。

### 禁用滚动条（适用于 Tabs 等需要自动撑开的内容）

```vue
<Drawer v-model="visible" title="标签页" :scrollable="false">
  <el-tabs v-model="activeTab" style="height: 100%">
    <el-tab-pane label="用户管理" name="first">
      <div>用户管理内容</div>
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">
      <div>配置管理内容</div>
    </el-tab-pane>
  </el-tabs>
</Drawer>
```

> 💡 当 `scrollable` 为 `false` 时，内容区域会使用 flex 布局自动撑开，适合嵌套 Tabs、Tree 等需要占满高度的组件。
