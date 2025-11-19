<template>
  <div class="demo-container" :class="{ dark: isDark }">
    <header class="demo-header">
      <a
        href="https://github.com/vvhr/advanced-ele-ui"
        target="_blank"
        class="github-link"
        title="View on GitHub"
      >
        <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
      <el-switch
        v-model="isDark"
        class="theme-switch"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="toggleTheme"
      />
      <img
        src="https://image.howcat.cn/thumbnails/5d0a2d8352a09debab8f8d233a8fc67d.png"
        title="logo"
        width="400px"
        alt="logo"
      />
      <p class="subtitle">基于 Vue 3 + Element Plus 的高级组件库</p>
    </header>
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="🚀 快速开始" name="start">
        <QuickStartExample v-if="activeTab === 'start'" />
      </el-tab-pane>
      <el-tab-pane label="📝 AeForm 表单组件" name="form">
        <FormExample v-if="activeTab === 'form'" />
      </el-tab-pane>
      <el-tab-pane label="📊 AeTable 表格组件" name="table">
        <TableExample v-if="activeTab === 'table'" />
      </el-tab-pane>
      <el-tab-pane label="🎨 AeIcon 图标组件" name="icon">
        <IconExample v-if="activeTab === 'icon'" />
      </el-tab-pane>
      <el-tab-pane label="📄 AeEditor 富文本编辑器" name="editor">
        <EditorExample v-if="activeTab === 'editor'" />
      </el-tab-pane>
      <el-tab-pane label="📄 AeUpload 文件上传" name="upload">
        <UploadExample v-if="activeTab === 'upload'" />
      </el-tab-pane>
      <el-tab-pane label="💬 AeDialog 对话框" name="dialog">
        <DialogExample v-if="activeTab === 'dialog'" />
      </el-tab-pane>
      <el-tab-pane label="💬 AeDrawer 抽屉" name="drawer">
        <DrawerExample v-if="activeTab === 'drawer'" />
      </el-tab-pane>
      <el-tab-pane label="💬 AeTabs标签页" name="tabs">
        <TabsExample v-if="activeTab === 'tabs'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import FormExample from './examples/FormExample.vue'
import TableExample from './examples/TableExample.vue'
import IconExample from './examples/IconExample.vue'
import EditorExample from './examples/EditorExample.vue'
import UploadExample from './examples/UploadExample.vue'
import DialogExample from './examples/DialogExample.vue'
import DrawerExample from './examples/DrawerExample.vue'
import TabsExample from './examples/TabsExample.vue'
import QuickStartExample from './examples/QuickStartExample.vue'

const activeTab = ref('start')
const isDark = ref(false)

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

// 切换主题
const toggleTheme = (value: boolean) => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<style scoped>
.demo-container {
  height: 100vh;
  overflow: auto;
  background: linear-gradient(180deg, #0069fc 0%, #6faffe 100%);
  padding: 20px;
  box-sizing: border-box;
}

.demo-header {
  position: relative;
  text-align: center;
  color: white;
  margin-bottom: 30px;
  padding: 40px 20px;
}

.github-link {
  position: absolute;
  top: 20px;
  right: 80px;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.github-link:hover {
  transform: scale(1.1) rotate(360deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-switch {
  position: absolute;
  top: 32px;
  right: 20px;
  --el-switch-on-color: #409eff;
  --el-switch-off-color: #ff9800;
}

.demo-header {
  > h1 {
    font-size: 48px;
    margin: 0 0 10px 0;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
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

/* 暗黑模式样式 */
.dark .demo-container {
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
}

.dark .demo-tabs {
  background: var(--el-bg-color);
}
</style>

<style>
@import './examples/styles.css';
</style>
