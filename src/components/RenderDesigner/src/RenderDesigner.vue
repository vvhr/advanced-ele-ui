<template>
  <div class="render-designer">
    <!-- RenderDesigner 组件的实现 -->
    <!-- 这是一个占位组件，实际的可视化编辑器需要根据具体需求实现 -->
    <div class="render-designer-container">
      <div class="designer-toolbar">
        <h3>Render 设计器</h3>
        <el-button @click="handleAddComponent">添加组件</el-button>
      </div>
      
      <div class="designer-content">
        <div class="component-library">
          <h4>组件库</h4>
          <div class="component-list">
            <div
              v-for="component in availableComponents"
              :key="component.name"
              class="component-item"
              @click="handleSelectComponent(component)"
            >
              {{ component.label }}
            </div>
          </div>
        </div>
        
        <div class="designer-canvas">
          <h4>设计区域</h4>
          <div v-if="currentConfig" class="config-preview">
            <pre>{{ JSON.stringify(currentConfig, null, 2) }}</pre>
          </div>
          <div v-else class="empty-state">
            请从组件库中选择组件开始设计
          </div>
        </div>
        
        <div class="property-panel">
          <h4>属性配置</h4>
          <div v-if="selectedComponent" class="property-form">
            <!-- 属性编辑表单 -->
            <el-form label-width="100px">
              <el-form-item label="组件类型">
                <el-input v-model="selectedComponent.type" disabled />
              </el-form-item>
              <!-- 更多属性配置... -->
            </el-form>
          </div>
          <div v-else class="empty-state">
            请选择组件进行配置
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RenderDesignerProps, RenderComponentConfig } from './types/designer-config'

const props = withDefaults(defineProps<RenderDesignerProps>(), {
  value: null,
  disabled: false,
  availableFields: () => [],
  availableComponents: () => [
    { name: 'el-button', label: '按钮', category: '基础组件' },
    { name: 'el-input', label: '输入框', category: '基础组件' },
    { name: 'el-select', label: '选择器', category: '表单组件' },
    { name: 'div', label: '容器', category: '布局组件' },
    { name: 'span', label: '文本', category: '布局组件' }
  ]
})

const emit = defineEmits<{
  'update:value': [value: RenderComponentConfig | false | null]
  change: [value: RenderComponentConfig | false | null]
}>()

const currentConfig = ref<RenderComponentConfig | false | null>(props.value)
const selectedComponent = ref<RenderComponentConfig | null>(null)

watch(
  () => props.value,
  (newValue) => {
    currentConfig.value = newValue
  },
  { deep: true }
)

watch(currentConfig, (newValue) => {
  emit('update:value', newValue)
  emit('change', newValue)
}, { deep: true })

function handleAddComponent() {
  // 添加组件的逻辑
}

function handleSelectComponent(component: any) {
  // 选择组件的逻辑
  selectedComponent.value = {
    type: component.name,
    props: {},
    key: `component-${Date.now()}`
  }
}
</script>

<style scoped>
.render-designer {
  width: 100%;
  height: 100%;
}

.render-designer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.designer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.designer-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.component-library {
  width: 200px;
  border-right: 1px solid #e4e7ed;
  padding: 12px;
  overflow-y: auto;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item {
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.component-item:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
}

.designer-canvas {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.property-panel {
  width: 300px;
  border-left: 1px solid #e4e7ed;
  padding: 12px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.config-preview {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
