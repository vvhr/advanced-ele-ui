import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

/**
 * 圆点类型
 */
export type DotType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * AeText 组件的 Props 定义
 */
export const textProps = {
  /**
   * 完整文本内容
   */
  value: {
    type: String,
    default: ''
  },
  /**
   * 前置图标 (iconify图标类:图标名称)
   */
  icon: {
    type: String,
    default: ''
  },
  /**
   * 图标样式类
   */
  iconClass: {
    type: String,
    default: ''
  },
  /**
   * 图标样式
   */
  iconStyle: {
    type: [String, Object] as PropType<string | CSSProperties>,
    default: ''
  },
  /**
   * 圆点类型 (为空时不显示)
   */
  dotType: {
    type: String as PropType<DotType>,
    default: ''
  },
  /**
   * 使用引用块样式
   */
  block: {
    type: Boolean,
    default: false
  },
  /**
   * 高亮文本数组
   */
  patterns: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  /**
   * 高亮元素类
   */
  hlClass: {
    type: String,
    default: ''
  },
  /**
   * 高亮元素样式
   */
  hlStyle: {
    type: [String, Object] as PropType<string | CSSProperties>,
    default: ''
  },
  /**
   * 文本截断（true 或行数）
   */
  truncate: {
    type: [Boolean, Number] as PropType<boolean | number>,
    default: false
  },
  /**
   * 是否可展开
   */
  expandable: {
    type: Boolean,
    default: false
  },
  /**
   * 展开按钮文案
   */
  expandText: {
    type: String,
    default: '展开'
  },
  /**
   * 收起按钮文案
   */
  collapseText: {
    type: String,
    default: '收起'
  },
  /**
   * 是否可复制
   */
  copyable: {
    type: Boolean,
    default: false
  },
  /**
   * 复制图标
   */
  copyIcon: {
    type: String,
    default: 'ep:document-copy'
  },
  /**
   * 复制成功提示
   */
  copySuccessText: {
    type: String,
    default: '复制成功'
  }
} as const

/**
 * AeText 组件的 Props 类型
 */
export type TextProps = ExtractPropTypes<typeof textProps>

/**
 * AeText 组件的 Emits 定义
 */
export const textEmits = {
  /**
   * 高亮元素被点击
   * @param value 高亮内容
   */
  hlClick: (value: string) => typeof value === 'string',
  /**
   * 复制成功事件
   * @param text 复制的文本
   */
  copy: (text: string) => typeof text === 'string'
}

/**
 * AeText 组件的 Emits 类型
 */
export type TextEmits = typeof textEmits

