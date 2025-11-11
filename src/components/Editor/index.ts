import Editor from './src/Editor.vue'
import type { AiEditorOptions } from 'aieditor'
import type { ToolbarKey, AddToolItem, AddToolItemPosition } from './src/types'

// 导出组件
export { Editor }

// 导出类型
export type { ToolbarKey, AddToolItem, AddToolItemPosition }

// 导出常量
export { SIMPLE_TOOLBAR_KEYS, FULL_TOOLBAR_KEYS } from './src/constants'

// 导出 Editor 组件的 Props 类型
export type EditorDefineProps = InstanceType<typeof Editor>['$props']
export type EditorInstance = InstanceType<typeof Editor>
export interface EditorProps {
  /** 双向绑定编辑器的`content` */
  modelValue?: string
  /** 禁止输入 */
  disabled?: boolean
  /** 占位符 */
  placeholder?: string
  /** 高度 */
  height?: number | string
  /** 模式 `simple`: 简单模式 `full`: 全功能模式 `custom`: 自定义模式 */
  mode?: 'simple' | 'full' | 'custom'
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 工具栏按钮列表 custom模式时根据此配置生成工具栏 */
  toolbarKeys?: ToolbarKey[]
  /** 排除的工具栏按钮列表 `simple`模式或`full`模式时根据此配置排除 */
  toolbarExcludeKeys?: ToolbarKey[]
  /** 增加工具栏按钮 `simple`模式时根据此配置在对应位置插入组件 */
  addToolbarKeys?: AddToolItem[]
  /** 主题 `light`: 浅色 `dark`: 深色 */
  theme?: 'light' | 'dark'
  /** 内容是否是markdown格式, 此属性将控制输入和输出为markdown格式 */
  contentIsMarkdown?: boolean
  /** 是否自动保存（缓存）当前编辑的内容 */
  contentRetention?: boolean
  /** 自动保存的缓存key */
  contentRetentionKey?: string
  /** 允许自由调整尺寸 */
  resizable?: boolean
  /** 工具栏是否显示提示 */
  toolbarTipEnable?: boolean
  /** 语言 zh: 中文 en: 英文 */
  lang?: string
  /**
   * 编辑器实例配置
   * @description 除了以上属性外，其他属性都可配置在 `editorOptions` 中，注意 `editorOptions` 中的同名属性不会覆盖EditorProps的属性
   * @remarks 编辑器自身的其他配置功能参阅文档: https://aieditor.dev/docs/zh
   */
  editorOptions?: AiEditorOptions
}

// 导出 Editor 组件的 Emits 类型
export interface EditorEmits {
  /** 内容变化事件 */
  (e: 'change', value: string): void
  /** 双向绑定更新事件 */
  (e: 'update:modelValue', value: string): void
  /** 获得焦点事件 */
  (e: 'focus'): void
  /** 失去焦点事件 */
  (e: 'blur'): void
  /** 编辑器创建完成事件 */
  (e: 'created'): void
  /** 编辑器销毁事件 */
  (e: 'destroy'): void
}

// 导出编辑器实例类型（用于 ref 引用）
export type { AiEditor } from 'aieditor'
export default Editor
