<template>
  <div id="app" class="demo-container">
    <header class="demo-header">
      <h1>🎨 Advanced Element UI</h1>
      <p class="subtitle">基于 Vue 3 + Element Plus 的高级组件库</p>
    </header>
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="🚀 快速开始" name="start">
        <QuickStartExample />
      </el-tab-pane>
      <el-tab-pane label="📝 ZwForm 表单组件" name="form">
        <FormExample />
      </el-tab-pane>
      <el-tab-pane label="📊 ZwTable 表格组件" name="table">
        <TableExample />
      </el-tab-pane>
      <el-tab-pane label="🎨 ZwIcon 图标组件" name="icon">
        <IconExample />
      </el-tab-pane>
      <el-tab-pane label="📄 ZwEditor 富文本编辑器" name="aieditor">
        <EditorExample />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormExample from './examples/FormExample.vue'
import TableExample from './examples/TableExample.vue'
import IconExample from './examples/IconExample.vue'
import EditorExample from './examples/EditorExample.vue'
import QuickStartExample from './examples/QuickStartExample.vue'

const activeTab = ref('form')
</script>

<style scoped>
.demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  padding: 40px 20px;
}

.demo-header h1 {
  font-size: 48px;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.demo-tabs {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-card__header) {
  background: #f5f7fa;
  font-weight: 600;
}
</style>

<style>
@import './examples/styles.css';
</style>
