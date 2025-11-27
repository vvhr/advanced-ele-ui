<script setup lang="ts">
import { ElDrawer, ElScrollbar } from 'element-plus'
import { computed, useAttrs, useSlots } from 'vue'
import { Icon } from '@/components/Icon'

const slots = useSlots()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  direction: {
    type: String as () => 'rtl' | 'ltr' | 'ttb' | 'btt',
    default: 'rtl'
  },
  size: {
    type: [String, Number],
    default: '30%'
  },
  scrollable: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue'])
const getBindValue = computed(() => {
  const delArr: string[] = ['title', 'direction', 'size', 'scrollable']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const onClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <ElDrawer
    v-bind="getBindValue"
    :direction="direction"
    :size="size"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    class="ae-drawer"
    @close="onClose"
  >
    <template #header="{ close }">
      <div class="flex justify-between items-center h-54px pl-15px pr-15px">
        <div class="flex items-center gap-8px">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div class="drawer-actions">
          <slot name="header-actions"></slot>
          <div class="drawer-action-btn" @click="close">
            <Icon icon="ep:close" />
          </div>
        </div>
      </div>
    </template>

    <ElScrollbar v-if="scrollable" class="drawer-scrollbar">
      <div class="drawer-content">
        <slot></slot>
      </div>
    </ElScrollbar>
    <div v-else class="drawer-body-no-scroll">
      <slot></slot>
    </div>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDrawer>
</template>

<style lang="less">
.ae-drawer {
  .el-drawer__header {
    height: 54px;
    padding: 0;
    margin-bottom: 0 !important;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    background-color: var(--el-bg-color);
  }

  .el-drawer__body {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .el-drawer__footer {
    padding: 15px;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-extra-light);
  }

  .drawer-scrollbar {
    flex: 1;
    height: 0;
  }

  .drawer-content {
    padding: 15px;
  }

  .drawer-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .drawer-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--el-color-info);
    transition: all 0.2s ease;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-light);
    }

    &:active {
      background-color: var(--el-fill-color);
    }
  }

  .drawer-body-no-scroll {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
