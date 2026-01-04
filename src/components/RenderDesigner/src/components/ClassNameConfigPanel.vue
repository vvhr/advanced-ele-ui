<template>
  <div class="className-config-panel">
    <el-form label-width="100px" label-position="left">
      <el-form-item label="类名类型">
        <el-radio-group v-model="classNameType" @change="updateClassName">
          <el-radio-button label="static">静态</el-radio-button>
          <el-radio-button label="expression">表达式</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="classNameType === 'static'" label="类名">
        <el-input
          v-model="staticClassName"
          placeholder="输入 CSS 类名，多个用空格分隔"
          @input="updateClassName"
        />
      </el-form-item>

      <el-form-item v-else label="表达式">
        <ExpressionBuilder
          v-model="expressionClassName"
          :available-fields="availableFields"
          @update:model-value="updateClassName"
        />
      </el-form-item>

      <el-form-item label="预览">
        <el-text type="info" size="small">
          {{ classNamePreview }}
        </el-text>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ExpressionBuilder from './ExpressionBuilder.vue'
import type { ExpressionNode } from '../types/designer-config'

const props = defineProps<{
  modelValue: string | ExpressionNode | undefined
  availableFields: Array<{ path: string; label: string; type: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | ExpressionNode | undefined]
}>()

const classNameType = ref<'static' | 'expression'>('static')
const staticClassName = ref('')
const expressionClassName = ref<ExpressionNode>({
  type: 'value',
  value: ''
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      classNameType.value = 'static'
      staticClassName.value = ''
      return
    }
    if (typeof newValue === 'string') {
      classNameType.value = 'static'
      staticClassName.value = newValue
    } else if (typeof newValue === 'object' && 'type' in newValue) {
      classNameType.value = 'expression'
      expressionClassName.value = newValue
    }
  },
  { immediate: true }
)

function updateClassName() {
  if (classNameType.value === 'static') {
    emit('update:modelValue', staticClassName.value || undefined)
  } else {
    emit('update:modelValue', expressionClassName.value)
  }
}

const classNamePreview = computed(() => {
  if (classNameType.value === 'static') {
    return staticClassName.value || '未设置'
  } else {
    return '动态类名（根据表达式计算）'
  }
})
</script>

<style scoped>
.className-config-panel {
  padding: 16px;
}
</style>
