/**
 * VisualComponentConfig 到 ComponentConfig 的转换器
 * 
 * 这个文件实现了将可视化配置转换为组件配置的转换逻辑，
 * 包括表达式节点转换为字符串表达式、事件处理器转换为代码等。
 */

import type {
  VisualComponentConfig,
  ExpressionNode,
  EventHandlerConfig,
  ConditionConfig,
  FieldBindingConfig,
  ComponentPropValue
} from '../types/schema-json-visual'
import type { ComponentConfig } from '../types/schema-json'

/**
 * 将表达式节点转换为字符串表达式
 * 
 * @param node 表达式节点
 * @returns 字符串表达式
 */
export function expressionNodeToString(node: ExpressionNode): string {
  switch (node.type) {
    case 'field':
      return node.field || ''
    
    case 'value':
      // 处理不同类型的值
      if (typeof node.value === 'string') {
        return `'${node.value}'`
      }
      if (node.value === null || node.value === undefined) {
        return 'null'
      }
      return String(node.value)
    
    case 'operator':
      if (!node.children || node.children.length === 0) {
        return ''
      }
      
      const operatorMap: Record<string, string> = {
        'eq': '===',
        'ne': '!==',
        'gt': '>',
        'gte': '>=',
        'lt': '<',
        'lte': '<=',
        'and': '&&',
        'or': '||',
        'not': '!',
        'in': 'in',
        'notIn': '!in',
        'contains': '.includes',
        'startsWith': '.startsWith',
        'endsWith': '.endsWith',
        'conditional': '?'
      }
      
      const operator = operatorMap[node.operator || 'eq'] || node.operator
      
      // 处理特殊操作符
      if (node.operator === 'contains' && node.children.length >= 2) {
        const left = expressionNodeToString(node.children[0])
        const right = expressionNodeToString(node.children[1])
        return `${left}${operator}(${right})`
      }
      
      if (node.operator === 'conditional' && node.children.length >= 3) {
        // 三元运算符
        const condition = expressionNodeToString(node.children[0])
        const trueValue = expressionNodeToString(node.children[1])
        const falseValue = expressionNodeToString(node.children[2])
        return `${condition} ? ${trueValue} : ${falseValue}`
      }
      
      if (node.operator === 'not' && node.children.length >= 1) {
        const child = expressionNodeToString(node.children[0])
        return `${operator}${child}`
      }
      
      // 二元操作符
      if (node.children.length >= 2) {
        const left = expressionNodeToString(node.children[0])
        const right = expressionNodeToString(node.children[1])
        return `(${left} ${operator} ${right})`
      }
      
      return ''
    
    case 'function':
      if (!node.functionName) {
        return ''
      }
      
      const args = (node.functionArgs || [])
        .map(arg => expressionNodeToString(arg))
        .join(', ')
      
      // 处理字段上的函数调用（如 formModel.items.length）
      if (node.functionName === 'length' && args) {
        return `${args}.length`
      }
      
      return `${node.functionName}(${args})`
    
    case 'group':
      if (!node.children || node.children.length === 0) {
        return ''
      }
      const groupContent = node.children
        .map(child => expressionNodeToString(child))
        .join(' ')
      return `(${groupContent})`
    
    default:
      return ''
  }
}

/**
 * 将条件配置转换为字符串表达式
 */
export function conditionConfigToString(condition: ConditionConfig): string {
  let expression = expressionNodeToString(condition.expression)
  if (condition.not) {
    expression = `!(${expression})`
  }
  return expression
}

/**
 * 将事件操作转换为代码字符串
 */
export function eventActionToCode(action: any, form: Recordable): string {
  switch (action.type) {
    case 'setField': {
      const field = action.setField?.field?.replace('formModel.', '') || ''
      const value = expressionNodeToString(action.setField?.value || { type: 'value', value: null })
      return `form.${field} = ${value}`
    }
    
    case 'callFunction': {
      const functionName = action.callFunction?.functionName || ''
      const args = (action.callFunction?.args || [])
        .map((arg: ExpressionNode) => expressionNodeToString(arg))
        .join(', ')
      return `${functionName}(${args})`
    }
    
    case 'showMessage': {
      const message = typeof action.showMessage?.message === 'string'
        ? `'${action.showMessage.message}'`
        : expressionNodeToString(action.showMessage?.message || { type: 'value', value: '' })
      const type = action.showMessage?.type || 'info'
      const duration = action.showMessage?.duration || 3000
      return `tools.showMessage({ message: ${message}, type: '${type}', duration: ${duration} })`
    }
    
    case 'navigate': {
      const url = typeof action.navigate?.url === 'string'
        ? `'${action.navigate.url}'`
        : expressionNodeToString(action.navigate?.url || { type: 'value', value: '' })
      const target = action.navigate?.target || '_self'
      return `window.open(${url}, '${target}')`
    }
    
    case 'request': {
      // 请求操作比较复杂，这里简化处理
      const url = typeof action.request?.url === 'string'
        ? `'${action.request.url}'`
        : expressionNodeToString(action.request?.url || { type: 'value', value: '' })
      const method = action.request?.method || 'GET'
      return `// 发送请求: ${method} ${url}`
    }
    
    case 'customCode': {
      return action.customCode || ''
    }
    
    default:
      return ''
  }
}

/**
 * 将事件处理器配置转换为代码字符串
 */
export function eventHandlerToCode(handler: EventHandlerConfig): string {
  if (!handler.actions || handler.actions.length === 0) {
    return ''
  }
  
  const actionsCode = handler.actions
    .map(action => eventActionToCode(action, {}))
    .filter(code => code)
    .join('; ')
  
  if (!actionsCode) {
    return ''
  }
  
  return `{{ ${actionsCode} }}`
}

/**
 * 将组件属性值转换为 ComponentConfig 中的属性值
 */
function convertPropValue(
  value: ComponentPropValue,
  form: Recordable
): any {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  
  if (value && typeof value === 'object') {
    // ExpressionNode
    if ('type' in value && 'field' in value) {
      const exprNode = value as ExpressionNode
      return `{{ ${expressionNodeToString(exprNode)} }}`
    }
    
    // FieldBindingConfig
    if ('type' in value && (value as any).type === 'fieldBinding') {
      const binding = value as FieldBindingConfig
      return `form.${binding.field.replace('formModel.', '')}`
    }
    
    // VisualComponentConfig (递归转换)
    if ('type' in value && !('field' in value)) {
      return visualComponentConfigToComponentConfig(value as VisualComponentConfig)
    }
  }
  
  return value
}

/**
 * 将 VisualComponentConfig 转换为 ComponentConfig
 */
export function visualComponentConfigToComponentConfig(
  config: VisualComponentConfig
): ComponentConfig {
  const result: ComponentConfig = {
    type: config.type
  }
  
  // 转换 props
  if (config.props) {
    result.props = {}
    for (const [key, value] of Object.entries(config.props)) {
      result.props[key] = convertPropValue(value, {})
    }
  }
  
  // 转换 children
  if (config.children) {
    if (typeof config.children === 'string') {
      result.children = config.children
    } else if (Array.isArray(config.children)) {
      result.children = config.children.map(child =>
        typeof child === 'string'
          ? child
          : visualComponentConfigToComponentConfig(child)
      )
    } else if (typeof config.children === 'object' && 'type' in config.children) {
      result.children = visualComponentConfigToComponentConfig(config.children as VisualComponentConfig)
    } else if (typeof config.children === 'object' && 'type' in (config.children as any)) {
      // ExpressionNode
      result.children = `{{ ${expressionNodeToString(config.children as ExpressionNode)} }}`
    }
  }
  
  // 转换 slots
  if (config.slots) {
    result.slots = {}
    for (const [slotName, slotValue] of Object.entries(config.slots)) {
      if (Array.isArray(slotValue)) {
        result.slots[slotName] = slotValue.map(item =>
          visualComponentConfigToComponentConfig(item)
        )
      } else {
        result.slots[slotName] = visualComponentConfigToComponentConfig(slotValue)
      }
    }
  }
  
  // 转换事件
  if (config.events) {
    if (!result.props) {
      result.props = {}
    }
    
    for (const [eventName, handler] of Object.entries(config.events)) {
      // 将事件名转换为组件事件属性名
      // click -> onClick, change -> onChange
      const propName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
      result.props[propName] = eventHandlerToCode(handler)
    }
  }
  
  // 转换条件（如果有条件配置，需要在外部处理）
  // 因为 ComponentConfig 本身不支持条件，条件需要在渲染时处理
  
  // 转换样式
  if (config.style) {
    if (!result.props) {
      result.props = {}
    }
    result.props.style = config.style
  }
  
  // 转换 className
  if (config.className) {
    if (!result.props) {
      result.props = {}
    }
    if (typeof config.className === 'string') {
      result.props.class = config.className
    } else {
      result.props.class = `{{ ${expressionNodeToString(config.className)} }}`
    }
  }
  
  return result
}

/**
 * 处理条件渲染的辅助函数
 * 
 * 这个函数用于在渲染时根据条件决定是否渲染组件
 */
export function shouldRenderComponent(
  config: VisualComponentConfig,
  form: Recordable,
  column: any,
  disabled: boolean,
  excontext: Recordable
): boolean {
  if (!config.condition) {
    return true
  }
  
  try {
    // 构建执行环境
    const context: Record<string, any> = {
      formModel: form,
      form,
      column,
      disabled,
      excontext,
      tools: {} // 工具函数
    }
    
    // 将表达式节点转换为可执行的代码
    const expressionCode = expressionNodeToString(config.condition.expression)
    
    // 执行表达式（这里简化处理，实际应该使用安全的表达式执行器）
    // 注意：生产环境应该使用更安全的表达式执行方式
    const func = new Function(
      'formModel',
      'form',
      'column',
      'disabled',
      'excontext',
      'tools',
      `return ${expressionCode}`
    )
    
    const result = func(form, form, column, disabled, excontext, {})
    
    return config.condition.not ? !result : result
  } catch (error) {
    console.error('条件表达式执行错误:', error)
    return true
  }
}
