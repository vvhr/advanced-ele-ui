# AeEditor 编辑器

富文本编辑器组件。

## 基础用法

:::demo
```vue
<template>
  <AeEditor v-model="content" />
</template>

<script setup>
import { ref } from 'vue'
const content = ref('<p>Hello World</p>')
</script>
```
:::
