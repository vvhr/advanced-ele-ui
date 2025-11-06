<template>
  <span
    ref="switchContainer"
    class="sensitive-switch"
    tabindex="0"
    role="button"
    :aria-label="isHovering ? `原始值: ${originValue}` : `已加密值: ${cryptoValue}`"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <template v-if="isHovering">
      <span class="origin-value" aria-hidden="true">{{ originValue }}</span>
    </template>
    <template v-else>
      <span class="crypto-value" aria-hidden="true">{{ cryptoValue }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义组件的 props
interface Props {
  originValue: string | number // 原始的、敏感的值
  cryptoValue: string | number // 加密或脱敏后的值，默认显示
  enable: boolean // 是否允许敏感信息显示
}

const props = defineProps<Props>()

// 响应式状态：用于跟踪鼠标是否悬停在组件上
const isHovering = ref(false)

/**
 * 鼠标进入时触发，设置 isHovering 为 true
 * 同时将 focus 状态也更新为 true
 */
const handleMouseEnter = () => {
  if (props.enable) isHovering.value = true
}

/**
 * 鼠标离开时触发，设置 isHovering 为 false
 * 同时将 focus 状态也更新为 false
 */
const handleMouseLeave = () => {
  if (props.enable) isHovering.value = false
}

/**
 * 键盘焦点进入（例如 Tab 键）时触发，设置 isHovering 为 true
 */
const handleFocusIn = () => {
  if (props.enable) isHovering.value = true
}

/**
 * 键盘焦点移出时触发，设置 isHovering 为 false
 */
const handleFocusOut = () => {
  if (props.enable) isHovering.value = false
}
</script>

<style scoped>
.sensitive-switch {
  display: inline-block; /* 或者 block，根据你的布局需求 */
  cursor: pointer;
  outline: none; /* 移除默认轮廓，下面通过 :focus 添加自定义轮廓 */
}
</style>
