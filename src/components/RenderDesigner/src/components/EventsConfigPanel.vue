<template>
  <div class="events-config-panel">
    <div class="events-list">
      <div
        v-for="(handler, eventName) in localEvents"
        :key="eventName"
        class="event-item"
      >
        <el-card shadow="never">
          <template #header>
            <div class="event-header">
              <span>{{ eventName }}</span>
              <el-button
                type="danger"
                text
                size="small"
                @click="removeEvent(eventName)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>

          <!-- 操作列表 -->
          <div class="actions-list">
            <div
              v-for="(action, index) in handler.actions"
              :key="index"
              class="action-item"
            >
              <el-select
                v-model="action.type"
                placeholder="选择操作类型"
                style="width: 100%; margin-bottom: 8px"
                @change="updateEvents"
              >
                <el-option label="设置字段值" value="setField" />
                <el-option label="调用函数" value="callFunction" />
                <el-option label="显示消息" value="showMessage" />
                <el-option label="导航" value="navigate" />
                <el-option label="发送请求" value="request" />
                <el-option label="自定义代码" value="customCode" />
              </el-select>

              <!-- 设置字段值 -->
              <template v-if="action.type === 'setField'">
                <el-form-item label="目标字段">
                  <el-select
                    v-model="action.setField.field"
                    placeholder="选择字段"
                    style="width: 100%"
                    @change="updateEvents"
                  >
                    <el-option
                      v-for="field in availableFields"
                      :key="field.path"
                      :label="field.label"
                      :value="field.path"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="值">
                  <ExpressionBuilder
                    v-model="action.setField.value"
                    :available-fields="availableFields"
                    @update:model-value="updateEvents"
                  />
                </el-form-item>
              </template>

              <!-- 显示消息 -->
              <template v-else-if="action.type === 'showMessage'">
                <el-form-item label="消息内容">
                  <el-input
                    v-model="action.showMessage.message"
                    placeholder="输入消息内容"
                    @input="updateEvents"
                  />
                </el-form-item>
                <el-form-item label="消息类型">
                  <el-select
                    v-model="action.showMessage.type"
                    placeholder="选择类型"
                    @change="updateEvents"
                  >
                    <el-option label="成功" value="success" />
                    <el-option label="警告" value="warning" />
                    <el-option label="错误" value="error" />
                    <el-option label="信息" value="info" />
                  </el-select>
                </el-form-item>
                <el-form-item label="显示时长(ms)">
                  <el-input-number
                    v-model="action.showMessage.duration"
                    :min="0"
                    @change="updateEvents"
                  />
                </el-form-item>
              </template>

              <!-- 自定义代码 -->
              <template v-else-if="action.type === 'customCode'">
                <el-form-item label="代码">
                  <el-input
                    v-model="action.customCode"
                    type="textarea"
                    :rows="4"
                    placeholder="输入 JavaScript 代码"
                    @input="updateEvents"
                  />
                </el-form-item>
              </template>

              <!-- 删除操作 -->
              <el-button
                type="danger"
                text
                size="small"
                @click="removeAction(eventName, index)"
              >
                <el-icon><Delete /></el-icon>
                删除操作
              </el-button>
            </div>

            <!-- 添加操作 -->
            <el-button
              type="primary"
              text
              @click="addAction(eventName)"
            >
              <el-icon><Plus /></el-icon>
              添加操作
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 添加事件 -->
      <el-button type="primary" @click="showAddEventDialog = true">
        <el-icon><Plus /></el-icon>
        添加事件
      </el-button>
    </div>

    <!-- 添加事件对话框 -->
    <el-dialog v-model="showAddEventDialog" title="添加事件" width="400px">
      <el-form label-width="80px">
        <el-form-item label="事件名">
          <el-select v-model="newEventName" placeholder="选择事件">
            <el-option label="点击" value="click" />
            <el-option label="改变" value="change" />
            <el-option label="输入" value="input" />
            <el-option label="聚焦" value="focus" />
            <el-option label="失焦" value="blur" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddEventDialog = false">取消</el-button>
        <el-button type="primary" @click="addEvent">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import ExpressionBuilder from './ExpressionBuilder.vue'
import type { EventHandlerConfig, ExpressionNode } from '../types/designer-config'

const props = defineProps<{
  modelValue: Record<string, EventHandlerConfig> | undefined
  availableFields: Array<{ path: string; label: string; type: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, EventHandlerConfig> | undefined]
}>()

const localEvents = ref<Record<string, EventHandlerConfig>>({})
const showAddEventDialog = ref(false)
const newEventName = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    localEvents.value = newValue ? { ...newValue } : {}
  },
  { immediate: true, deep: true }
)

function updateEvents() {
  const cleaned: Record<string, EventHandlerConfig> = {}
  for (const [key, value] of Object.entries(localEvents.value)) {
    if (value && value.actions && value.actions.length > 0) {
      cleaned[key] = value
    }
  }
  emit('update:modelValue', Object.keys(cleaned).length > 0 ? cleaned : undefined)
}

function addEvent() {
  if (!newEventName.value) return
  localEvents.value[newEventName.value] = {
    eventType: newEventName.value as any,
    actions: []
  }
  updateEvents()
  showAddEventDialog.value = false
  newEventName.value = ''
}

function removeEvent(eventName: string) {
  delete localEvents.value[eventName]
  updateEvents()
}

function addAction(eventName: string) {
  if (!localEvents.value[eventName]) {
    localEvents.value[eventName] = {
      eventType: eventName as any,
      actions: []
    }
  }
  localEvents.value[eventName].actions.push({
    type: 'setField',
    setField: {
      field: '',
      value: { type: 'value', value: '' } as ExpressionNode
    }
  })
  updateEvents()
}

function removeAction(eventName: string, index: number) {
  if (localEvents.value[eventName] && localEvents.value[eventName].actions) {
    localEvents.value[eventName].actions.splice(index, 1)
    updateEvents()
  }
}
</script>

<style scoped>
.events-config-panel {
  padding: 16px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  width: 100%;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  padding: 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
