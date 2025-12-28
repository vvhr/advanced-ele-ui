/**
 * RenderDesigner 组件配置数据结构
 * 
 * 非入侵式设计：Form 组件不需要知道 RenderDesigner 的存在，
 * RenderDesigner 输出的 JSON 配置通过 renderResolver 转换为标准的 render 函数。
 */

/**
 * RenderDesigner 的输入参数
 * @description RenderDesigner 组件接收这六个固定参数，用于在设计器中预览和配置
 */
export interface RenderDesignerParams {
  /**
   * 当前字段的值
   */
  value: any
  
  /**
   * 表单数据对象
   */
  formModel: Recordable
  
  /**
   * 当前列配置
   */
  column: any
  
  /**
   * 表单是否禁用
   */
  disabled: boolean
  
  /**
   * 表单数据源上下文
   */
  excontext: Recordable
  
  /**
   * 工具对象（包含 lodash、dayjs 等）
   */
  tools: Recordable
}

/**
 * 表达式节点（简化版，专门用于 RenderDesigner）
 */
export interface ExpressionNode {
  type: 'field' | 'value' | 'operator' | 'function' | 'group'
  field?: string
  value?: any
  operator?: string
  functionName?: string
  functionArgs?: ExpressionNode[]
  children?: ExpressionNode[]
}

/**
 * 条件配置
 */
export interface ConditionConfig {
  expression: ExpressionNode
  not?: boolean
}

/**
 * 事件操作类型
 */
export type EventActionType =
  | 'setField'
  | 'callFunction'
  | 'showMessage'
  | 'navigate'
  | 'request'
  | 'customCode'

/**
 * 事件操作配置
 */
export interface EventAction {
  type: EventActionType
  setField?: {
    field: string
    value: ExpressionNode
  }
  callFunction?: {
    functionName: string
    args?: ExpressionNode[]
  }
  showMessage?: {
    message: string | ExpressionNode
    type?: 'success' | 'warning' | 'error' | 'info'
    duration?: number
  }
  navigate?: {
    url: string | ExpressionNode
    target?: '_blank' | '_self'
  }
  request?: {
    url: string | ExpressionNode
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params?: Record<string, ExpressionNode>
    onSuccess?: EventAction[]
    onError?: EventAction[]
  }
  customCode?: string
}

/**
 * 事件处理器配置
 */
export interface EventHandlerConfig {
  eventType: 'click' | 'change' | 'input' | 'focus' | 'blur' | 'custom'
  actions: EventAction[]
}

/**
 * 字段绑定配置
 */
export interface FieldBindingConfig {
  type: 'fieldBinding'
  field: string
  twoWay?: boolean
}

/**
 * 组件属性值类型
 */
export type ComponentPropValue =
  | string
  | number
  | boolean
  | ExpressionNode
  | FieldBindingConfig
  | RenderComponentConfig
  | RenderComponentConfig[]

/**
 * RenderDesigner 组件配置
 * @description 这是 RenderDesigner 输出的 JSON 数据结构，完全可序列化
 */
export interface RenderComponentConfig {
  /**
   * 组件类型
   * - Element Plus 组件：'el-button', 'el-input', 'el-select' 等
   * - 原生 HTML 标签：'div', 'span', 'button' 等
   * - 自定义组件：需要在 renderResolver 中注册
   */
  type: string
  
  /**
   * 组件属性
   */
  props?: Record<string, ComponentPropValue>
  
  /**
   * 组件子元素
   */
  children?: string | ExpressionNode | RenderComponentConfig | RenderComponentConfig[]
  
  /**
   * 组件插槽
   */
  slots?: Record<string, RenderComponentConfig | RenderComponentConfig[]>
  
  /**
   * 条件渲染配置
   * @description 当条件不满足时，返回 false（不渲染）
   */
  condition?: ConditionConfig
  
  /**
   * 样式配置
   */
  style?: Record<string, string | number | ExpressionNode>
  
  /**
   * 类名（支持表达式）
   */
  className?: string | ExpressionNode
  
  /**
   * 事件处理器配置
   */
  events?: Record<string, EventHandlerConfig>
  
  /**
   * 组件唯一标识（用于调试）
   */
  key?: string
}

/**
 * RenderDesigner 的输出值类型
 * @description RenderDesigner 组件输出的 JSON 配置
 */
export type RenderDesignerValue = RenderComponentConfig | false | null

/**
 * RenderDesigner 组件的 Props
 */
export interface RenderDesignerProps {
  /**
   * 当前配置值（JSON 格式）
   */
  value?: RenderDesignerValue
  
  /**
   * 值变化回调
   */
  onChange?: (value: RenderDesignerValue) => void
  
  /**
   * RenderDesigner 的参数（用于预览）
   */
  params?: Partial<RenderDesignerParams>
  
  /**
   * 是否禁用编辑
   */
  disabled?: boolean
  
  /**
   * 可用字段列表（用于字段选择器）
   */
  availableFields?: Array<{
    path: string
    label: string
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  }>
  
  /**
   * 可用组件列表（用于组件选择器）
   */
  availableComponents?: Array<{
    name: string
    label: string
    icon?: string
    category?: string
  }>
  
  /**
   * 自定义配置项元数据（用于扩展）
   */
  customConfigMetadata?: Record<string, any>
}
