<template>
  <div class="tooltip-header flex flex-col w-full" style="line-height: 1">
    <span class="tooltip-header-title">{{ title }}</span>
    <el-tooltip v-if="subtitle" :content="subtitle" :disabled="!isOverflow" placement="top">
      <div
        ref="subtitleRef"
        class="tooltip-header-subtitle font-400 text-nowrap text-ellipsis overflow-hidden mt-1"
        style="font-size: clamp(12px, calc(1em - 1px), 16px)"
        @mouseenter="checkOverflowOnHover"
      >
        {{ subtitle }}
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

const props = defineProps<Props>()

const subtitleRef = ref<HTMLElement>()
const isOverflow = ref(false)
const hasChecked = ref(false)

// 只在鼠标悬停时检测溢出，避免不必要的计算
const checkOverflowOnHover = () => {
  if (!subtitleRef.value || !props.subtitle || hasChecked.value) return

  const element = subtitleRef.value
  isOverflow.value = element.scrollWidth > element.clientWidth
  hasChecked.value = true
}

// 当 subtitle 变化时重置检测状态
watch(
  () => props.subtitle,
  () => {
    hasChecked.value = false
    isOverflow.value = false
  }
)
</script>
