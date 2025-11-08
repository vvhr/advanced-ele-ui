<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>富文本编辑器</h2>
    </div>
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
          <div class="card-actions">
            <el-radio-group v-model="editorProps.mode">
              <el-radio-button value="simple">简易工具栏模式</el-radio-button>
              <el-radio-button value="full">完整工具栏模式</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="editorProps.disabled">
              <el-radio-button :value="false">编辑模式</el-radio-button>
              <el-radio-button :value="true">详情模式</el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="updateValue">模拟动态更新</el-button>
          </div>
        </div>
      </template>
      <Editor
        v-model="editorValue"
        :disabled="editorProps.disabled"
        :mode="editorProps.mode"
        :add-toolbar-keys="editorProps.addToolbarKeys"
      />
    </el-card>
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>纯阅读模式</span>
        </div>
      </template>
      <div v-html="editorValue"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@/components/Editor'
const editorValue = ref(
  '<h1>Advanced Element UI </h1><p>基于 Vue 3 + Element Plus 的高级组件库</p><h2>✨ 特性</h2><ul><li><p>🚀 <strong>开箱即用</strong> - 基于 Element Plus，无缝集成到 Vue 3 项目 </p></li><li><p>📝 <strong>高级表单</strong> - 基于数据驱动表单渲染，支持动态表单、自动校验、嵌套表格等复杂场景</p></li><li><p>📊 <strong>强大表格</strong> - 基于数据驱动表格渲染，可编辑表格、多种列类型、金额格式化、敏感信息脱敏 </p></li><li><p>🎨 <strong>丰富图标</strong> - 集成 Iconify，支持 10 万+ 图标库</p></li><li><p>💪 <strong>TypeScript</strong> - 完整的类型定义，提供良好的开发体验</p></li><li><p>🎯 <strong>按需引入</strong> - 支持 Tree Shaking，减小打包体积</p></li><li><p>📦 <strong>轻量级</strong> - 核心代码精简，依赖合理</p></li></ul>'
)
const editorProps = reactive<any>({
  disabled: false,
  mode: 'simple',
  addToolbarKeys: [[0, 'source-code']]
})

function updateValue() {
  editorValue.value = '<h1>🎨 Advanced Element UI</h1><p>基于 Vue 3 + Element Plus 的高级组件库</p>'
}
</script>
