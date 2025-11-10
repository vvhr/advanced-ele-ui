<script setup lang="ts">
import { Icon } from '@/components/Icon'
import type { CSSProperties, PropType } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  subLabel: {
    type: String,
    default: ''
  },
  toggleable: {
    type: Boolean,
    default: true
  },
  expand: {
    type: Boolean,
    default: true
  },
  headerStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  },
  bodyStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  },
  labelStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  },
  subLabelStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  }
})

const isExpanded = ref(unref(props).expand)
const bodyRef = ref<HTMLElement>()

function handleExpandChange() {
  const body = bodyRef.value
  if (!body) return

  if (isExpanded.value) {
    // 折叠：先获取当前高度，然后动画到0
    const currentHeight = body.scrollHeight
    body.style.height = currentHeight + 'px'

    requestAnimationFrame(() => {
      body.style.height = '0px'
      body.style.padding = '0px'
    })
  } else {
    // 展开：先设置高度为0，然后动画到实际高度
    body.style.height = '0px'
    body.style.padding = '0px'

    requestAnimationFrame(() => {
      const targetHeight = body.scrollHeight
      body.style.height = targetHeight + 'px'
      body.style.padding = '10px'
    })
  }

  isExpanded.value = !isExpanded.value
}

function onTransitionEnd() {
  const body = bodyRef.value
  if (!body) return

  // 动画结束后，如果是展开状态，移除固定高度让内容自适应
  if (isExpanded.value) {
    body.style.height = 'auto'
  }
}
</script>

<template>
  <div class="zw-form-group">
    <div
      class="zw-form-group-header"
      :class="{
        toggleable: toggleable,
        isExpanded: isExpanded
      }"
      :style="headerStyle"
      @click="toggleable ? handleExpandChange() : undefined"
    >
      <div class="zw-form-group-header__label">
        <span class="title" :style="labelStyle">{{ label }}</span>
        <span v-if="subLabel" class="sub-title" :style="subLabelStyle">{{ subLabel }}</span>
      </div>
      <Icon
        v-if="toggleable"
        :icon="isExpanded ? 'ep:arrow-down-bold' : 'ep:arrow-up-bold'"
        class="zw-form-group-header__icon"
      />
    </div>
    <div
      ref="bodyRef"
      class="zw-form-group-body"
      :class="{ expanded: isExpanded }"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div class="zw-form-group-body__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.zw-form-group {
  width: 100%;
  border: 1px solid #ebeef5;
  margin-bottom: 10px;
  position: relative;

  .zw-form-group-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 15px 10px 10px;
    background: #f5f7fa;
    font-size: 14px;
    box-sizing: border-box;

    .zw-form-group-header__label {
      display: flex;
      flex-direction: column;

      > .title {
        font-size: 14px;
      }

      > .sub-title {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }

    //.zw-form-group-header__icon {
    //}
    &.toggleable {
      cursor: pointer;
    }

    &.isExpanded {
      border-bottom: 1px solid #ebeef5;
    }
  }

  .zw-form-group-body {
    background: white;
    position: relative;
    overflow: hidden;
    transition:
      height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.expanded {
      padding: 10px;
    }

    &:not(.expanded) {
      height: 0;
      padding: 0;
    }

    .zw-form-group-body__content {
      padding: 0;
    }
  }
}
</style>
