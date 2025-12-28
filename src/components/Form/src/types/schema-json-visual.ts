/**
 * 可视化配置器数据结构设计
 * 
 * 这个文件定义了用于可视化配置 FormSchemaForJson 的数据结构，
 * 特别是 render 属性的可视化配置方案。
 */

/**
 * 配置项值类型
 * @description 描述配置项可以接受的值类型
 */
export type ConfigValueType =
  | 'string'           // 字符串输入
  | 'number'           // 数字输入
  | 'boolean'          // 布尔开关
  | 'select'           // 下拉选择
  | 'multiSelect'      // 多选
  | 'color'            // 颜色选择器
  | 'fieldBinding'     // 字段绑定选择器（绑定到 formModel 的字段）
  | 'expression'       // 表达式编辑器（可视化构建表达式）
  | 'eventHandler'     // 事件处理器（可视化编写事件代码）
  | 'style'            // 样式编辑器
  | 'component'        // 组件选择器
  | 'icon'             // 图标选择器
  | 'array'            // 数组编辑器
  | 'object'           // 对象编辑器

/**
 * 表达式操作符
 * @description 用于可视化构建表达式的操作符
 */
export type ExpressionOperator =
  | 'eq'              // ==
  | 'ne'              // !=
  | 'gt'              // >
  | 'gte'             // >=
  | 'lt'              // <
  | 'lte'             // <=
  | 'in'              // in
  | 'notIn'           // not in
  | 'contains'        // 包含
  | 'startsWith'      // 以...开始
  | 'endsWith'        // 以...结束
  | 'and'             // 且
  | 'or'              // 或
  | 'not'             // 非

/**
 * 表达式节点
 * @description 用于可视化构建表达式的数据结构
 */
export interface ExpressionNode {
  /**
   * 节点类型
   */
  type: 'field' | 'value' | 'operator' | 'function' | 'group'
  
  /**
   * 字段路径（当 type 为 'field' 时）
   * @example 'formModel.type', 'formModel.user.name'
   */
  field?: string
  
  /**
   * 值（当 type 为 'value' 时）
   */
  value?: any
  
  /**
   * 操作符（当 type 为 'operator' 时）
   */
  operator?: ExpressionOperator
  
  /**
   * 函数名（当 type 为 'function' 时）
   * @example 'isEmpty', 'isNotEmpty', 'length'
   */
  functionName?: string
  
  /**
   * 函数参数（当 type 为 'function' 时）
   */
  functionArgs?: ExpressionNode[]
  
  /**
   * 子节点（当 type 为 'group' 时）
   */
  children?: ExpressionNode[]
}

/**
 * 条件配置
 * @description 用于描述组件的显示/隐藏条件
 */
export interface ConditionConfig {
  /**
   * 条件表达式节点树
   */
  expression: ExpressionNode
  
  /**
   * 是否取反
   */
  not?: boolean
}

/**
 * 事件处理器配置
 * @description 用于可视化配置事件处理逻辑
 */
export interface EventHandlerConfig {
  /**
   * 事件类型
   */
  eventType: 'click' | 'change' | 'input' | 'focus' | 'blur' | 'custom'
  
  /**
   * 操作列表（按顺序执行）
   */
  actions: EventAction[]
}

/**
 * 事件操作类型
 */
export type EventActionType =
  | 'setField'           // 设置字段值
  | 'callFunction'       // 调用函数
  | 'showMessage'        // 显示消息
  | 'navigate'           // 导航
  | 'request'            // 发送请求
  | 'customCode'         // 自定义代码

/**
 * 事件操作
 */
export interface EventAction {
  /**
   * 操作类型
   */
  type: EventActionType
  
  /**
   * 设置字段值配置（当 type 为 'setField' 时）
   */
  setField?: {
    field: string           // 目标字段路径
    value: ExpressionNode   // 值表达式
  }
  
  /**
   * 调用函数配置（当 type 为 'callFunction' 时）
   */
  callFunction?: {
    functionName: string    // 函数名
    args?: ExpressionNode[] // 参数列表
  }
  
  /**
   * 显示消息配置（当 type 为 'showMessage' 时）
   */
  showMessage?: {
    message: string | ExpressionNode  // 消息内容
    type?: 'success' | 'warning' | 'error' | 'info'
    duration?: number
  }
  
  /**
   * 导航配置（当 type 为 'navigate' 时）
   */
  navigate?: {
    url: string | ExpressionNode
    target?: '_blank' | '_self'
  }
  
  /**
   * 请求配置（当 type 为 'request' 时）
   */
  request?: {
    url: string | ExpressionNode
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params?: Record<string, ExpressionNode>
    onSuccess?: EventAction[]
    onError?: EventAction[]
  }
  
  /**
   * 自定义代码（当 type 为 'customCode' 时）
   * @description 高级用户可以直接编写代码
   */
  customCode?: string
}

/**
 * 样式配置
 * @description 用于可视化配置样式
 */
export interface StyleConfig {
  /**
   * CSS 属性配置
   */
  [key: string]: string | number | ExpressionNode
}

/**
 * 组件配置（增强版）
 * @description 支持可视化配置的组件配置对象
 */
export interface VisualComponentConfig {
  /**
   * 组件类型
   */
  type: string
  
  /**
   * 组件属性
   */
  props?: Record<string, ComponentPropValue>
  
  /**
   * 组件子元素
   */
  children?: ComponentChildren
  
  /**
   * 组件插槽
   */
  slots?: Record<string, ComponentChildren>
  
  /**
   * 条件渲染配置
   */
  condition?: ConditionConfig
  
  /**
   * 样式配置
   */
  style?: StyleConfig
  
  /**
   * 类名配置（支持表达式）
   */
  className?: string | ExpressionNode
  
  /**
   * 事件处理器配置
   */
  events?: Record<string, EventHandlerConfig>
}

/**
 * 组件属性值类型
 */
export type ComponentPropValue =
  | string
  | number
  | boolean
  | ExpressionNode      // 表达式节点
  | FieldBindingConfig  // 字段绑定
  | ComponentChildren  // 子组件

/**
 * 字段绑定配置
 * @description 用于描述绑定到 formModel 的字段
 */
export interface FieldBindingConfig {
  /**
   * 绑定类型
   */
  type: 'fieldBinding'
  
  /**
   * 字段路径
   * @example 'type', 'user.name', 'items[0].value'
   */
  field: string
  
  /**
   * 是否双向绑定
   */
  twoWay?: boolean
}

/**
 * 组件子元素类型
 */
export type ComponentChildren =
  | string
  | ExpressionNode
  | VisualComponentConfig
  | VisualComponentConfig[]

/**
 * Render 属性的可视化配置版本
 */
export type VisualRenderConfig = VisualComponentConfig | false

/**
 * 图标配置
 */
export interface IconConfig {
  /**
   * 图标名称
   */
  name: string
  
  /**
   * 图标库
   * @default 'element-plus'
   */
  library?: 'element-plus' | 'custom'
  
  /**
   * 图标属性
   */
  props?: Record<string, any>
}

/**
 * 文本块配置
 * @description 专门用于配置文本块组件
 */
export interface TextBlockConfig extends VisualComponentConfig {
  type: 'text' | 'span' | 'div' | 'p'
  
  /**
   * 文本内容（支持表达式）
   */
  content: string | ExpressionNode
  
  /**
   * 前置图标
   */
  prefixIcon?: IconConfig
  
  /**
   * 后置图标
   */
  suffixIcon?: IconConfig
  
  /**
   * 样式配置
   */
  style?: StyleConfig
}

/**
 * 按钮配置
 * @description 专门用于配置按钮组件
 */
export interface ButtonConfig extends VisualComponentConfig {
  type: 'el-button'
  
  /**
   * 按钮文本（支持表达式）
   */
  text: string | ExpressionNode
  
  /**
   * 按钮类型
   */
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  
  /**
   * 按钮大小
   */
  size?: 'large' | 'default' | 'small'
  
  /**
   * 前置图标
   */
  prefixIcon?: IconConfig
  
  /**
   * 后置图标
   */
  suffixIcon?: IconConfig
  
  /**
   * 点击事件配置
   */
  onClick?: EventHandlerConfig
  
  /**
   * 条件显示配置
   */
  condition?: ConditionConfig
}

/**
 * 输入框配置
 * @description 专门用于配置输入框组件（用于 render 中的输入框）
 */
export interface InputConfig extends VisualComponentConfig {
  type: 'el-input' | 'el-input-number' | 'el-select' | 'el-date-picker'
  
  /**
   * 字段绑定
   */
  fieldBinding: FieldBindingConfig
  
  /**
   * 输入框属性
   */
  inputProps?: Record<string, ComponentPropValue>
  
  /**
   * 占位符
   */
  placeholder?: string | ExpressionNode
  
  /**
   * 是否禁用（支持表达式）
   */
  disabled?: boolean | ExpressionNode
  
  /**
   * 是否只读（支持表达式）
   */
  readonly?: boolean | ExpressionNode
}

/**
 * FormSchemaForJson 的可视化配置版本
 * @description 所有 render 相关属性都使用 VisualRenderConfig
 */
export interface VisualFormSchemaForJson {
  // ... 其他属性与 FormSchemaForJson 相同
  outsideProps?: {
    enable?: boolean | ExpressionNode
    direction?: 'row' | 'column'
    style?: StyleConfig
    prependSlot?: boolean | ExpressionNode
    appendSlot?: boolean | ExpressionNode
    prependRender?: VisualRenderConfig
    appendRender?: VisualRenderConfig
  }
  insideProps?: {
    slots?: Record<string, boolean | ExpressionNode>
    renders?: Record<string, VisualRenderConfig>
  }
  render?: VisualRenderConfig
  formItemProps?: {
    subLabelRender?: VisualRenderConfig
    // ... 其他属性
  }
}
