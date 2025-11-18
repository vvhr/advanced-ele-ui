<script setup lang="ts">
import { ElTabPane } from 'element-plus'
import { computed, useAttrs, inject, ref, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  name: {
    type: [String, Number],
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: undefined
  }
})

const getBindValue = computed(() => {
  const delArr: string[] = ['lazy']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

// 从父组件注入的方法和属性
const shouldShowTab = inject<(name: string | number) => boolean>('shouldShowTab', () => true)
const parentLazy = inject<boolean>('parentLazy', false)
const parentKeepAlive = inject<boolean>('parentKeepAlive', true)

// 确定是否使用懒加载（优先使用自身的 lazy 属性，否则使用父组件的）
const isLazy = computed(() => {
  return props.lazy !== undefined ? props.lazy : parentLazy
})

// 是否已经渲染过
const hasRendered = ref(false)

// 当前是否显示
const isCurrentlyVisible = computed(() => shouldShowTab(props.name))

// 监听是否应该显示，更新渲染状态
watch(
  isCurrentlyVisible,
  shouldShow => {
    if (shouldShow && isLazy.value) {
      hasRendered.value = true
    }
  },
  { immediate: true }
)

// 如果不使用 keep-alive，在隐藏时重置渲染状态
watch(isCurrentlyVisible, shouldShow => {
  if (!shouldShow && !parentKeepAlive && isLazy.value) {
    hasRendered.value = false
  }
})

// 判断是否应该渲染
const shouldRender = computed(() => {
  if (!isLazy.value) {
    return true
  }
  return hasRendered.value
})

// 判断是否应该显示
const isVisible = computed(() => {
  if (!isLazy.value) return true
  return isCurrentlyVisible.value
})
</script>

<template>
  <ElTabPane v-bind="getBindValue">
    <template v-if="shouldRender">
      <div v-show="isVisible" class="ae-tab-pane-content">
        <slot></slot>
      </div>
    </template>
  </ElTabPane>
</template>

<style lang="less">
.ae-tab-pane-content {
  height: 100%;
}
</style>
