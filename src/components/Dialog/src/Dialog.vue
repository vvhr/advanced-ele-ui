<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { computed, useAttrs, ref, unref, useSlots, watch, type PropType } from 'vue'
import { isNumber } from '@/utils/is'
import { Icon } from '@/components/Icon'
import { FullScreen } from '@element-plus/icons-vue'

type DoneFn = () => void
type DialogBeforeCloseFn = (done: DoneFn) => void

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
  // 允许全屏切换
  fullscreen: {
    type: Boolean,
    default: false
  },
  // 默认全屏
  isFullscreen: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: [String, Number],
    default: '400px'
  },
  draggable: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function as PropType<DialogBeforeCloseFn>
  }
})
const emit = defineEmits(['update:modelValue'])
const getBindValue = computed(() => {
  const delArr: string[] = [
    'fullscreen',
    'title',
    'maxHeight',
    'draggable',
    'scrollable',
    'beforeClose'
  ]
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullscreenLocal = ref(props.isFullscreen)

const toggleFull = () => {
  isFullscreenLocal.value = !unref(isFullscreenLocal)
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

watch(
  () => props.maxHeight,
  val => {
    dialogHeight.value = isNumber(val) ? `${val}px` : val
  }
)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight),
    padding: '15px'
  }
})

function handleClose() {
  if (props.beforeClose !== undefined) {
    props.beforeClose(() => {
      emit('update:modelValue', false)
    })
  } else {
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <ElDialog
    v-bind="getBindValue"
    :fullscreen="isFullscreenLocal"
    destroy-on-close
    lock-scroll
    :draggable="draggable"
    top="0"
    :close-on-click-modal="false"
    :show-close="false"
    class="ae-dialog"
  >
    <template #header>
      <div class="flex justify-between items-center h-54px pl-15px pr-15px relative">
        <div class="flex items-center">
          <Icon v-if="draggable" icon="mdi:drag" class="draggable-indicator" :size="30" />
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div class="dialog-actions">
          <slot name="header-actions"></slot>
          <div v-if="fullscreen" class="dialog-action-btn" @click="toggleFull">
            <Icon
              :icon="
                isFullscreenLocal ? 'radix-icons:exit-full-screen' : 'radix-icons:enter-full-screen'
              "
            />
          </div>
          <div class="dialog-action-btn" @click="handleClose()">
            <Icon icon="ep:close" />
          </div>
        </div>
      </div>
    </template>

    <ElScrollbar v-if="scrollable" :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>
    <div v-else class="dialog-body-no-scroll">
      <slot></slot>
    </div>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="less">
.el-overlay-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  .ae-dialog {
    &.is-fullscreen {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      .el-dialog__body {
        flex: 1;
        height: 0;
        .el-scrollbar {
          height: 100% !important;
          box-sizing: border-box;
        }
      }
    }
  }
}

.ae-dialog {
  margin: 0 !important;
  padding: 0 !important;
  .el-dialog__header {
    height: 54px;
    padding: 0;
    margin-right: 0 !important;
    border-bottom: 1px solid var(--el-border-color);
    background-color: var(--el-color-white);
    z-index: 2;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    padding: 15px;
    z-index: 2;
    background-color: var(--el-color-white);
    border-top: 1px solid var(--el-border-color);
  }

  .el-dialog__headerbtn {
    top: 0;
  }

  .dialog-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
  }

  .dialog-action-btn {
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

  .draggable-indicator {
    color: var(--el-color-info);
    cursor: move;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    margin-right: 5px;
    &:hover {
      opacity: 1;
    }
  }

  .dialog-body-no-scroll {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
