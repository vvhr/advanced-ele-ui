/**
 * 可视化配置示例
 * 
 * 这个文件展示了三个场景的完整配置数据结构，
 * 这些配置都是通过可视化配置器生成的，完全可序列化为 JSON。
 */

import type {
  VisualComponentConfig,
  ButtonConfig,
  TextBlockConfig,
  InputConfig,
  ExpressionNode,
  EventHandlerConfig,
  ConditionConfig,
  FieldBindingConfig
} from '../types/schema-json-visual'

/**
 * 场景1：条件显示的按钮
 * 
 * 需求：
 * - 创建一个按钮，文本为"查询"
 * - 仅在 formModel.type === 1 时显示
 * - 点击后设置 formModel.status = "active"
 */
export const scenario1Button: ButtonConfig = {
  type: 'el-button',
  text: '查询',
  buttonType: 'primary',
  size: 'default',
  condition: {
    expression: {
      type: 'operator',
      operator: 'eq',
      children: [
        {
          type: 'field',
          field: 'formModel.type'
        },
        {
          type: 'value',
          value: 1
        }
      ]
    }
  },
  events: {
    click: {
      eventType: 'click',
      actions: [
        {
          type: 'setField',
          setField: {
            field: 'formModel.status',
            value: {
              type: 'value',
              value: 'active'
            }
          }
        }
      ]
    }
  }
}

/**
 * 场景1的 JSON 序列化版本（可直接存储）
 */
export const scenario1ButtonJSON = {
  type: 'el-button',
  text: '查询',
  buttonType: 'primary',
  size: 'default',
  condition: {
    expression: {
      type: 'operator',
      operator: 'eq',
      children: [
        {
          type: 'field',
          field: 'formModel.type'
        },
        {
          type: 'value',
          value: 1
        }
      ]
    }
  },
  events: {
    click: {
      eventType: 'click',
      actions: [
        {
          type: 'setField',
          setField: {
            field: 'formModel.status',
            value: {
              type: 'value',
              value: 'active'
            }
          }
        }
      ]
    }
  }
}

/**
 * 场景2：动态文本块
 * 
 * 需求：
 * - 创建一个文本块
 * - 文本内容根据 formModel.type 动态变化：type === 1 显示"类型A"，否则显示"类型B"
 * - 前置图标：InfoFilled
 * - 自定义样式：字体大小14px，颜色#333，内边距8px
 */
export const scenario2TextBlock: TextBlockConfig = {
  type: 'text',
  content: {
    type: 'operator',
    operator: 'conditional', // 三元运算符的简化表示
    children: [
      {
        type: 'operator',
        operator: 'eq',
        children: [
          {
            type: 'field',
            field: 'formModel.type'
          },
          {
            type: 'value',
            value: 1
          }
        ]
      },
      {
        type: 'value',
        value: '类型A'
      },
      {
        type: 'value',
        value: '类型B'
      }
    ]
  },
  prefixIcon: {
    name: 'InfoFilled',
    library: 'element-plus'
  },
  style: {
    fontSize: '14px',
    color: '#333333',
    padding: '8px'
  }
}

/**
 * 场景2的 JSON 序列化版本
 */
export const scenario2TextBlockJSON = {
  type: 'text',
  content: {
    type: 'operator',
    operator: 'conditional',
    children: [
      {
        type: 'operator',
        operator: 'eq',
        children: [
          {
            type: 'field',
            field: 'formModel.type'
          },
          {
            type: 'value',
            value: 1
          }
        ]
      },
      {
        type: 'value',
        value: '类型A'
      },
      {
        type: 'value',
        value: '类型B'
      }
    ]
  },
  prefixIcon: {
    name: 'InfoFilled',
    library: 'element-plus'
  },
  style: {
    fontSize: '14px',
    color: '#333333',
    padding: '8px'
  }
}

/**
 * 场景3：render 中的输入框
 * 
 * 需求：
 * - 创建一个输入框
 * - 绑定到 formModel.emailDomain
 * - 占位符："请选择邮箱域名"
 * - 当 formModel.type === 2 时禁用
 */
export const scenario3Input: InputConfig = {
  type: 'el-input',
  fieldBinding: {
    type: 'fieldBinding',
    field: 'formModel.emailDomain',
    twoWay: true
  },
  placeholder: '请选择邮箱域名',
  disabled: {
    type: 'operator',
    operator: 'eq',
    children: [
      {
        type: 'field',
        field: 'formModel.type'
      },
      {
        type: 'value',
        value: 2
      }
    ]
  }
}

/**
 * 场景3的 JSON 序列化版本
 */
export const scenario3InputJSON = {
  type: 'el-input',
  fieldBinding: {
    type: 'fieldBinding',
    field: 'formModel.emailDomain',
    twoWay: true
  },
  placeholder: '请选择邮箱域名',
  disabled: {
    type: 'operator',
    operator: 'eq',
    children: [
      {
        type: 'field',
        field: 'formModel.type'
      },
      {
        type: 'value',
        value: 2
      }
    ]
  }
}

/**
 * 完整示例：appendRender 中使用场景1的按钮
 * 
 * 这个示例展示了如何在 FormSchemaForJson 的 outsideProps.appendRender 中使用可视化配置
 */
export const completeExampleAppendRender = {
  key: 'email',
  field: 'email',
  label: '邮箱',
  component: 'Input',
  componentProps: {
    style: { flex: 1 }
  },
  outsideProps: {
    enable: true,
    direction: 'row',
    style: { gap: '10px' },
    appendRender: scenario1ButtonJSON
  }
}

/**
 * 复杂事件处理示例：多个操作
 * 
 * 点击按钮后：
 * 1. 设置 formModel.status = "active"
 * 2. 显示成功消息
 * 3. 发送请求获取数据
 */
export const complexEventHandler: EventHandlerConfig = {
  eventType: 'click',
  actions: [
    {
      type: 'setField',
      setField: {
        field: 'formModel.status',
        value: {
          type: 'value',
          value: 'active'
        }
      }
    },
    {
      type: 'showMessage',
      showMessage: {
        message: '操作成功',
        type: 'success',
        duration: 2000
      }
    },
    {
      type: 'request',
      request: {
        url: '/api/user/info',
        method: 'GET',
        params: {
          id: {
            type: 'field',
            field: 'formModel.userId'
          }
        },
        onSuccess: [
          {
            type: 'setField',
            setField: {
              field: 'formModel.userInfo',
              value: {
                type: 'field',
                field: '$response.data'
              }
            }
          }
        ]
      }
    }
  ]
}

/**
 * 复杂条件示例：多个条件组合
 * 
 * 条件：formModel.type === 1 且 formModel.status !== "disabled"
 */
export const complexCondition: ConditionConfig = {
  expression: {
    type: 'operator',
    operator: 'and',
    children: [
      {
        type: 'operator',
        operator: 'eq',
        children: [
          {
            type: 'field',
            field: 'formModel.type'
          },
          {
            type: 'value',
            value: 1
          }
        ]
      },
      {
        type: 'operator',
        operator: 'ne',
        children: [
          {
            type: 'field',
            field: 'formModel.status'
          },
          {
            type: 'value',
            value: 'disabled'
          }
        ]
      }
    ]
  }
}

/**
 * 可视化配置器的使用流程示例
 * 
 * 1. 用户在可视化编辑器中配置组件
 * 2. 编辑器生成 VisualComponentConfig
 * 3. 序列化为 JSON 存储
 * 4. 运行时读取 JSON，转换为 FormSchema
 * 5. Form 组件渲染
 */
export const usageFlow = {
  step1: '用户在可视化编辑器中拖拽组件、配置属性',
  step2: '编辑器生成 VisualComponentConfig 数据结构',
  step3: 'JSON.stringify(config) 序列化为字符串',
  step4: '存储到数据库或本地存储',
  step5: '运行时读取 JSON，使用转换器转换为 FormSchema',
  step6: 'Form 组件使用 FormSchema 渲染'
}

/**
 * 表达式节点构建示例
 * 
 * 展示如何通过可视化操作构建表达式节点树
 */
export const expressionBuildingExamples = {
  // 简单比较：formModel.type === 1
  simpleComparison: {
    type: 'operator',
    operator: 'eq',
    children: [
      { type: 'field', field: 'formModel.type' },
      { type: 'value', value: 1 }
    ]
  },
  
  // 包含判断：formModel.tags 包含 "important"
  contains: {
    type: 'operator',
    operator: 'contains',
    children: [
      { type: 'field', field: 'formModel.tags' },
      { type: 'value', value: 'important' }
    ]
  },
  
  // 函数调用：formModel.items.length > 0
  functionCall: {
    type: 'operator',
    operator: 'gt',
    children: [
      {
        type: 'function',
        functionName: 'length',
        functionArgs: [
          { type: 'field', field: 'formModel.items' }
        ]
      },
      { type: 'value', value: 0 }
    ]
  },
  
  // 复杂组合：(formModel.type === 1 || formModel.type === 2) && formModel.status === "active"
  complex: {
    type: 'operator',
    operator: 'and',
    children: [
      {
        type: 'operator',
        operator: 'or',
        children: [
          {
            type: 'operator',
            operator: 'eq',
            children: [
              { type: 'field', field: 'formModel.type' },
              { type: 'value', value: 1 }
            ]
          },
          {
            type: 'operator',
            operator: 'eq',
            children: [
              { type: 'field', field: 'formModel.type' },
              { type: 'value', value: 2 }
            ]
          }
        ]
      },
      {
        type: 'operator',
        operator: 'eq',
        children: [
          { type: 'field', field: 'formModel.status' },
          { type: 'value', value: 'active' }
        ]
      }
    ]
  }
}
