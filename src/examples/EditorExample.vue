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
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@/components/Editor'
const editorValue = ref(
  '<h1><span style="color: #2972f4">Advanced Element UI</span></h1><p><span style="color: #2972f4">基于 Vue 3 + Element Plus 的面向低代码、AI的高级组件库</span></p><hr><p></p><p><span style="font-size: 20px"><strong>Introduction</strong></span><br>Advanced Element UI 是一个基于 Element Plus 深度封装的高级组件库，专注于提升中后台系统的开发效率。<br>Element Plus 作为 Vue 3 生态中最受欢迎的 UI 组件库之一，其最大优势在于<strong>保持原生、不过度封装</strong>，这为二次开发提供了极大的灵活性。基于这一特点，我们打造了 Advanced Element UI，通过<strong>配置化驱动</strong>的方式，让复杂的表单和表格开发变得简单高效。<br>本项目的 <code>AeForm</code> 和 <code>AeTable</code> 组件完全基于配置数据驱动渲染，实现了<strong>页面、组件、业务逻辑的完全解耦</strong>。开发者只需关注配置项，即可快速构建复杂的业务场景，大幅减少重复代码，提升开发效率。<br></p><p><span style="font-size: 20px"><strong>Features</strong></span><br>- <strong>开箱即用</strong>：基于 Element Plus，无缝集成到 Vue 3 项目<br>- <strong>风格统一</strong>：二次封装的组件在组件属性和样式上遵循 Element Plus 的风格<br>- <strong>数据驱动</strong>：所有组件都遵循<strong>由配置驱动渲染</strong>的核心思想，拒绝硬编码<br>- <strong>丰富图标</strong>：集成 Iconify，支持 10 万+ 图标库<br>- <strong>类型定义</strong>：完整的类型定义和注释，提供良好的开发体验<br>- <strong>自由扩展</strong>：<code>AeForm</code> 和 <code>AeTable</code> 提供了注册函数，可自行注册任何遵循 Element Plus 属性风格的组件。<br></p>'
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
