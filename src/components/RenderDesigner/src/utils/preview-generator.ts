/**
 * 预览内容生成器
 * 
 * 将 RenderComponentConfig 转换为易于阅读的预览文本
 */

import type { RenderComponentConfig, ExpressionNode } from '../types/designer-config'

/**
 * 生成预览内容
 */
export function generatePreview(config: RenderComponentConfig): string {
  if (!config || !config.type) {
    return ''
  }

  const parts: string[] = []

  // 组件类型
  const typeLabel = getComponentLabel(config.type)
  parts.push(`<strong>${typeLabel}</strong>`)

  // 条件
  if (config.condition) {
    const conditionText = expressionToText(config.condition.expression)
    parts.push(`<span style="color: #909399;">条件: ${conditionText}</span>`)
  }

  // 文本内容
  if (config.children) {
    if (typeof config.children === 'string') {
      parts.push(`"${config.children}"`)
    } else if (typeof config.children === 'object' && 'type' in config.children) {
      if ((config.children as ExpressionNode).type === 'field') {
        parts.push(`{{ ${(config.children as ExpressionNode).field} }}`)
      } else if ((config.children as ExpressionNode).type === 'value') {
        parts.push(`"${(config.children as ExpressionNode).value}"`)
      }
    }
  }

  // 属性摘要
  if (config.props) {
    const propSummary: string[] = []
    if (config.props.type) {
      propSummary.push(`type=${config.props.type}`)
    }
    if (config.props.size) {
      propSummary.push(`size=${config.props.size}`)
    }
    if (propSummary.length > 0) {
      parts.push(`<span style="color: #67c23a;">${propSummary.join(', ')}</span>`)
    }
  }

  // 事件摘要
  if (config.events && Object.keys(config.events).length > 0) {
    const eventNames = Object.keys(config.events)
    parts.push(`<span style="color: #e6a23c;">事件: ${eventNames.join(', ')}</span>`)
  }

  return parts.join(' | ')
}

/**
 * 获取组件标签
 */
function getComponentLabel(type: string): string {
  const labels: Record<string, string> = {
    'el-button': '按钮',
    'el-input': '输入框',
    'el-select': '选择器',
    'el-date-picker': '日期选择器',
    'el-switch': '开关',
    'el-radio': '单选框',
    'el-checkbox': '复选框',
    'el-icon': '图标',
    'el-tag': '标签',
    'el-badge': '徽章',
    'el-link': '链接',
    'h1': '标题1',
    'h2': '标题2',
    'h3': '标题3',
    'p': '段落',
    'span': '文本',
    'text': '文本节点',
    'div': '容器',
    'strong': '强调',
    'em': '斜体',
    'code': '代码'
  }
  return labels[type] || type
}

/**
 * 将表达式节点转换为文本
 */
function expressionToText(node: ExpressionNode): string {
  switch (node.type) {
    case 'field':
      return node.field || ''
    
    case 'value':
      return String(node.value)
    
    case 'operator':
      if (!node.children || node.children.length < 2) {
        return ''
      }
      const operatorMap: Record<string, string> = {
        'eq': '===',
        'ne': '!==',
        'gt': '>',
        'gte': '>=',
        'lt': '<',
        'lte': '<=',
        'and': '且',
        'or': '或',
        'contains': '包含'
      }
      const operator = operatorMap[node.operator || 'eq'] || node.operator
      const left = expressionToText(node.children[0])
      const right = expressionToText(node.children[1])
      return `${left} ${operator} ${right}`
    
    case 'function':
      if (!node.functionName) return ''
      const args = (node.functionArgs || [])
        .map(arg => expressionToText(arg))
        .join(', ')
      return `${node.functionName}(${args})`
    
    default:
      return ''
  }
}
