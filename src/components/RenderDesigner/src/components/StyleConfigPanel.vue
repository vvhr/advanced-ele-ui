<template>
  <div class="style-config-panel">
    <el-form label-width="100px" label-position="left">
      <!-- 常用样式 -->
      <el-form-item label="宽度">
        <el-input v-model="localStyle.width" placeholder="如: 100px, 50%" />
      </el-form-item>
      <el-form-item label="高度">
        <el-input v-model="localStyle.height" placeholder="如: 100px" />
      </el-form-item>
      <el-form-item label="内边距">
        <el-input v-model="localStyle.padding" placeholder="如: 10px" />
      </el-form-item>
      <el-form-item label="外边距">
        <el-input v-model="localStyle.margin" placeholder="如: 10px" />
      </el-form-item>
      <el-form-item label="字体大小">
        <el-input v-model="localStyle.fontSize" placeholder="如: 14px" />
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="localStyle.color" />
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="localStyle.backgroundColor" />
      </el-form-item>
      <el-form-item label="边框">
        <el-input v-model="localStyle.border" placeholder="如: 1px solid #ddd" />
      </el-form-item>
      <el-form-item label="圆角">
        <el-input v-model="localStyle.borderRadius" placeholder="如: 4px" />
      </el-form-item>
      <el-form-item label="文本对齐">
        <el-select v-model="localStyle.textAlign" placeholder="选择对齐方式" clearable>
          <el-option label="左对齐" value="left" />
          <el-option label="居中" value="center" />
          <el-option label="右对齐" value="right" />
        </el-select>
      </el-form-item>

      <el-divider>表达式样式</el-divider>
      <div v-for="(value, key) in expressionStyles" :key="key" class="expression-style-item">
        <el-form-item :label="key">
          <div class="style-value-editor">
            <el-radio-group v-model="styleValueTypes[key]" size="small">
              <el-radio-button label="static">静态</el-radio-button>
              <el-radio-button label="expression">表达式</el-radio-button>
            </el-radio-group>
            <el-input
              v-if="styleValueTypes[key] === 'static'"
              v-model="localStyle[key]"
              placeholder="输入值"
              @input="updateStyle"
            />
            <ExpressionBuilder
              v-else
              :model-value="localStyle[key]"
              :available-fields="availableFields"
              @update:model-value="(val) => { localStyle[key] = val; updateStyle() }"
            />
          </div>
        </el-form-item>
      </div>

      <!-- 添加表达式样式 -->
      <el-form-item>
        <el-button type="primary" text @click="showAddStyleDialog = true">
          <el-icon><Plus /></el-icon>
          添加表达式样式
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 添加样式对话框 -->
    <el-dialog v-model="showAddStyleDialog" title="添加样式" width="400px">
      <el-form label-width="80px">
        <el-form-item label="样式名">
          <el-input v-model="newStyleName" placeholder="如: fontSize" />
        </el-form-item>
        <el-form-item label="样式值">
          <ExpressionBuilder
            v-model="newStyleValue"
            :available-fields="availableFields"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddStyleDialog = false">取消</el-button>
        <el-button type="primary" @click="addStyle">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ExpressionBuilder from './ExpressionBuilder.vue'
import type { ExpressionNode } from '../types/designer-config'

const props = defineProps<{
  modelValue: Record<string, string | number | ExpressionNode>
  availableFields: Array<{ path: string; label: string; type: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string | number | ExpressionNode>]
}>()

const localStyle = ref<Record<string, any>>({})
const styleValueTypes = ref<Record<string, 'static' | 'expression'>>({})
const showAddStyleDialog = ref(false)
const newStyleName = ref('')
const newStyleValue = ref<ExpressionNode>({
  type: 'value',
  value: ''
})

const expressionStyles = computed(() => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(localStyle.value)) {
    if (typeof value === 'object' && value !== null && 'type' in value) {
      result[key] = value
      if (!styleValueTypes.value[key]) {
        styleValueTypes.value[key] = 'expression'
      }
    }
  }
  return result
})

watch(
  () => props.modelValue,
  (newValue) => {
    localStyle.value = { ...newValue }
    for (const [key, value] of Object.entries(localStyle.value)) {
      if (typeof value === 'object' && value !== null && 'type' in value) {
        styleValueTypes.value[key] = 'expression'
      } else {
        styleValueTypes.value[key] = 'static'
      }
    }
  },
  { immediate: true, deep: true }
)

function updateStyle() {
  // 清理空值
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(localStyle.value)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value
    }
  }
  emit('update:modelValue', cleaned)
}

function addStyle() {
  if (!newStyleName.value) return
  localStyle.value[newStyleName.value] = newStyleValue.value
  styleValueTypes.value[newStyleName.value] = 'expression'
  updateStyle()
  showAddStyleDialog.value = false
  newStyleName.value = ''
  newStyleValue.value = { type: 'value', value: '' }
}
</script>

<style scoped>
.style-config-panel {
  padding: 16px;
}

.expression-style-item {
  margin-bottom: 16px;
}

.style-value-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
