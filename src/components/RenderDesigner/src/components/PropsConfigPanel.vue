<template>
  <div class="props-config-panel">
    <el-form label-width="100px" label-position="left">
      <!-- 根据组件类型显示不同的属性 -->
      <template v-if="componentType === 'el-button'">
        <el-form-item label="按钮类型">
          <el-select v-model="localProps.type" placeholder="选择类型" clearable>
            <el-option label="默认" value="default" />
            <el-option label="主要" value="primary" />
            <el-option label="成功" value="success" />
            <el-option label="警告" value="warning" />
            <el-option label="危险" value="danger" />
            <el-option label="信息" value="info" />
            <el-option label="文本" value="text" />
          </el-select>
        </el-form-item>
        <el-form-item label="按钮大小">
          <el-select v-model="localProps.size" placeholder="选择大小" clearable>
            <el-option label="默认" value="default" />
            <el-option label="大" value="large" />
            <el-option label="小" value="small" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="localProps.disabled" />
        </el-form-item>
        <el-form-item label="是否加载">
          <el-switch v-model="localProps.loading" />
        </el-form-item>
      </template>

      <template v-else-if="componentType === 'el-input'">
        <el-form-item label="占位符">
          <el-input v-model="localProps.placeholder" placeholder="输入占位符" />
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="localProps.disabled" />
        </el-form-item>
        <el-form-item label="是否只读">
          <el-switch v-model="localProps.readonly" />
        </el-form-item>
        <el-form-item label="是否清除">
          <el-switch v-model="localProps.clearable" />
        </el-form-item>
        <el-form-item label="最大长度">
          <el-input-number v-model="localProps.maxlength" :min="0" />
        </el-form-item>
      </template>

      <template v-else-if="componentType === 'el-select'">
        <el-form-item label="占位符">
          <el-input v-model="localProps.placeholder" placeholder="输入占位符" />
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="localProps.disabled" />
        </el-form-item>
        <el-form-item label="是否多选">
          <el-switch v-model="localProps.multiple" />
        </el-form-item>
        <el-form-item label="是否清除">
          <el-switch v-model="localProps.clearable" />
        </el-form-item>
      </template>

      <!-- 通用属性 -->
      <el-divider>表达式属性</el-divider>
      <div v-for="(value, key) in expressionProps" :key="key" class="expression-prop-item">
        <el-form-item :label="key">
          <div class="prop-value-editor">
            <el-radio-group v-model="propValueTypes[key]" size="small">
              <el-radio-button label="static">静态</el-radio-button>
              <el-radio-button label="expression">表达式</el-radio-button>
            </el-radio-group>
            <el-input
              v-if="propValueTypes[key] === 'static'"
              v-model="localProps[key]"
              placeholder="输入值"
              @input="updateProps"
            />
            <ExpressionBuilder
              v-else
              :model-value="localProps[key]"
              :available-fields="availableFields"
              @update:model-value="(val) => { localProps[key] = val; updateProps() }"
            />
          </div>
        </el-form-item>
      </div>

      <!-- 添加表达式属性 -->
      <el-form-item>
        <el-button type="primary" text @click="showAddPropDialog = true">
          <el-icon><Plus /></el-icon>
          添加表达式属性
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 添加属性对话框 -->
    <el-dialog v-model="showAddPropDialog" title="添加属性" width="400px">
      <el-form label-width="80px">
        <el-form-item label="属性名">
          <el-input v-model="newPropName" placeholder="输入属性名" />
        </el-form-item>
        <el-form-item label="属性值">
          <ExpressionBuilder
            v-model="newPropValue"
            :available-fields="availableFields"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddPropDialog = false">取消</el-button>
        <el-button type="primary" @click="addProp">确定</el-button>
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
  modelValue: Record<string, any>
  componentType: string
  availableFields: Array<{ path: string; label: string; type: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const localProps = ref<Record<string, any>>({})
const propValueTypes = ref<Record<string, 'static' | 'expression'>>({})
const showAddPropDialog = ref(false)
const newPropName = ref('')
const newPropValue = ref<ExpressionNode>({
  type: 'value',
  value: ''
})

// 表达式属性（非标准属性）
const expressionProps = computed(() => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(localProps.value)) {
    if (typeof value === 'object' && value !== null && 'type' in value) {
      result[key] = value
      if (!propValueTypes.value[key]) {
        propValueTypes.value[key] = 'expression'
      }
    }
  }
  return result
})

watch(
  () => props.modelValue,
  (newValue) => {
    localProps.value = { ...newValue }
    // 初始化属性值类型
    for (const [key, value] of Object.entries(localProps.value)) {
      if (typeof value === 'object' && value !== null && 'type' in value) {
        propValueTypes.value[key] = 'expression'
      } else {
        propValueTypes.value[key] = 'static'
      }
    }
  },
  { immediate: true, deep: true }
)

function updateProps() {
  emit('update:modelValue', { ...localProps.value })
}

function addProp() {
  if (!newPropName.value) return
  localProps.value[newPropName.value] = newPropValue.value
  propValueTypes.value[newPropName.value] = 'expression'
  updateProps()
  showAddPropDialog.value = false
  newPropName.value = ''
  newPropValue.value = { type: 'value', value: '' }
}
</script>

<style scoped>
.props-config-panel {
  padding: 16px;
}

.expression-prop-item {
  margin-bottom: 16px;
}

.prop-value-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
