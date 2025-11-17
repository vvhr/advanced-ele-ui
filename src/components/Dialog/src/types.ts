export interface AeDialogProps {
  /**
   * 是否显示对话框
   */
  modelValue: boolean
  /**
   * 对话框标题
   */
  title?: string
  /**
   * 对话框宽度
   * @default '50%'
   */
  width?: string | number
  /**
   * 是否可拖拽
   * @default true
   */
  draggable?: boolean
  /**
   * 是否显示最大化按钮
   * @default true
   */
  showMaximize?: boolean
  /**
   * 是否显示全屏按钮
   * @default false
   */
  showFullscreen?: boolean
  /**
   * 是否在关闭时销毁内容
   * @default true
   */
  destroyOnClose?: boolean
  /**
   * 是否显示标题栏底部边框
   * @default true
   */
  showHeaderBorder?: boolean
  /**
   * 是否显示底部区域顶部边框
   * @default true
   */
  showFooterBorder?: boolean
  /**
   * 是否在打开时自动聚焦
   * @default true
   */
  autoFocus?: boolean
  /**
   * 关闭前的回调，返回 false 或 Promise.reject 可阻止关闭
   */
  beforeClose?: (done: () => void) => void
  /**
   * 底部按钮配置
   */
  footer?: boolean | 'default'
  /**
   * 确认按钮文本
   * @default '确定'
   */
  confirmText?: string
  /**
   * 取消按钮文本
   * @default '取消'
   */
  cancelText?: string
  /**
   * 确认按钮类型
   * @default 'primary'
   */
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /**
   * 是否显示取消按钮
   * @default true
   */
  showCancelButton?: boolean
  /**
   * 是否显示确认按钮
   * @default true
   */
  showConfirmButton?: boolean
  /**
   * 确认按钮加载状态
   * @default false
   */
  confirmLoading?: boolean
  /**
   * 是否点击遮罩层关闭对话框
   * @default false
   */
  closeOnClickModal?: boolean
  /**
   * 是否按 ESC 键关闭对话框
   * @default true
   */
  closeOnPressEscape?: boolean
}

export interface AeDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}
