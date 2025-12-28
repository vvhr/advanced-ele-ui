/**
 * 可视化配置元数据
 * 
 * 这个文件定义了每个配置项的可视化编辑方式，
 * 用于指导可视化配置器如何渲染编辑界面。
 */

import type { ConfigValueType, ExpressionOperator } from './schema-json-visual'

/**
 * 配置项元数据
 * @description 描述一个配置项如何可视化编辑
 */
export interface ConfigItemMetadata {
  /**
   * 配置项键名
   */
  key: string
  
  /**
   * 配置项标签（显示名称）
   */
  label: string
  
  /**
   * 配置项描述
   */
  description?: string
  
  /**
   * 值类型
   */
  valueType: ConfigValueType
  
  /**
   * 是否必填
   */
  required?: boolean
  
  /**
   * 默认值
   */
  defaultValue?: any
  
  /**
   * 配置项分组
   */
  group?: string
  
  /**
   * 配置项顺序（用于排序）
   */
  order?: number
  
  /**
   * 是否高级配置（默认折叠）
   */
  advanced?: boolean
  
  /**
   * 依赖其他配置项（当某个配置项的值满足条件时，此配置项才显示）
   */
  dependsOn?: {
    key: string
    value: any
  }
  
  /**
   * 类型特定的配置
   */
  typeConfig?: TypeSpecificConfig
}

/**
 * 类型特定配置
 */
export interface TypeSpecificConfig {
  /**
   * 选择器选项（当 valueType 为 'select' 或 'multiSelect' 时）
   */
  options?: SelectOption[]
  
  /**
   * 表达式操作符选项（当 valueType 为 'expression' 时）
   */
  operators?: ExpressionOperator[]
  
  /**
   * 字段类型过滤（当 valueType 为 'fieldBinding' 时）
   */
  fieldTypeFilter?: ('string' | 'number' | 'boolean' | 'array' | 'object')[]
  
  /**
   * 样式属性选项（当 valueType 为 'style' 时）
   */
  styleProperties?: StylePropertyMetadata[]
  
  /**
   * 组件选项（当 valueType 为 'component' 时）
   */
  componentOptions?: ComponentOption[]
  
  /**
   * 图标库选项（当 valueType 为 'icon' 时）
   */
  iconLibraries?: IconLibrary[]
  
  /**
   * 数组项配置（当 valueType 为 'array' 时）
   */
  arrayItemConfig?: ConfigItemMetadata
  
  /**
   * 对象属性配置（当 valueType 为 'object' 时）
   */
  objectProperties?: ConfigItemMetadata[]
  
  /**
   * 最小值（当 valueType 为 'number' 时）
   */
  min?: number
  
  /**
   * 最大值（当 valueType 为 'number' 时）
   */
  max?: number
  
  /**
   * 步长（当 valueType 为 'number' 时）
   */
  step?: number
  
  /**
   * 占位符（当 valueType 为 'string' 时）
   */
  placeholder?: string
  
  /**
   * 最大长度（当 valueType 为 'string' 时）
   */
  maxLength?: number
}

/**
 * 选择器选项
 */
export interface SelectOption {
  label: string
  value: any
  description?: string
  icon?: string
}

/**
 * 样式属性元数据
 */
export interface StylePropertyMetadata {
  key: string
  label: string
  type: 'string' | 'number' | 'color' | 'select'
  options?: SelectOption[]
  unit?: 'px' | 'em' | 'rem' | '%'
  defaultValue?: any
}

/**
 * 组件选项
 */
export interface ComponentOption {
  name: string
  label: string
  icon?: string
  category?: string
  description?: string
  defaultProps?: Record<string, any>
  configMetadata?: ConfigItemMetadata[]
}

/**
 * 图标库
 */
export interface IconLibrary {
  name: string
  label: string
  icons: IconOption[]
}

/**
 * 图标选项
 */
export interface IconOption {
  name: string
  label: string
  svg?: string
  unicode?: string
}

/**
 * 可视化配置器配置
 * @description 定义整个可视化配置器的行为
 */
export interface VisualConfiguratorConfig {
  /**
   * 支持的组件列表
   */
  components: ComponentOption[]
  
  /**
   * 组件配置元数据映射
   * @description 每个组件类型对应的配置项元数据
   */
  componentConfigMetadata: Record<string, ConfigItemMetadata[]>
  
  /**
   * 通用配置项元数据
   */
  commonConfigMetadata: ConfigItemMetadata[]
  
  /**
   * 表达式构建器配置
   */
  expressionBuilder?: {
    /**
     * 支持的函数列表
     */
    functions?: FunctionMetadata[]
    
    /**
     * 支持的字段列表（用于字段选择器）
     */
    fields?: FieldMetadata[]
  }
  
  /**
   * 事件处理器配置
   */
  eventHandler?: {
    /**
     * 支持的操作类型
     */
    actionTypes: EventActionTypeMetadata[]
  }
}

/**
 * 函数元数据
 */
export interface FunctionMetadata {
  name: string
  label: string
  description?: string
  parameters: FunctionParameterMetadata[]
  returnType: string
  examples?: string[]
}

/**
 * 函数参数元数据
 */
export interface FunctionParameterMetadata {
  name: string
  label: string
  type: ConfigValueType
  required?: boolean
  defaultValue?: any
  description?: string
}

/**
 * 字段元数据
 */
export interface FieldMetadata {
  path: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  children?: FieldMetadata[]  // 嵌套字段
}

/**
 * 事件操作类型元数据
 */
export interface EventActionTypeMetadata {
  type: string
  label: string
  description?: string
  icon?: string
  configMetadata?: ConfigItemMetadata[]
}

/**
 * 预定义的配置元数据
 * @description 为常见组件提供预定义的配置元数据
 */
export const PREDEFINED_CONFIG_METADATA: Record<string, ConfigItemMetadata[]> = {
  // 按钮组件配置元数据
  'el-button': [
    {
      key: 'text',
      label: '按钮文本',
      valueType: 'string',
      required: true,
      typeConfig: {
        placeholder: '请输入按钮文本'
      },
      group: '基础',
      order: 1
    },
    {
      key: 'text',
      label: '按钮文本（表达式）',
      valueType: 'expression',
      group: '基础',
      order: 2,
      advanced: true
    },
    {
      key: 'buttonType',
      label: '按钮类型',
      valueType: 'select',
      defaultValue: 'default',
      typeConfig: {
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
          { label: '文本', value: 'text' }
        ]
      },
      group: '样式',
      order: 3
    },
    {
      key: 'size',
      label: '按钮大小',
      valueType: 'select',
      defaultValue: 'default',
      typeConfig: {
        options: [
          { label: '默认', value: 'default' },
          { label: '大', value: 'large' },
          { label: '小', value: 'small' }
        ]
      },
      group: '样式',
      order: 4
    },
    {
      key: 'prefixIcon',
      label: '前置图标',
      valueType: 'icon',
      group: '图标',
      order: 5
    },
    {
      key: 'suffixIcon',
      label: '后置图标',
      valueType: 'icon',
      group: '图标',
      order: 6
    },
    {
      key: 'condition',
      label: '显示条件',
      valueType: 'expression',
      description: '配置按钮的显示/隐藏条件',
      group: '条件',
      order: 7
    },
    {
      key: 'onClick',
      label: '点击事件',
      valueType: 'eventHandler',
      description: '配置按钮点击后的操作',
      group: '事件',
      order: 8
    },
    {
      key: 'style',
      label: '自定义样式',
      valueType: 'style',
      group: '样式',
      order: 9,
      advanced: true
    }
  ],
  
  // 文本块组件配置元数据
  'text': [
    {
      key: 'content',
      label: '文本内容',
      valueType: 'string',
      required: true,
      typeConfig: {
        placeholder: '请输入文本内容'
      },
      group: '基础',
      order: 1
    },
    {
      key: 'content',
      label: '文本内容（表达式）',
      valueType: 'expression',
      description: '支持根据表单数据动态显示文本',
      group: '基础',
      order: 2
    },
    {
      key: 'prefixIcon',
      label: '前置图标',
      valueType: 'icon',
      group: '图标',
      order: 3
    },
    {
      key: 'suffixIcon',
      label: '后置图标',
      valueType: 'icon',
      group: '图标',
      order: 4
    },
    {
      key: 'style',
      label: '样式',
      valueType: 'style',
      group: '样式',
      order: 5
    },
    {
      key: 'condition',
      label: '显示条件',
      valueType: 'expression',
      group: '条件',
      order: 6
    }
  ],
  
  // 输入框组件配置元数据（用于 render 中）
  'el-input': [
    {
      key: 'fieldBinding',
      label: '绑定字段',
      valueType: 'fieldBinding',
      required: true,
      description: '选择要绑定的表单字段',
      group: '基础',
      order: 1
    },
    {
      key: 'placeholder',
      label: '占位符',
      valueType: 'string',
      typeConfig: {
        placeholder: '请输入占位符文本'
      },
      group: '基础',
      order: 2
    },
    {
      key: 'disabled',
      label: '是否禁用',
      valueType: 'boolean',
      defaultValue: false,
      group: '状态',
      order: 3
    },
    {
      key: 'disabled',
      label: '是否禁用（表达式）',
      valueType: 'expression',
      group: '状态',
      order: 4,
      advanced: true
    },
    {
      key: 'readonly',
      label: '是否只读',
      valueType: 'boolean',
      defaultValue: false,
      group: '状态',
      order: 5
    },
    {
      key: 'style',
      label: '样式',
      valueType: 'style',
      group: '样式',
      order: 6
    }
  ]
}

/**
 * 事件操作类型元数据
 */
export const EVENT_ACTION_TYPE_METADATA: EventActionTypeMetadata[] = [
  {
    type: 'setField',
    label: '设置字段值',
    description: '设置表单中某个字段的值',
    icon: 'edit',
    configMetadata: [
      {
        key: 'field',
        label: '目标字段',
        valueType: 'fieldBinding',
        required: true
      },
      {
        key: 'value',
        label: '值',
        valueType: 'expression',
        required: true
      }
    ]
  },
  {
    type: 'callFunction',
    label: '调用函数',
    description: '调用预定义的函数',
    icon: 'function',
    configMetadata: [
      {
        key: 'functionName',
        label: '函数名',
        valueType: 'select',
        required: true
      },
      {
        key: 'args',
        label: '参数',
        valueType: 'array',
        typeConfig: {
          arrayItemConfig: {
            key: 'arg',
            label: '参数',
            valueType: 'expression'
          }
        }
      }
    ]
  },
  {
    type: 'showMessage',
    label: '显示消息',
    description: '显示提示消息',
    icon: 'message',
    configMetadata: [
      {
        key: 'message',
        label: '消息内容',
        valueType: 'string',
        required: true
      },
      {
        key: 'type',
        label: '消息类型',
        valueType: 'select',
        typeConfig: {
          options: [
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
            { label: '信息', value: 'info' }
          ]
        }
      },
      {
        key: 'duration',
        label: '显示时长（毫秒）',
        valueType: 'number',
        typeConfig: {
          min: 0,
          max: 10000,
          step: 100
        }
      }
    ]
  },
  {
    type: 'request',
    label: '发送请求',
    description: '发送 HTTP 请求',
    icon: 'http',
    configMetadata: [
      {
        key: 'url',
        label: '请求地址',
        valueType: 'string',
        required: true
      },
      {
        key: 'method',
        label: '请求方法',
        valueType: 'select',
        typeConfig: {
          options: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' }
          ]
        }
      }
    ]
  },
  {
    type: 'customCode',
    label: '自定义代码',
    description: '编写自定义 JavaScript 代码',
    icon: 'code',
    configMetadata: [
      {
        key: 'code',
        label: '代码',
        valueType: 'string',
        required: true,
        typeConfig: {
          placeholder: '请输入 JavaScript 代码'
        }
      }
    ]
  }
]
