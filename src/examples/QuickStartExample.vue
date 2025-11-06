<template>
  <div class="demo-section">
    <el-card class="demo-card">
      <template #header>
        <span>📦 安装</span>
      </template>
      <pre class="code-block"><code>npm install advanced-ele-ui
# 或
yarn add advanced-ele-ui
# 或
pnpm add advanced-ele-ui</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🔧 完整引入</span>
      </template>
      <pre class="code-block"><code>import { createApp } from 'vue'
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(AdvancedEleUI)
app.mount('#app')</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>📝 按需引入</span>
      </template>
      <pre class="code-block"><code>import { ZwForm, ZwTable, Icon } from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>💡 使用示例</span>
      </template>
      <pre class="code-block"><code>&lt;template&gt;
  &lt;ZwForm
    ref="formRef"
    :model="formModel"
    :schemas="formSchemas"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { ZwForm } from 'advanced-ele-ui'

const formModel = ref({
  username: '',
  email: ''
})

const formSchemas = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input'
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input'
  }
]
&lt;/script&gt;</code></pre>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>
