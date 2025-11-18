<script setup lang="ts">
import { ElTabs } from 'element-plus'
import { computed, useAttrs, ref, watch, provide } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  fillHeight: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: false
  },
  keepAlive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'tab-click',
  'tab-change',
  'tab-remove',
  'tab-add',
  'edit'
])

const getBindValue = computed(() => {
  const delArr: string[] = ['fillHeight', 'lazy', 'keepAlive']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

// 判断标签页是否应该显示（用于 v-show）
const shouldShowTab = (name: string | number) => {
  return props.modelValue === name
}

// 跟踪已加载的标签页（仅用于调试和外部访问）
const loadedTabs = ref<Set<string | number>>(new Set())

// 监听 modelValue 变化，记录已加载的标签页
watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      loadedTabs.value.add(newVal)
    }
  },
  { immediate: true }
)

// 处理事件转发
const handleTabClick = (pane: any, ev: Event) => {
  emit('tab-click', pane, ev)
}

const handleTabChange = (name: string | number) => {
  emit('update:modelValue', name)
  emit('tab-change', name)
}

const handleTabRemove = (name: string | number) => {
  emit('tab-remove', name)
}

const handleTabAdd = () => {
  emit('tab-add')
}

const handleEdit = (targetName: string | number | undefined, action: 'add' | 'remove') => {
  emit('edit', targetName, action)
}

// 提供给子组件使用
provide('shouldShowTab', shouldShowTab)
provide(
  'parentLazy',
  computed(() => props.lazy)
)
provide(
  'parentKeepAlive',
  computed(() => props.keepAlive)
)

// 暴露方法供外部使用
defineExpose({
  shouldShowTab,
  loadedTabs
})
</script>

<template>
  <ElTabs
    v-bind="getBindValue"
    :model-value="modelValue"
    :class="{ 'ae-tabs-fill-height': fillHeight }"
    class="ae-tabs"
    @tab-click="handleTabClick"
    @tab-change="handleTabChange"
    @tab-remove="handleTabRemove"
    @tab-add="handleTabAdd"
    @edit="handleEdit"
  >
    <slot></slot>
  </ElTabs>
</template>

<style lang="less">
.ae-tabs {
  &.ae-tabs-fill-height {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      flex-shrink: 0;
      margin-bottom: 0;
    }

    .el-tabs__content {
      flex: 1;
      height: 0;
      overflow: hidden;
    }

    .el-tab-pane {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
