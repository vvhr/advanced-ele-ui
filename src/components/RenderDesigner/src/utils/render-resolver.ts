/**
 * renderResolver 工具类
 * 
 * 将 RenderDesigner 设计的 JSON 配置解析为 Form 组件实际需要的 render 函数。
 * 
 * 非入侵式设计：Form 组件不需要知道 RenderDesigner 的存在，
 * 只需要使用标准的 render 函数即可。
 */

import type { VNode } from 'vue'
import { h } from 'vue'
import type { FormSchema } from '../../Form/src/types/schema'
import type {
  RenderComponentConfig,
  ExpressionNode,
  ConditionConfig,
  EventHandlerConfig,
  FieldBindingConfig,
  ComponentPropValue,
  RenderDesignerParams
} from '../types/designer-config'

/**
 * renderResolver 的配置选项
 */
export interface RenderResolverOptions {
  /**
   * 自定义组件注册表
   * @description 用于注册自定义组件，key 为组件名，value 为组件定义
   */
  customComponents?: Record<string, any>
  
  /**
   * 表达式执行工具
   */
  expressionTools?: Recordable
  
  /**
   * 是否启用调试模式
   */
  debug?: boolean
}

/**
 * renderResolver 类
 */
export class RenderResolver {
  private customComponents: Record<string, any>
  private expressionTools: Recordable
  private debug: boolean

  constructor(options: RenderResolverOptions = {}) {
    this.customComponents = options.customComponents || {}
    this.expressionTools = options.expressionTools || {}
    this.debug = options.debug || false
  }

  /**
   * 将 RenderDesigner 的 JSON 配置解析为 render 函数
   * 
   * @param config RenderDesigner 的 JSON 配置
   * @returns Form 组件需要的 render 函数
   */
  resolve(config: RenderComponentConfig | false | null): (
    form: Recordable,
    column: FormSchema,
    disabled: boolean,
    excontext: Recordable
  ) => VNode | false {
    if (!config || config === false || config === null) {
      return () => false
    }

    return (form: Recordable, column: FormSchema, disabled: boolean, excontext: Recordable) => {
      // 构建参数对象
      const params: RenderDesignerParams = {
        value: this.getFieldValue(form, column.field || ''),
        formModel: form,
        column,
        disabled,
        excontext,
        tools: this.expressionTools
      }

      // 检查条件渲染
      if (config.condition) {
        if (!this.evaluateCondition(config.condition, params)) {
          return false
        }
      }

      // 解析组件配置为 VNode
      return this.resolveComponent(config, params)
    }
  }

  /**
   * 解析组件配置为 VNode
   */
  private resolveComponent(
    config: RenderComponentConfig,
    params: RenderDesignerParams
  ): VNode {
    const { type, props = {}, children, slots, style, className, events } = config

    // 处理 props
    const processedProps: Record<string, any> = {}
    for (const [key, value] of Object.entries(props)) {
      processedProps[key] = this.resolvePropValue(value, params)
    }

    // 处理样式
    if (style) {
      const processedStyle: Record<string, any> = {}
      for (const [key, value] of Object.entries(style)) {
        processedStyle[key] = this.resolvePropValue(value, params)
      }
      processedProps.style = processedStyle
    }

    // 处理类名
    if (className) {
      const classNameValue = this.resolvePropValue(className, params)
      if (classNameValue) {
        processedProps.class = classNameValue
      }
    }

    // 处理事件
    if (events) {
      for (const [eventName, handler] of Object.entries(events)) {
        const propName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
        processedProps[propName] = (...args: any[]) => {
          this.executeEventHandler(handler, params, args)
        }
      }
    }

    // 处理 children
    let processedChildren: any = undefined
    if (children !== undefined) {
      processedChildren = this.resolveChildren(children, params)
    }

    // 处理 slots
    const processedSlots: Record<string, () => VNode | VNode[]> = {}
    if (slots) {
      for (const [slotName, slotConfig] of Object.entries(slots)) {
        if (Array.isArray(slotConfig)) {
          processedSlots[slotName] = () =>
            slotConfig.map(config => this.resolveComponent(config, params))
        } else {
          processedSlots[slotName] = () => this.resolveComponent(slotConfig, params)
        }
      }
    }

    // 获取组件定义
    const component = this.getComponent(type)

    // 使用 h 函数创建 VNode
    return h(component, processedProps, processedChildren, processedSlots)
  }

  /**
   * 解析属性值
   */
  private resolvePropValue(
    value: ComponentPropValue,
    params: RenderDesignerParams
  ): any {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value
    }

    if (!value || typeof value !== 'object') {
      return value
    }

    // ExpressionNode
    if ('type' in value && 'field' in value) {
      return this.evaluateExpression(value as ExpressionNode, params)
    }

    // FieldBindingConfig
    if ('type' in value && (value as any).type === 'fieldBinding') {
      const binding = value as FieldBindingConfig
      return this.getFieldValue(params.formModel, binding.field)
    }

    // RenderComponentConfig（递归解析）
    if ('type' in value && !('field' in value)) {
      return this.resolveComponent(value as RenderComponentConfig, params)
    }

    return value
  }

  /**
   * 解析 children
   */
  private resolveChildren(
    children: string | ExpressionNode | RenderComponentConfig | RenderComponentConfig[],
    params: RenderDesignerParams
  ): any {
    if (typeof children === 'string') {
      return children
    }

    if (Array.isArray(children)) {
      return children.map(child => {
        if (typeof child === 'string') {
          return child
        }
        if ('type' in child && 'field' in child) {
          return this.evaluateExpression(child as ExpressionNode, params)
        }
        return this.resolveComponent(child as RenderComponentConfig, params)
      })
    }

    if ('type' in children && 'field' in children) {
      return this.evaluateExpression(children as ExpressionNode, params)
    }

    return this.resolveComponent(children as RenderComponentConfig, params)
  }

  /**
   * 评估表达式
   */
  private evaluateExpression(node: ExpressionNode, params: RenderDesignerParams): any {
    switch (node.type) {
      case 'field':
        return this.getFieldValue(params.formModel, node.field || '')

      case 'value':
        return node.value

      case 'operator':
        return this.evaluateOperator(node, params)

      case 'function':
        return this.evaluateFunction(node, params)

      case 'group':
        if (node.children && node.children.length > 0) {
          return this.evaluateExpression(node.children[0], params)
        }
        return undefined

      default:
        return undefined
    }
  }

  /**
   * 评估操作符表达式
   */
  private evaluateOperator(node: ExpressionNode, params: RenderDesignerParams): any {
    if (!node.children || node.children.length < 2) {
      return undefined
    }

    const left = this.evaluateExpression(node.children[0], params)
    const right = this.evaluateExpression(node.children[1], params)
    const operator = node.operator || 'eq'

    switch (operator) {
      case 'eq':
        return left === right
      case 'ne':
        return left !== right
      case 'gt':
        return left > right
      case 'gte':
        return left >= right
      case 'lt':
        return left < right
      case 'lte':
        return left <= right
      case 'and':
        return left && right
      case 'or':
        return left || right
      case 'contains':
        if (Array.isArray(left)) {
          return left.includes(right)
        }
        if (typeof left === 'string') {
          return left.includes(String(right))
        }
        return false
      default:
        return undefined
    }
  }

  /**
   * 评估函数调用
   */
  private evaluateFunction(node: ExpressionNode, params: RenderDesignerParams): any {
    if (!node.functionName) {
      return undefined
    }

    const args = (node.functionArgs || []).map(arg => this.evaluateExpression(arg, params))

    // 内置函数
    switch (node.functionName) {
      case 'length':
        return args[0]?.length || 0
      case 'isEmpty':
        return !args[0] || (Array.isArray(args[0]) && args[0].length === 0)
      case 'isNotEmpty':
        return args[0] && (!Array.isArray(args[0]) || args[0].length > 0)
      default:
        // 尝试从 tools 中获取函数
        if (params.tools && typeof params.tools[node.functionName] === 'function') {
          return params.tools[node.functionName](...args)
        }
        return undefined
    }
  }

  /**
   * 评估条件配置
   */
  private evaluateCondition(condition: ConditionConfig, params: RenderDesignerParams): boolean {
    const result = this.evaluateExpression(condition.expression, params)
    return condition.not ? !result : result
  }

  /**
   * 执行事件处理器
   */
  private executeEventHandler(
    handler: EventHandlerConfig,
    params: RenderDesignerParams,
    eventArgs: any[]
  ): void {
    if (!handler.actions || handler.actions.length === 0) {
      return
    }

    for (const action of handler.actions) {
      this.executeEventAction(action, params, eventArgs)
    }
  }

  /**
   * 执行事件操作
   */
  private executeEventAction(
    action: any,
    params: RenderDesignerParams,
    eventArgs: any[]
  ): void {
    switch (action.type) {
      case 'setField':
        if (action.setField) {
          const field = action.setField.field.replace('formModel.', '')
          const value = this.evaluateExpression(action.setField.value, params)
          this.setFieldValue(params.formModel, field, value)
        }
        break

      case 'callFunction':
        if (action.callFunction) {
          const functionName = action.callFunction.functionName
          const args = (action.callFunction.args || []).map((arg: ExpressionNode) =>
            this.evaluateExpression(arg, params)
          )
          if (params.tools && typeof params.tools[functionName] === 'function') {
            params.tools[functionName](...args)
          }
        }
        break

      case 'showMessage':
        if (action.showMessage) {
          const message =
            typeof action.showMessage.message === 'string'
              ? action.showMessage.message
              : this.evaluateExpression(action.showMessage.message, params)
          // 这里需要实际的消息提示实现
          if (this.debug) {
            console.log('showMessage:', message, action.showMessage.type)
          }
        }
        break

      case 'customCode':
        if (action.customCode) {
          try {
            // 注意：生产环境应该使用更安全的代码执行方式
            const func = new Function(
              'formModel',
              'form',
              'column',
              'disabled',
              'excontext',
              'tools',
              'event',
              action.customCode
            )
            func(
              params.formModel,
              params.formModel,
              params.column,
              params.disabled,
              params.excontext,
              params.tools,
              eventArgs[0]
            )
          } catch (error) {
            console.error('执行自定义代码错误:', error)
          }
        }
        break

      default:
        if (this.debug) {
          console.warn('未知的事件操作类型:', action.type)
        }
    }
  }

  /**
   * 获取组件定义
   */
  private getComponent(type: string): any {
    // 优先查找自定义组件
    if (this.customComponents[type]) {
      return this.customComponents[type]
    }

    // Element Plus 组件（需要动态导入）
    if (type.startsWith('el-')) {
      // 这里需要根据实际情况导入 Element Plus 组件
      // 示例：return ElButton, ElInput 等
      // 实际实现时需要根据 type 动态导入
      return type
    }

    // 原生 HTML 标签
    return type
  }

  /**
   * 获取字段值
   */
  private getFieldValue(obj: Recordable, path: string): any {
    if (!path) return undefined
    const keys = path.replace('formModel.', '').split('.')
    let value = obj
    for (const key of keys) {
      if (value == null) return undefined
      value = value[key]
    }
    return value
  }

  /**
   * 设置字段值
   */
  private setFieldValue(obj: Recordable, path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    let target = obj
    for (const key of keys) {
      if (target[key] == null) {
        target[key] = {}
      }
      target = target[key]
    }
    target[lastKey] = value
  }
}

/**
 * 创建默认的 renderResolver 实例
 */
export function createRenderResolver(options?: RenderResolverOptions): RenderResolver {
  return new RenderResolver(options)
}

/**
 * 便捷函数：直接将 JSON 配置解析为 render 函数
 */
export function resolveRender(
  config: RenderComponentConfig | false | null,
  options?: RenderResolverOptions
): (
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => VNode | false {
  const resolver = createRenderResolver(options)
  return resolver.resolve(config)
}
