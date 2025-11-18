import Dialog from './src/Dialog.vue'
import type { DialogProps as ElDialogProps } from 'element-plus'

/**
 * Dialog 组件的 Props 类型定义
 * 继承 ElDialog 的所有原生属性，并扩展自定义属性
 */
export type DialogProps = InstanceType<typeof Dialog>['$props'] & Partial<ElDialogProps>

/**
 * Dialog 组件实例类型
 */
export type DialogInstance = InstanceType<typeof Dialog>

/**
 * Dialog 组件的 Emits 类型定义
 */
export type DialogEmits = InstanceType<typeof Dialog>['$emit']

/**
 * Dialog 组件的 Slots 类型定义
 */
export type DialogSlots = {
  /** 标题插槽 */
  title?: () => any
  /** 标题栏操作按钮插槽 */
  'header-actions'?: () => any
  /** 内容插槽 */
  default?: () => any
  /** 底部插槽 */
  footer?: () => any
}

export { Dialog }
export default Dialog
