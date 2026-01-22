<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>组合输入器</h2>
      <p>将组合输入的"邮箱号"/"不动产证号"等场景的多组件组合进行原子化封装</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <span>字符串模板模式</span>
      </template>
      <div class="demo-item">
        <AeComboInput
          v-model="stringTemplateValue"
          template="闽({year})永安市不动产权第{no}号"
          size="default"
          @change="handleStringTemplateChange"
        />
        <div class="result">当前值: {{ stringTemplateValue }}</div>
        <div v-if="stringTemplateChangeEvent" class="event-result">
          Change事件: {{ JSON.stringify(stringTemplateChangeEvent) }}
        </div>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>详细配置模式</span>
      </template>
      <div class="demo-item">
        <AeComboInput v-model="detailedTemplateValue" :template="detailedTemplate" size="default" />
        <div class="result">当前值: {{ detailedTemplateValue }}</div>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>不同尺寸</span>
      </template>
      <div class="demo-item">
        <AeComboInput v-model="smallValue" template="邮箱: {prefix}@{domain}.com" size="small" />
        <div class="result">当前值: {{ smallValue }}</div>
      </div>
      <div class="demo-item">
        <AeComboInput
          v-model="detailedTemplateValue"
          :template="detailedTemplate"
          size="default"
          @change="handleDetailedTemplateChange"
        />
        <div class="result">当前值: {{ detailedTemplateValue }}</div>
        <div v-if="detailedTemplateChangeEvent" class="event-result">
          Change事件: {{ JSON.stringify(detailedTemplateChangeEvent) }}
        </div>
      </div>
      <div class="demo-item">
        <AeComboInput v-model="largeValue" template="邮箱: {prefix}@{domain}.com" size="large" />
        <div class="result">当前值: {{ largeValue }}</div>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>禁用状态</span>
      </template>
      <div class="demo-item">
        <AeComboInput
          v-model="disabledValue"
          template="闽({year})永安市不动产权第{no}号"
          disabled
        />
        <div class="result">当前值: {{ disabledValue }}</div>
      </div>
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>🎯 支持字符串模板如 "闽({year})永安市不动产权第{no}号"</li>
        <li>🛠️ 支持详细配置模式，可自定义每个组件的属性</li>
        <li>🔄 自动解析 {xxx} 生成对应的输入框</li>
        <li>📏 支持 small/default/large 三种尺寸</li>
        <li>🔒 支持禁用状态</li>
        <li>⚡ 双向绑定，实时更新完整值</li>
        <li>🧩 基于 Element Plus 组件库</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AeComboInput } from '@/components/ComboInput'
import type { ComboInputChangeEvent, ComboTemplate } from '@/components/ComboInput/src/types'

// 字符串模板模式
const stringTemplateValue = ref('')
const stringTemplateChangeEvent = ref<ComboInputChangeEvent | null>(null)
const handleStringTemplateChange = (event: ComboInputChangeEvent) => {
  stringTemplateChangeEvent.value = event
}

// 详细配置模式
const detailedTemplateValue = ref('')
const detailedTemplateChangeEvent = ref<ComboInputChangeEvent | null>(null)
const handleDetailedTemplateChange = (event: ComboInputChangeEvent) => {
  detailedTemplateChangeEvent.value = event
}

// 详细配置模式
const detailedTemplate: ComboTemplate[] = [
  {
    tag: 'span',
    content: '闽('
  },
  {
    tag: 'select',
    prop: 'year',
    componentProps: {
      placeholder: '选择年份',
      options: [
        { label: '2021', value: '2021' },
        { label: '2022', value: '22' },
        { label: '2023', value: '23' },
        { label: '2024', value: '24' }
      ]
    }
  },
  {
    tag: 'span',
    content: ')永安市不动产权第'
  },
  {
    tag: 'input',
    prop: 'no',
    componentProps: {
      placeholder: '输入编号'
    }
  },
  {
    tag: 'span',
    content: '号'
  }
]

// 不同尺寸
const smallValue = ref('')
const largeValue = ref('')

// 禁用状态
const disabledValue = ref('闽(22)永安市不动产权第12345号')
</script>

<style scoped>
.demo-item {
  margin-bottom: 16px;
}

.demo-item:last-child {
  margin-bottom: 0;
}

.result {
  margin-top: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

.event-result {
  margin-top: 8px;
  padding: 8px;
  background-color: #f0f9ff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
  word-break: break-all;
}
</style>
