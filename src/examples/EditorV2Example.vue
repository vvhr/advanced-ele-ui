<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>富文本编辑器 V2</h2>
      <p>基于 Tiptap 的富文本编辑器组件，支持丰富的文本格式化功能</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>基础使用</span>
          <div class="card-actions">
            <el-switch
              v-model="editorProps.disabled"
              active-text="禁用"
              inactive-text="启用"
            />
            <el-switch
              v-model="editorProps.showToolbar"
              active-text="显示工具栏"
              inactive-text="隐藏工具栏"
            />
            <el-button type="primary" @click="updateValue">模拟动态更新</el-button>
            <el-button @click="clearValue">清空内容</el-button>
          </div>
        </div>
      </template>
      <EditorV2
        v-model="editorValue1"
        :disabled="editorProps.disabled"
        :show-toolbar="editorProps.showToolbar"
        placeholder="请输入内容..."
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="editor-info">
        <el-text type="info">内容长度: {{ editorValue1.length }} 字符</el-text>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>禁用状态</span>
      </template>
      <EditorV2
        v-model="editorValue2"
        :disabled="true"
        placeholder="编辑器已禁用"
      />
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>无工具栏模式</span>
      </template>
      <EditorV2
        v-model="editorValue3"
        :show-toolbar="false"
        placeholder="无工具栏编辑器"
      />
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>预设内容</span>
      </template>
      <EditorV2
        v-model="editorValue4"
        placeholder="请输入内容..."
      />
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>📝 基于 Tiptap 构建，功能强大且可扩展</li>
        <li>🎨 支持标题、加粗、斜体、下划线、删除线等文本格式</li>
        <li>🌈 支持文字颜色和背景高亮</li>
        <li>📏 支持字号和行高设置</li>
        <li>📋 支持有序和无序列表</li>
        <li>🔧 支持禁用状态和工具栏显示控制</li>
        <li>⚡ 支持 v-model 双向绑定</li>
        <li>🎯 完整的事件支持（change、focus、blur）</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EditorV2 } from '@/components/EditorV2'
import { ElMessage } from 'element-plus'

const editorValue1 = ref('')
const editorValue2 = ref('<h1>禁用状态示例</h1><p>这是一个<strong>禁用</strong>状态的编辑器，无法编辑内容。</p>')
const editorValue3 = ref('<p>这是一个<em>无工具栏</em>的编辑器示例。</p>')
const editorValue4 = ref('<h1>欢迎使用 EditorV2</h1><h2>功能丰富的富文本编辑器</h2><p>这是一个基于 <strong>Tiptap</strong> 构建的富文本编辑器组件。</p><p>支持以下功能：</p><ul><li>文本格式化（<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>）</li><li>文字颜色和背景高亮</li><li>字号和行高设置</li><li>有序和无序列表</li></ul><p style="color: #409eff">你可以尝试使用工具栏来格式化文本！</p>')

const editorProps = reactive({
  disabled: false,
  showToolbar: true
})

function updateValue() {
  editorValue1.value = '<h1>🎨 动态更新示例</h1><p>这是通过<strong>按钮点击</strong>动态更新的内容。</p><p>当前时间：' + new Date().toLocaleString() + '</p>'
  ElMessage.success('内容已更新')
}

function clearValue() {
  editorValue1.value = ''
  ElMessage.info('内容已清空')
}

function handleChange(value: string) {
  console.log('内容变化:', value)
}

function handleFocus() {
  console.log('编辑器获得焦点')
}

function handleBlur() {
  console.log('编辑器失去焦点')
}
</script>

<style scoped>
.editor-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
