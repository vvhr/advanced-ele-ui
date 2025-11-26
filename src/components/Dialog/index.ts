import Dialog from './src/Dialog.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { DialogProps as ElDialogProps } from 'element-plus'

export const AeDialog: SFCWithInstall<typeof Dialog> = withInstall(Dialog)
export default AeDialog

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

// 兼容旧的导出方式
export { AeDialog as Dialog }
