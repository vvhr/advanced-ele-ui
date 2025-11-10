<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  value: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'primary' | 'success' | 'info' | 'warning' | 'danger'>,
    default: 'primary'
  },
  color: {
    type: String,
    default: ''
  },
  hit: {
    type: Boolean,
    default: false
  },
  effect: {
    type: String as PropType<'dark' | 'light' | 'plain'>,
    default: 'dark'
  },
  round: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <el-tag :effect="effect" :hit="hit" round class="dot-tag" :type="type">
    <span class="dot-tag__dot" :class="{ [type]: true }"></span>
    <span class="dot-tag__text">{{ value }}</span>
  </el-tag>
</template>

<style scoped lang="less">
.dot-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  .dot-tag__text {
    color: #878787;
  }
  .dot-tag__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 4px;

    &.primary {
      background-color: var(--el-color-primary);
      box-shadow: 0 0 4px var(--el-color-primary-light-3);
    }
    &.success {
      background-color: var(--el-color-success);
      box-shadow: 0 0 4px var(--el-color-success-light-3);
    }
    &.info {
      background-color: var(--el-color-info);
      box-shadow: 0 0 4px var(--el-color-info-light-3);
    }
    &.warning {
      background-color: var(--el-color-warning);
      box-shadow: 0 0 4px var(--el-color-warning-light-3);
    }
    &.danger {
      background-color: var(--el-color-danger);
      box-shadow: 0 0 4px var(--el-color-danger-light-3);
    }
  }
}
</style>
