<template>
  <div class="children-config-panel">
    <el-form label-width="100px" label-position="left">
      <el-form-item label="内容类型">
        <el-radio-group v-model="childrenType" @change="updateChildren">
          <el-radio-button label="text">文本</el-radio-button>
          <el-radio-button label="expression">表达式</el-radio-button>
          <el-radio-button label="component">组件</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 文本内容 -->
      <el-form-item v-if="childrenType === 'text'" label="文本内容">
        <el-input
          v-model="textChildren"
          type="textarea"
          :rows="3"
          placeholder="输入文本内容"
          @input="updateChildren"
        />
      </el-form-item>

      <!-- 表达式内容 -->
      <el-form-item v-else-if="childrenType === 'expression'" label="表达式">
        <ExpressionBuilder
          v-model="expressionChildren"
          :available-fields="availableFields"
          @update:model-value="updateChildren"
        />
      </el-form-item>

      <!-- 组件内容 -->
      <template v-else-if="childrenType === 'component'">
        <el-form-item label="子组件">
          <div v-if="componentChildren.length === 0" class="empty-children">
            <el-text type="info">暂无子组件</el-text>
          </div>
          <div v-else class="children-list">
            <div
              v-for="(child, index) in componentChildren"
              :key="index"
              class="child-item"
            >
              <el-card shadow="never">
                <template #header>
                  <div class="child-header">
                    <span>{{ getComponentLabel(child.type) }}</span>
                    <el-button
                      type="danger"
                      text
                      size="small"
                      @click="removeChild(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </template>
                <div class="child-config-summary">
                  <el-text type="info" size="small">
                    {{ getComponentLabel(child.type) }}
                    <span v-if="child.condition">（有条件）</span>
                    <span v-if="child.events && Object.keys(child.events).length > 0">
                      （{{ Object.keys(child.events).length }}个事件）
                    </span>
                  </el-text>
                  <el-button
                    type="primary"
                    text
                    size="small"
                    @click="editChild(index)"
                  >
                    编辑
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>
          <el-button type="primary" text @click="showAddChildDialog = true">
            <el-icon><Plus /></el-icon>
            添加子组件
          </el-button>
        </el-form-item>
      </template>
    </el-form>

    <!-- 添加子组件对话框 -->
    <el-dialog v-model="showAddChildDialog" title="添加子组件" width="400px">
      <el-form label-width="80px">
        <el-form-item label="组件类型">
          <el-select v-model="newChildType" placeholder="选择组件类型">
            <el-option-group label="Element Plus 组件">
              <el-option
                v-for="comp in availableComponents.filter(c => c.value.startsWith('el-'))"
                :key="comp.value"
                :label="comp.label"
                :value="comp.value"
              />
            </el-option-group>
            <el-option-group label="HTML 标签">
              <el-option
                v-for="tag in availableComponents.filter(c => !c.value.startsWith('el-'))"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddChildDialog = false">取消</el-button>
        <el-button type="primary" @click="addChild">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import ExpressionBuilder from './ExpressionBuilder.vue'
import type { RenderComponentConfig, ExpressionNode } from '../types/designer-config'

const props = defineProps<{
  modelValue: string | ExpressionNode | RenderComponentConfig | RenderComponentConfig[] | undefined
  availableFields: Array<{ path: string; label: string; type: string }>
  availableComponents: Array<{ name: string; label: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | ExpressionNode | RenderComponentConfig | RenderComponentConfig[] | undefined]
}>()

const childrenType = ref<'text' | 'expression' | 'component'>('text')
const textChildren = ref('')
const expressionChildren = ref<ExpressionNode>({
  type: 'value',
  value: ''
})
const componentChildren = ref<RenderComponentConfig[]>([])
const showAddChildDialog = ref(false)
const newChildType = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      childrenType.value = 'text'
      textChildren.value = ''
      return
    }
    if (typeof newValue === 'string') {
      childrenType.value = 'text'
      textChildren.value = newValue
    } else if (typeof newValue === 'object' && 'type' in newValue) {
      if ('field' in newValue || 'operator' in newValue || 'functionName' in newValue) {
        childrenType.value = 'expression'
        expressionChildren.value = newValue as ExpressionNode
      } else {
        childrenType.value = 'component'
        if (Array.isArray(newValue)) {
          componentChildren.value = [...newValue]
        } else {
          componentChildren.value = [newValue as RenderComponentConfig]
        }
      }
    }
  },
  { immediate: true, deep: true }
)

function updateChildren() {
  if (childrenType.value === 'text') {
    emit('update:modelValue', textChildren.value || undefined)
  } else if (childrenType.value === 'expression') {
    emit('update:modelValue', expressionChildren.value)
  } else {
    emit('update:modelValue', componentChildren.value.length > 0 ? componentChildren.value : undefined)
  }
}

function addChild() {
  if (!newChildType.value) return
  componentChildren.value.push({
    type: newChildType.value,
    props: {}
  })
  updateChildren()
  showAddChildDialog.value = false
  newChildType.value = ''
}

function removeChild(index: number) {
  componentChildren.value.splice(index, 1)
  updateChildren()
}

function getComponentLabel(type: string): string {
  const comp = props.availableComponents.find(c => c.name === type)
  return comp?.label || type
}

function editChild(index: number) {
  // 这里可以打开一个对话框来编辑子组件
  // 为了简化，暂时只显示提示
  ElMessage.info('子组件编辑功能需要单独实现')
}
</script>

<style scoped>
.children-config-panel {
  padding: 16px;
}

.empty-children {
  padding: 20px;
  text-align: center;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.child-item {
  width: 100%;
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.child-config-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}
</style>
