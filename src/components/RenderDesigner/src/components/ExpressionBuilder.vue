<template>
  <div class="expression-builder">
    <div class="expression-row" v-for="(row, index) in expressionRows" :key="index">
      <!-- 字段选择 -->
      <el-select
        v-model="row.field"
        placeholder="选择字段"
        style="width: 120px"
        @change="updateExpression"
      >
        <el-option
          v-for="field in availableFields"
          :key="field.path"
          :label="field.label"
          :value="field.path"
        />
      </el-select>

      <!-- 操作符选择 -->
      <el-select
        v-model="row.operator"
        placeholder="操作符"
        style="width: 100px"
        @change="updateExpression"
      >
        <el-option label="等于" value="eq" />
        <el-option label="不等于" value="ne" />
        <el-option label="大于" value="gt" />
        <el-option label="大于等于" value="gte" />
        <el-option label="小于" value="lt" />
        <el-option label="小于等于" value="lte" />
        <el-option label="包含" value="contains" />
      </el-select>

      <!-- 值输入 -->
      <el-input
        v-if="row.valueType === 'input'"
        v-model="row.value"
        placeholder="输入值"
        style="width: 120px"
        @input="updateExpression"
      />
      <el-select
        v-else-if="row.valueType === 'select'"
        v-model="row.value"
        placeholder="选择值"
        style="width: 120px"
        @change="updateExpression"
      >
        <el-option
          v-for="option in row.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 删除按钮 -->
      <el-button
        v-if="expressionRows.length > 1"
        type="danger"
        text
        size="small"
        @click="removeRow(index)"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>

    <!-- 添加条件按钮 -->
    <el-button
      type="primary"
      text
      size="small"
      @click="addRow"
      style="margin-top: 8px"
    >
      <el-icon><Plus /></el-icon>
      添加条件
    </el-button>

    <!-- 逻辑连接符 -->
    <el-radio-group
      v-if="expressionRows.length > 1"
      v-model="logicOperator"
      size="small"
      style="margin-top: 8px"
      @change="updateExpression"
    >
      <el-radio-button label="and">且</el-radio-button>
      <el-radio-button label="or">或</el-radio-button>
    </el-radio-group>

    <!-- 预览 -->
    <div class="expression-preview" v-if="expressionPreview">
      <el-text type="info" size="small">{{ expressionPreview }}</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { ExpressionNode } from '../types/designer-config'

interface ExpressionRow {
  field: string
  operator: string
  value: any
  valueType: 'input' | 'select'
  options?: Array<{ label: string; value: any }>
}

const props = defineProps<{
  modelValue: ExpressionNode
  availableFields: Array<{ path: string; label: string; type: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ExpressionNode]
}>()

const expressionRows = ref<ExpressionRow[]>([
  {
    field: '',
    operator: 'eq',
    value: '',
    valueType: 'input'
  }
])

const logicOperator = ref<'and' | 'or'>('and')

// 从 ExpressionNode 解析为行数据
function parseExpression(node: ExpressionNode) {
  if (node.type === 'operator' && node.operator === 'and' || node.operator === 'or') {
    logicOperator.value = node.operator
    if (node.children && node.children.length >= 2) {
      expressionRows.value = node.children.map(child => {
        if (child.type === 'operator' && child.children && child.children.length >= 2) {
          return {
            field: child.children[0].field || '',
            operator: child.operator || 'eq',
            value: child.children[1].value || '',
            valueType: 'input'
          }
        }
        return {
          field: '',
          operator: 'eq',
          value: '',
          valueType: 'input'
        }
      })
    }
  } else if (node.type === 'operator') {
    expressionRows.value = [{
      field: node.children?.[0]?.field || '',
      operator: node.operator || 'eq',
      value: node.children?.[1]?.value || '',
      valueType: 'input'
    }]
  }
}

// 初始化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      parseExpression(newValue)
    }
  },
  { immediate: true, deep: true }
)

// 更新表达式
function updateExpression() {
  if (expressionRows.value.length === 0) {
    emit('update:modelValue', {
      type: 'value',
      value: true
    })
    return
  }

  if (expressionRows.value.length === 1) {
    const row = expressionRows.value[0]
    emit('update:modelValue', {
      type: 'operator',
      operator: row.operator,
      children: [
        { type: 'field', field: row.field },
        { type: 'value', value: row.value }
      ]
    })
  } else {
    // 多个条件
    const children = expressionRows.value.map(row => ({
      type: 'operator' as const,
      operator: row.operator,
      children: [
        { type: 'field' as const, field: row.field },
        { type: 'value' as const, value: row.value }
      ]
    }))

    emit('update:modelValue', {
      type: 'operator',
      operator: logicOperator.value,
      children
    })
  }
}

function addRow() {
  expressionRows.value.push({
    field: '',
    operator: 'eq',
    value: '',
    valueType: 'input'
  })
}

function removeRow(index: number) {
  expressionRows.value.splice(index, 1)
  updateExpression()
}

const expressionPreview = computed(() => {
  if (expressionRows.value.length === 0) return ''
  
  const parts = expressionRows.value.map(row => {
    const fieldLabel = props.availableFields.find(f => f.path === row.field)?.label || row.field
    const operatorMap: Record<string, string> = {
      'eq': '===',
      'ne': '!==',
      'gt': '>',
      'gte': '>=',
      'lt': '<',
      'lte': '<=',
      'contains': '包含'
    }
    const operator = operatorMap[row.operator] || row.operator
    return `${fieldLabel} ${operator} ${row.value}`
  })

  const logic = logicOperator.value === 'and' ? ' 且 ' : ' 或 '
  return parts.join(logic)
})
</script>

<style scoped>
.expression-builder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expression-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.expression-preview {
  margin-top: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
