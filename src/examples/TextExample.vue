<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>文本组件</h2>
      <p>增强文本显示，支持前置图标、圆点、引用块，支持高亮文字匹配和交互</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <span>基础用法</span>
      </template>
      <div class="demo-item">
        <AeText value="这是一段简单的文本内容" />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>带图标的文本</span>
      </template>
      <div class="demo-item">
        <AeText icon="ep:info-filled" value="这是一条信息提示" />
      </div>
      <div class="demo-item">
        <AeText icon="ep:warning-filled" value="这是一条警告提示" />
      </div>
      <div class="demo-item">
        <AeText icon="ep:success-filled" value="操作成功完成" />
      </div>
      <div class="demo-item">
        <AeText
          icon="ep:star-filled"
          icon-class="custom-icon"
          :icon-style="{ color: '#f39c12', fontSize: '18px' }"
          value="自定义图标样式"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>带圆点的文本（优化版 - 带光晕效果）</span>
      </template>
      <div class="demo-item">
        <AeText dot-type="primary" value="主要信息" />
      </div>
      <div class="demo-item">
        <AeText dot-type="success" value="成功状态" />
      </div>
      <div class="demo-item">
        <AeText dot-type="warning" value="警告状态" />
      </div>
      <div class="demo-item">
        <AeText dot-type="danger" value="危险状态" />
      </div>
      <div class="demo-item">
        <AeText dot-type="info" value="信息状态（鼠标悬停查看光晕效果）" />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>引用块样式</span>
      </template>
      <div class="demo-item">
        <AeText
          block
          icon="ep:warning-filled"
          value="这是一个重要的提示信息，使用引用块样式展示，能够吸引用户的注意力"
        />
      </div>
      <div class="demo-item">
        <AeText
          block
          dot-type="success"
          value="引用块也可以搭配圆点使用，适合用于列表式的提示内容"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>文本高亮</span>
      </template>
      <div class="demo-item">
        <AeText
          value="Vue 3 是一个渐进式的 JavaScript 框架，支持 TypeScript"
          :patterns="['Vue 3', 'JavaScript', 'TypeScript']"
        />
      </div>
      <div class="demo-item">
        <AeText
          value="Element Plus 是基于 Vue 3 的组件库"
          :patterns="['Element Plus', 'Vue 3']"
          hl-class="custom-highlight"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>高亮点击事件</span>
      </template>
      <div class="demo-item">
        <AeText
          value="点击高亮的关键词可以触发事件：Vue、React、Angular"
          :patterns="['Vue', 'React', 'Angular']"
          @hl-click="handleHighlightClick"
        />
      </div>
      <div v-if="clickedText" class="click-result">
        <el-tag type="success">您点击了：{{ clickedText }}</el-tag>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>自定义高亮样式</span>
      </template>
      <div class="demo-item">
        <AeText
          value="使用自定义样式高亮关键词"
          :patterns="['自定义样式']"
          :hl-style="{ backgroundColor: '#67c23a', color: '#fff', padding: '4px 8px' }"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🆕 文本截断与展开</span>
      </template>
      <div class="demo-item">
        <AeText
          value="这是一段很长的文本内容，超过一行后会自动截断显示省略号。这是一段很长的文本内容，超过一行后会自动截断显示省略号。"
          :truncate="true"
        />
      </div>
      <div class="demo-item">
        <AeText
          value="这是一段可以展开和收起的文本。点击「展开」按钮可以查看完整内容，再次点击「收起」可以折叠文本。这是一段可以展开和收起的文本。点击「展开」按钮可以查看完整内容，再次点击「收起」可以折叠文本。这是一段可以展开和收起的文本。"
          :truncate="true"
          :expandable="true"
          expand-text="查看更多"
          collapse-text="收起内容"
        />
      </div>
      <div class="demo-item">
        <AeText
          value="支持多行截断：这是第一行内容。这是第二行内容。这是第三行内容。这是第四行内容。这是第五行内容。这是第六行内容。超过三行会被截断。"
          :truncate="3"
          :expandable="true"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🆕 复制功能</span>
      </template>
      <div class="demo-item">
        <AeText
          value="点击右侧图标可以复制这段文本到剪贴板"
          :copyable="true"
          @copy="handleCopy"
        />
      </div>
      <div class="demo-item">
        <AeText
          icon="ep:key"
          value="API Key: sk-1234567890abcdefghijklmnopqrstuvwxyz"
          :copyable="true"
          copy-icon="ep:document-copy"
          copy-success-text="API Key 已复制"
        />
      </div>
      <div class="demo-item">
        <AeText
          block
          dot-type="primary"
          value="在引用块中也可以使用复制功能，方便用户快速复制重要信息"
          :copyable="true"
        />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>组合使用</span>
      </template>
      <div class="demo-item">
        <AeText
          block
          icon="ep:info-filled"
          value="在引用块中使用图标和高亮：Vue 3、Element Plus、TypeScript"
          :patterns="['Vue 3', 'Element Plus', 'TypeScript']"
          @hl-click="handleHighlightClick"
        />
      </div>
      <div class="demo-item">
        <AeText
          block
          dot-type="warning"
          value="圆点、引用块、高亮三种特性组合使用，提升信息的表达能力"
          :patterns="['圆点', '引用块', '高亮']"
        />
      </div>
      <div class="demo-item">
        <AeText
          block
          icon="ep:warning-filled"
          :icon-style="{ color: '#e6a23c' }"
          value="这是一段重要的提示信息，可以复制保存。包含关键词：Vue 3 和 TypeScript"
          :patterns="['Vue 3', 'TypeScript']"
          :copyable="true"
          :truncate="true"
          :expandable="true"
        />
      </div>
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>🎯 支持前置图标装饰（Iconify 图标）</li>
        <li>🎨 支持图标自定义样式（iconClass/iconStyle）</li>
        <li>🔴 支持彩色圆点标记（5 种类型，带光晕效果）</li>
        <li>📌 支持 Markdown 风格的引用块</li>
        <li>✏️ 支持多关键词高亮匹配</li>
        <li>🖱️ 支持高亮文本点击交互</li>
        <li>🎨 支持自定义高亮样式</li>
        <li>📏 支持文本截断（单行/多行）</li>
        <li>📖 支持展开/收起功能</li>
        <li>📋 支持一键复制文本</li>
        <li>🔧 灵活的功能组合</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AeText } from '@/components/Text'
import { ElMessage } from 'element-plus'

const clickedText = ref('')

const handleHighlightClick = (value: string) => {
  clickedText.value = value
  ElMessage.success(`点击了关键词：${value}`)

  // 3 秒后清除
  setTimeout(() => {
    clickedText.value = ''
  }, 3000)
}

const handleCopy = (text: string) => {
  console.log('复制的内容：', text)
}
</script>

<style scoped>
.demo-item {
  margin-bottom: 16px;
}

.demo-item:last-child {
  margin-bottom: 0;
}

.click-result {
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  text-align: center;
}

.custom-highlight {
  background-color: #e6a23c !important;
  color: #fff !important;
}
</style>
