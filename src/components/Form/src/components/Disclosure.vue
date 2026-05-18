<script setup lang="ts">
import { computed, ref, unref, type PropType } from 'vue'
import { Icon } from '@/components/Icon'
import { t } from '@/locale'

/** 分割线相对标题的位置，对齐 el-divider 的 content-position */
export type DisclosureDividerPosition = 'left' | 'center' | 'right'
/** 分割线线型 */
export type DisclosureDividerStyle = 'solid' | 'dashed' | 'dot'

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
    default: false
  },
  toggleText: {
    type: String,
    default: t('disclosure.toggleText')
  },
  collapsedText: {
    type: String,
    default: t('disclosure.collapsedText')
  },
  // 为 true 时渲染分割线；为 false 时忽略 dividerPosition / dividerStyle
  divider: {
    type: Boolean,
    default: true
  },
  // 分割线位置：left 仅右侧有线，center 左右均有，right 仅左侧有线
  dividerPosition: {
    type: String as PropType<DisclosureDividerPosition>,
    default: 'center',
    validator: (val: string) => ['left', 'center', 'right'].includes(val)
  },
  // 分割线线型：dot 对应 CSS dotted（点线）
  dividerStyle: {
    type: String as PropType<DisclosureDividerStyle>,
    default: 'solid',
    validator: (val: string) => ['solid', 'dashed', 'dot'].includes(val)
  }
})

const isExpanded = ref(unref(props).expand)
const bodyRef = ref<HTMLElement>()

// 是否渲染左侧 / 右侧分割线
const showDividerLineLeft = computed(
  () => props.divider && (props.dividerPosition === 'center' || props.dividerPosition === 'right')
)
const showDividerLineRight = computed(
  () => props.divider && (props.dividerPosition === 'center' || props.dividerPosition === 'left')
)

const titleRowClass = computed(() => ({
  'is-divider': props.divider,
  [`divider-position-${props.dividerPosition}`]: props.divider,
  [`divider-style-${props.dividerStyle}`]: props.divider
}))

const headerClass = computed(() => ({
  toggleable: props.toggleable,
  isExpanded: isExpanded.value,
  'has-divider': props.divider,
  [`divider-position-${props.dividerPosition}`]: props.divider
}))

function handleExpandChange() {
  const body = bodyRef.value
  if (!body) return

  if (isExpanded.value) {
    // 折叠：先获取当前高度，然后动画到0
    const currentHeight = body.scrollHeight
    body.style.height = currentHeight + 'px'

    requestAnimationFrame(() => {
      body.style.height = '0px'
    })
  } else {
    // 展开：先设置高度为0，然后动画到实际高度
    body.style.height = '0px'

    requestAnimationFrame(() => {
      const targetHeight = body.scrollHeight
      body.style.height = targetHeight + 'px'
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
  <div class="ae-form-disclosure">
    <div
      class="ae-form-disclosure-header"
      :class="headerClass"
    >
      <!-- divider 为 true 时按 dividerPosition 决定左右哪侧渲染线 -->
      <div class="ae-form-disclosure-header__title-row" :class="titleRowClass">
        <span
          v-if="showDividerLineLeft"
          class="ae-form-disclosure-header__line"
          aria-hidden="true"
        />
        <div class="ae-form-disclosure-header__label">
          <span class="title">{{ label }}</span>
          <div class="toggle" @click="toggleable ? handleExpandChange() : undefined">
            <span class="toggle-text">{{ isExpanded ? toggleText : collapsedText }}</span>
            <Icon
              v-if="toggleable"
              :icon="isExpanded ? 'ep:hide' : 'ep:view'"
              size="14"
              class="toggle-icon"
            />
          </div>
        </div>
        <span
          v-if="showDividerLineRight"
          class="ae-form-disclosure-header__line"
          aria-hidden="true"
        />
      </div>
      <div v-if="subLabel" class="ae-form-disclosure-header__sub-label">
        <span class="sub-title">{{ subLabel }}</span>
      </div>
    </div>
    <div
      ref="bodyRef"
      class="ae-form-disclosure-body"
      :class="{ expanded: isExpanded }"
      @transitionend="onTransitionEnd"
    >
      <div class="ae-form-disclosure-body__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.ae-form-disclosure {
  width: 100%;
  margin-bottom: 10px;
  position: relative;

  .ae-form-disclosure-header {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
    box-sizing: border-box;

    // 标题行：divider 模式下 flex 布局，两侧线 flex:1
    .ae-form-disclosure-header__title-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      gap: 12px;

      &:not(.is-divider) {
        justify-content: flex-start;
      }

      &.is-divider.divider-position-left {
        justify-content: flex-start;
      }

      &.is-divider.divider-position-center {
        justify-content: center;
      }

      &.is-divider.divider-position-right {
        justify-content: flex-end;
      }

      // 线型：dot 映射为 CSS dotted
      &.divider-style-solid .ae-form-disclosure-header__line {
        border-top-style: solid;
      }

      &.divider-style-dashed .ae-form-disclosure-header__line {
        border-top-style: dashed;
      }

      &.divider-style-dot .ae-form-disclosure-header__line {
        border-top-style: dotted;
      }
    }

    // 左右分割线：占满标题区两侧剩余宽度
    .ae-form-disclosure-header__line {
      flex: 1;
      min-width: 0;
      height: 0;
      border-top-width: 1px;
      border-top-color: var(--el-border-color);
      border-top-style: solid;
    }

    .ae-form-disclosure-header__label {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-shrink: 0;
      gap: 10px;

      > .title {
        font-size: 14px;
        font-weight: 500;
        user-select: none;
      }

      > .toggle {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
        cursor: pointer;

        > .toggle-text {
          font-size: 13px;
          color: var(--el-color-primary);
        }

        > .toggle-icon {
          color: var(--el-color-primary);
        }
      }
    }

    .ae-form-disclosure-header__sub-label {
      > .sub-title {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        user-select: none;
      }
    }

    // 有分割线时副标题与 dividerPosition 对齐
    &.has-divider.divider-position-left .ae-form-disclosure-header__sub-label {
      text-align: left;
    }

    &.has-divider.divider-position-center .ae-form-disclosure-header__sub-label {
      text-align: center;
    }

    &.has-divider.divider-position-right .ae-form-disclosure-header__sub-label {
      text-align: right;
    }
  }

  .ae-form-disclosure-body {
    position: relative;
    overflow: hidden;
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    .ae-form-disclosure-body__content {
      padding: 0;
    }
  }
}
</style>
