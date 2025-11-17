<script lang="ts" setup>
import { ref, computed, watch, nextTick, unref } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import { Close, FullScreen, CopyDocument } from '@element-plus/icons-vue'
import type { AeDialogProps, AeDialogEmits } from './types'
import { useDraggable } from './hooks/useDraggable'

defineOptions({
  name: 'AeDialog'
})

const props = withDefaults(defineProps<AeDialogProps>(), {
  modelValue: false,
  title: '',
  width: '50%',
  draggable: true,
  showMaximize: true,
  showFullscreen: false,
  destroyOnClose: true,
  showHeaderBorder: true,
  showFooterBorder: true,
  autoFocus: true,
  footer: 'default',
  confirmText: '确定',
  cancelText: '取消',
  confirmType: 'primary',
  showCancelButton: true,
  showConfirmButton: true,
  confirmLoading: false,
  closeOnClickModal: false,
  closeOnPressEscape: true
})

const emit = defineEmits<AeDialogEmits>()

// 对话框引用
const dialogRef = ref<InstanceType<typeof ElDialog>>()
const headerRef = ref<HTMLElement>()

// 内部可见状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 是否已挂载（用于控制内容销毁）
const isMounted = ref(false)

// 最大化状态
const isMaximized = ref(false)
const isFullscreen = ref(false)

// 原始尺寸和位置（用于还原）
const originalStyle = ref({
  width: '',
  top: ''
})

// 拖拽功能
const { startDrag } = useDraggable(dialogRef, headerRef, isMaximized, isFullscreen)

// 监听可见状态
watch(
  visible,
  (val) => {
    if (val) {
      isMounted.value = true
      nextTick(() => {
        if (props.autoFocus && dialogRef.value) {
          // 自动聚焦到对话框
          const dialogElement = dialogRef.value.$el as HTMLElement
          const focusable = dialogElement.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement
          focusable?.focus()
        }
      })
    } else if (props.destroyOnClose) {
      // 延迟销毁，等待关闭动画完成
      setTimeout(() => {
        isMounted.value = false
        // 重置状态
        isMaximized.value = false
        isFullscreen.value = false
      }, 300)
    }
  },
  { immediate: true }
)

// 切换最大化
const toggleMaximize = () => {
  if (isFullscreen.value) return

  const dialogElement = dialogRef.value?.$el?.querySelector('.el-dialog') as HTMLElement
  if (!dialogElement) return

  if (!isMaximized.value) {
    // 保存原始样式
    originalStyle.value = {
      width: dialogElement.style.width || props.width as string,
      top: dialogElement.style.top || '15vh'
    }
    // 最大化
    dialogElement.style.width = 'calc(100% - 40px)'
    dialogElement.style.top = '20px'
    dialogElement.style.marginTop = '0'
  } else {
    // 还原
    dialogElement.style.width = originalStyle.value.width
    dialogElement.style.top = originalStyle.value.top
    dialogElement.style.marginTop = ''
  }

  isMaximized.value = !isMaximized.value
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    isMaximized.value = false
  }
}

// 处理关闭
const handleClose = () => {
  if (props.beforeClose) {
    props.beforeClose(() => {
      visible.value = false
    })
  } else {
    visible.value = false
  }
}

// 处理确认
const handleConfirm = () => {
  emit('confirm')
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  handleClose()
}

// 对话框事件
const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
}

const handleCloseEvent = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}

// 暴露方法
defineExpose({
  toggleMaximize,
  toggleFullscreen
})
</script>

<template>
  <ElDialog
    ref="dialogRef"
    v-model="visible"
    :class="[
      'ae-dialog',
      {
        'ae-dialog--maximized': isMaximized,
        'ae-dialog--draggable': draggable,
        'ae-dialog--header-border': showHeaderBorder,
        'ae-dialog--footer-border': showFooterBorder
      }
    ]"
    :width="width"
    :fullscreen="isFullscreen"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    v-bind="$attrs"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleCloseEvent"
    @closed="handleClosed"
  >
    <!-- 自定义标题栏 -->
    <template #header="{ close, titleId, titleClass }">
      <div
        ref="headerRef"
        class="ae-dialog__header"
        :class="{ 'ae-dialog__header--draggable': draggable && !isMaximized && !isFullscreen }"
        @mousedown="draggable && !isMaximized && !isFullscreen ? startDrag($event) : undefined"
      >
        <span :id="titleId" :class="titleClass" class="ae-dialog__title">
          <slot name="title">{{ title }}</slot>
        </span>
        <div class="ae-dialog__header-actions">
          <!-- 全屏按钮 -->
          <button
            v-if="showFullscreen"
            class="ae-dialog__header-btn"
            type="button"
            aria-label="fullscreen"
            @click="toggleFullscreen"
          >
            <el-icon>
              <FullScreen />
            </el-icon>
          </button>
          <!-- 最大化按钮 -->
          <button
            v-if="showMaximize && !isFullscreen"
            class="ae-dialog__header-btn"
            type="button"
            :aria-label="isMaximized ? 'restore' : 'maximize'"
            @click="toggleMaximize"
          >
            <el-icon>
              <CopyDocument />
            </el-icon>
          </button>
          <!-- 关闭按钮 -->
          <button
            class="ae-dialog__header-btn ae-dialog__header-btn--close"
            type="button"
            aria-label="close"
            @click="close"
          >
            <el-icon>
              <Close />
            </el-icon>
          </button>
        </div>
      </div>
    </template>

    <!-- 内容区域 -->
    <div v-if="isMounted || !destroyOnClose" class="ae-dialog__content">
      <slot />
    </div>

    <!-- 底部区域 -->
    <template v-if="footer !== false" #footer>
      <div class="ae-dialog__footer">
        <slot name="footer">
          <ElButton v-if="showCancelButton" @click="handleCancel">
            {{ cancelText }}
          </ElButton>
          <ElButton
            v-if="showConfirmButton"
            :type="confirmType"
            :loading="confirmLoading"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </ElButton>
        </slot>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less">
.ae-dialog {
  .el-dialog__header {
    padding: 0;
    margin: 0;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    padding: 0;
  }

  &.ae-dialog--header-border {
    .ae-dialog__header {
      border-bottom: 1px solid var(--el-border-color-lighter);
    }
  }

  &.ae-dialog--footer-border {
    .ae-dialog__footer {
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }

  .ae-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--el-dialog-padding-primary);
    user-select: none;

    &--draggable {
      cursor: move;
    }
  }

  .ae-dialog__title {
    flex: 1;
    font-size: var(--el-dialog-title-font-size);
    font-weight: 600;
    color: var(--el-text-color-primary);
    line-height: var(--el-dialog-font-line-height);
  }

  .ae-dialog__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;
  }

  .ae-dialog__header-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: all 0.2s;
    outline: none;

    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--el-text-color-primary);
    }

    &:active {
      background-color: var(--el-fill-color);
    }

    &--close:hover {
      background-color: var(--el-color-danger);
      color: #fff;
    }

    .el-icon {
      font-size: 16px;
    }
  }

  .ae-dialog__content {
    padding: var(--el-dialog-padding-primary);
    color: var(--el-text-color-regular);
    font-size: var(--el-dialog-content-font-size);
    line-height: 1.6;
  }

  .ae-dialog__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: var(--el-dialog-padding-primary);
  }

  // 最大化状态
  &.ae-dialog--maximized {
    .el-dialog {
      margin-bottom: 20px;
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1;
        overflow: auto;
      }
    }
  }

  // 全屏状态
  .el-dialog.is-fullscreen {
    display: flex;
    flex-direction: column;

    .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
  }
}
</style>
