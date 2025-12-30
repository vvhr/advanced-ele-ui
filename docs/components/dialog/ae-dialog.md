# AeDialog 对话框

对话框组件。

## 基础用法

:::demo
```vue
<template>
  <AeDialog v-model="visible" title="标题">
    内容
  </AeDialog>
  <el-button @click="visible = true">打开</el-button>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```
:::
