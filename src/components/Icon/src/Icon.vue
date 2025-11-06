<script setup lang="ts">
import { computed, unref } from 'vue'
import { ElIcon } from 'element-plus'
import { Icon as IconifyIcon } from '@iconify/vue'

const props = defineProps({
  // icon name
  icon: {
    type: String,
    required: true
  },
  // icon color
  color: {
    type: String
  },
  // icon size
  size: {
    type: [String, Number],
    default: 16
  }
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon
})

const iconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: typeof size === 'number' ? `${size}px` : size,
    color
  }
})
</script>

<template>
  <ElIcon :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <IconifyIcon v-else :icon="symbolId" :style="iconifyStyle" :class="$attrs.class" />
  </ElIcon>
</template>
