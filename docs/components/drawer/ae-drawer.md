# AeDrawer 抽屉

抽屉组件。

## 基础用法

:::demo
```vue
<template>
  <AeDrawer v-model="visible" title="标题">
    内容
  </AeDrawer>
  <el-button @click="visible = true">打开</el-button>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```
:::
