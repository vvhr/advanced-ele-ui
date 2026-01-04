<template>
  <div class="render-designer-wrapper">
    <!-- 预览区域（弹窗外显示） -->
    <div class="render-designer-preview" @click="handleEdit">
      <div v-if="previewContent" class="preview-content" v-html="previewContent"></div>
      <div v-else class="preview-placeholder">
        <el-icon><Plus /></el-icon>
        <span>点击配置 Render</span>
      </div>
      <el-button
        class="edit-button"
        type="primary"
        size="small"
        text
        @click.stop="handleEdit"
      >
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
    </div>

    <!-- 配置弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="配置 Render 属性"
      width="800px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <div class="render-designer-dialog">
        <!-- 左侧：组件选择 -->
        <div class="designer-sidebar">
          <div class="section-title">组件类型</div>
          <el-select
            v-model="currentConfig.type"
            placeholder="选择组件类型"
            style="width: 100%"
            @change="handleComponentTypeChange"
          >
            <el-option-group label="Element Plus 组件">
              <el-option
                v-for="comp in elementPlusComponents"
                :key="comp.value"
                :label="comp.label"
                :value="comp.value"
              >
                <span>{{ comp.label }}</span>
                <span class="component-tag">{{ comp.value }}</span>
              </el-option>
            </el-option-group>
            <el-option-group label="HTML 标签">
              <el-option
                v-for="tag in htmlTags"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value"
              >
                <span>{{ tag.label }}</span>
                <span class="component-tag">{{ tag.value }}</span>
              </el-option>
            </el-option-group>
          </el-select>

          <!-- 条件配置 -->
          <div class="config-section">
            <div class="section-title">
              <el-checkbox v-model="hasCondition">渲染条件</el-checkbox>
            </div>
            <ExpressionBuilder
              v-if="hasCondition"
              v-model="currentConfig.condition.expression"
              :available-fields="availableFields"
            />
          </div>
        </div>

        <!-- 右侧：属性配置 -->
        <div class="designer-main">
          <el-tabs v-model="activeTab">
            <!-- 基础属性 -->
            <el-tab-pane label="属性" name="props">
              <PropsConfigPanel
                v-model="currentConfig.props"
                :component-type="currentConfig.type"
                :available-fields="availableFields"
              />
            </el-tab-pane>

            <!-- 样式 -->
            <el-tab-pane label="样式" name="style">
              <StyleConfigPanel
                v-model="currentConfig.style"
                :available-fields="availableFields"
              />
            </el-tab-pane>

            <!-- 类名 -->
            <el-tab-pane label="类名" name="className">
              <ClassNameConfigPanel
                v-model="currentConfig.className"
                :available-fields="availableFields"
              />
            </el-tab-pane>

            <!-- 子级内容 -->
            <el-tab-pane label="内容" name="children">
              <ChildrenConfigPanel
                v-model="currentConfig.children"
                :available-fields="availableFields"
                :available-components="allComponents"
              />
            </el-tab-pane>

            <!-- 事件 -->
            <el-tab-pane label="事件" name="events">
              <EventsConfigPanel
                v-model="currentConfig.events"
                :available-fields="availableFields"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Edit, Plus } from '@element-plus/icons-vue'
import type { RenderDesignerProps, RenderComponentConfig } from './types/designer-config'
import ExpressionBuilder from './components/ExpressionBuilder.vue'
import PropsConfigPanel from './components/PropsConfigPanel.vue'
import StyleConfigPanel from './components/StyleConfigPanel.vue'
import ClassNameConfigPanel from './components/ClassNameConfigPanel.vue'
import ChildrenConfigPanel from './components/ChildrenConfigPanel.vue'
import EventsConfigPanel from './components/EventsConfigPanel.vue'
import { generatePreview } from './utils/preview-generator'

const props = withDefaults(defineProps<RenderDesignerProps>(), {
  value: null,
  disabled: false,
  availableFields: () => [],
  availableComponents: () => []
})

const emit = defineEmits<{
  'update:value': [value: RenderComponentConfig | false | null]
  change: [value: RenderComponentConfig | false | null]
}>()

const dialogVisible = ref(false)
const activeTab = ref('props')

// Element Plus 组件列表
const elementPlusComponents = [
  { label: '按钮', value: 'el-button' },
  { label: '输入框', value: 'el-input' },
  { label: '选择器', value: 'el-select' },
  { label: '日期选择器', value: 'el-date-picker' },
  { label: '开关', value: 'el-switch' },
  { label: '单选框', value: 'el-radio' },
  { label: '复选框', value: 'el-checkbox' },
  { label: '图标', value: 'el-icon' },
  { label: '标签', value: 'el-tag' },
  { label: '徽章', value: 'el-badge' },
  { label: '链接', value: 'el-link' }
]

// HTML 标签列表
const htmlTags = [
  { label: '标题1', value: 'h1' },
  { label: '标题2', value: 'h2' },
  { label: '标题3', value: 'h3' },
  { label: '段落', value: 'p' },
  { label: '文本', value: 'span' },
  { label: '文本节点', value: 'text' },
  { label: '容器', value: 'div' },
  { label: '强调', value: 'strong' },
  { label: '斜体', value: 'em' },
  { label: '代码', value: 'code' }
]

const allComponents = [...elementPlusComponents, ...htmlTags]

// 当前配置（编辑时的临时配置）
const currentConfig = ref<RenderComponentConfig>({
  type: 'el-button',
  props: {},
  condition: {
    expression: {
      type: 'operator',
      operator: 'eq',
      children: [
        { type: 'field', field: 'formModel.type' },
        { type: 'value', value: 1 }
      ]
    }
  }
})

const hasCondition = computed({
  get: () => !!currentConfig.value.condition,
  set: (val) => {
    if (val) {
      if (!currentConfig.value.condition) {
        currentConfig.value.condition = {
          expression: {
            type: 'operator',
            operator: 'eq',
            children: [
              { type: 'field', field: 'formModel.type' },
              { type: 'value', value: 1 }
            ]
          }
        }
      }
    } else {
      delete currentConfig.value.condition
    }
  }
})

// 预览内容
const previewContent = computed(() => {
  if (!props.value) return null
  return generatePreview(props.value as RenderComponentConfig)
})

// 初始化当前配置
watch(
  () => props.value,
  (newValue) => {
    if (newValue && typeof newValue === 'object' && 'type' in newValue) {
      currentConfig.value = JSON.parse(JSON.stringify(newValue))
    } else {
      currentConfig.value = {
        type: 'el-button',
        props: {}
      }
    }
  },
  { immediate: true, deep: true }
)

function handleEdit() {
  if (props.disabled) return
  // 初始化当前配置
  if (props.value && typeof props.value === 'object' && 'type' in props.value) {
    currentConfig.value = JSON.parse(JSON.stringify(props.value))
  }
  dialogVisible.value = true
}

function handleDialogClose() {
  // 关闭时恢复原始配置
  if (props.value && typeof props.value === 'object' && 'type' in props.value) {
    currentConfig.value = JSON.parse(JSON.stringify(props.value))
  }
}

function handleCancel() {
  dialogVisible.value = false
}

function handleConfirm() {
  const config = JSON.parse(JSON.stringify(currentConfig.value))
  // 清理空值
  if (!config.condition || !config.condition.expression) {
    delete config.condition
  }
  if (!config.props || Object.keys(config.props).length === 0) {
    delete config.props
  }
  if (!config.style || Object.keys(config.style).length === 0) {
    delete config.style
  }
  if (!config.events || Object.keys(config.events).length === 0) {
    delete config.events
  }

  emit('update:value', config)
  emit('change', config)
  dialogVisible.value = false
}

function handleComponentTypeChange() {
  // 切换组件类型时，重置一些不兼容的属性
  if (currentConfig.value.props) {
    // 可以根据组件类型设置默认属性
  }
}
</script>

<style scoped>
.render-designer-wrapper {
  width: 100%;
}

.render-designer-preview {
  position: relative;
  min-height: 60px;
  padding: 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}

.render-designer-preview:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.preview-content {
  min-height: 36px;
  display: flex;
  align-items: center;
  padding-right: 60px;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
  min-height: 36px;
}

.edit-button {
  position: absolute;
  top: 8px;
  right: 8px;
}

.render-designer-dialog {
  display: flex;
  gap: 16px;
  min-height: 500px;
}

.designer-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.designer-main {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.config-section {
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.component-tag {
  float: right;
  color: #909399;
  font-size: 12px;
}
</style>
