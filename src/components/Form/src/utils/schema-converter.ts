import type { VNode } from 'vue'
import { h } from 'vue'
import type { FormSchema } from '../types/schema'
import type {
  FormSchemaForJson,
  ComponentConfig,
  RenderForJson,
  FormItemPropsForJson,
  OutsidePropsForJson,
  InsidePropsForJson
} from '../types/schema-json'
import type { FormSchemaFn } from '../types/schema-ext'
import { runFormSchemaExpFunction } from './optimized-expression'
import { expressionTools } from '../tools'
import { isFunction } from '@/utils/is'

/**
 * 将组件配置对象转换为 VNode
 * @param config 组件配置对象
 * @param form 表单数据对象
 * @param column 当前列配置
 * @param disabled 表单是否禁用
 * @param excontext 表单数据源上下文
 */
function componentConfigToVNode(
  config: ComponentConfig,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
): VNode {
  const { type, props = {}, children, slots } = config

  // 处理 props，将字符串表达式转换为实际值
  const processedProps: Record<string, any> = {}
  let vModelProcessed = false // 标记是否已处理 vModel
  
  for (const [key, value] of Object.entries(props)) {
    // 跳过已处理的 vModel
    if (vModelProcessed && (key === 'vModel' || key === 'modelValue')) {
      continue
    }
    
    if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
      // 表达式字符串，执行表达式
      const code = value.slice(2, -2).trim()
      processedProps[key] = runFormSchemaExpFunction(code, form, column, disabled, excontext, expressionTools)
    } else if (key === 'vModel' || key === 'modelValue') {
      // Vue 3 v-model 绑定
      if (typeof value === 'string' && value.startsWith('form.')) {
        // vModel 绑定到表单字段
        const fieldPath = value.replace('form.', '')
        const fieldValue = getNestedValue(form, fieldPath)
        processedProps['modelValue'] = fieldValue
        // 添加 update:modelValue 事件处理
        processedProps['onUpdate:modelValue'] = (newValue: any) => {
          setNestedValue(form, fieldPath, newValue)
        }
        vModelProcessed = true
      } else {
        processedProps[key] = value
      }
    } else if (key.startsWith('on') && typeof value === 'string') {
      // 事件处理函数
      if (value.startsWith('{{') && value.endsWith('}}')) {
        const code = value.slice(2, -2).trim()
        processedProps[key] = (...args: any[]) => {
          // 将事件参数注入到表达式中
          const extendedCode = code.replace(/\$event/g, 'arguments[0]')
          runFormSchemaExpFunction(extendedCode, form, column, disabled, excontext, expressionTools)
        }
      } else {
        processedProps[key] = value
      }
    } else {
      processedProps[key] = value
    }
  }

  // 处理 children
  let processedChildren: any = undefined
  if (children !== undefined) {
    if (typeof children === 'string') {
      processedChildren = children
    } else if (Array.isArray(children)) {
      processedChildren = children.map(child =>
        componentConfigToVNode(child, form, column, disabled, excontext)
      )
    } else {
      processedChildren = componentConfigToVNode(children, form, column, disabled, excontext)
    }
  }

  // 处理 slots
  const processedSlots: Record<string, () => VNode | VNode[]> = {}
  if (slots) {
    for (const [slotName, slotConfig] of Object.entries(slots)) {
      if (Array.isArray(slotConfig)) {
        processedSlots[slotName] = () =>
          slotConfig.map(config => componentConfigToVNode(config, form, column, disabled, excontext))
      } else {
        processedSlots[slotName] = () => componentConfigToVNode(slotConfig, form, column, disabled, excontext)
      }
    }
  }

  // 使用 h 函数创建 VNode
  return h(type, processedProps, processedChildren, processedSlots)
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: Recordable, path: string): any {
  const keys = path.split('.')
  let value = obj
  for (const key of keys) {
    if (value == null) return undefined
    value = value[key]
  }
  return value
}

/**
 * 设置嵌套对象的值
 */
function setNestedValue(obj: Recordable, path: string, newValue: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let target = obj
  for (const key of keys) {
    if (target[key] == null) {
      target[key] = {}
    }
    target = target[key]
  }
  target[lastKey] = newValue
}

/**
 * 将 RenderForJson 转换为渲染函数
 */
function renderForJsonToFunction(render: RenderForJson): FormSchemaFn<VNode | false> {
  if (render === false) {
    return () => false
  }

  if (typeof render === 'string') {
    // 字符串表达式
    if (render.startsWith('{{') && render.endsWith('}}')) {
      const code = render.slice(2, -2).trim()
      return (form, column, disabled, excontext) => {
        const result = runFormSchemaExpFunction(code, form, column, disabled, excontext, expressionTools)
        // 如果结果是 VNode，直接返回；如果是其他值，尝试转换
        if (result && typeof result === 'object' && 'type' in result) {
          return result as VNode
        }
        return false
      }
    } else {
      // 纯 JSX 代码字符串（需要运行时编译，这里简化处理）
      // 实际使用时，可能需要使用 JSX 编译器或 Babel 转换
      return () => false
    }
  }

  // ComponentConfig 对象
  return (form, column, disabled, excontext) => {
    return componentConfigToVNode(render, form, column, disabled, excontext)
  }
}

/**
 * 将字符串表达式转换为函数
 */
function stringToFunction<T>(value: string | T, defaultValue?: T): FormSchemaFn<T> | T {
  if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
    const code = value.slice(2, -2).trim()
    return ((form, column, disabled, excontext) => {
      return runFormSchemaExpFunction(code, form, column, disabled, excontext, expressionTools) as T
    }) as FormSchemaFn<T>
  }
  return value as T
}

/**
 * 将 FormSchemaForJson 转换为 FormSchema
 */
export function jsonToFormSchema(jsonSchema: FormSchemaForJson): FormSchema {
  const schema: any = {
    ...jsonSchema
  }

  // 转换 label
  if (schema.label !== undefined) {
    schema.label = stringToFunction(schema.label, '')
  }

  // 转换 hidden
  if (schema.hidden !== undefined) {
    schema.hidden = stringToFunction(schema.hidden, false)
  }

  // 转换 value
  if (schema.value !== undefined) {
    schema.value = stringToFunction(schema.value, null)
  }

  // 转换 render（CustomSchema）
  if (schema.render !== undefined) {
    schema.render = renderForJsonToFunction(schema.render)
  }

  // 转换 formItemProps
  if (schema.formItemProps) {
    const formItemProps: any = { ...schema.formItemProps }
    if (formItemProps.noLabel !== undefined) {
      formItemProps.noLabel = stringToFunction(formItemProps.noLabel, false)
    }
    if (formItemProps.subLabel !== undefined) {
      formItemProps.subLabel = stringToFunction(formItemProps.subLabel, '')
    }
    if (formItemProps.subLabelRender !== undefined) {
      formItemProps.subLabelRender = renderForJsonToFunction(formItemProps.subLabelRender)
    }
    schema.formItemProps = formItemProps
  }

  // 转换 outsideProps
  if (schema.outsideProps) {
    const outsideProps: any = { ...schema.outsideProps }
    if (outsideProps.enable !== undefined) {
      outsideProps.enable = stringToFunction(outsideProps.enable, false)
    }
    if (outsideProps.prependSlot !== undefined) {
      outsideProps.prependSlot = stringToFunction(outsideProps.prependSlot, false)
    }
    if (outsideProps.appendSlot !== undefined) {
      outsideProps.appendSlot = stringToFunction(outsideProps.appendSlot, false)
    }
    if (outsideProps.prependRender !== undefined) {
      outsideProps.prependRender = renderForJsonToFunction(outsideProps.prependRender)
    }
    if (outsideProps.appendRender !== undefined) {
      outsideProps.appendRender = renderForJsonToFunction(outsideProps.appendRender)
    }
    schema.outsideProps = outsideProps
  }

  // 转换 insideProps
  if (schema.insideProps) {
    const insideProps: any = { ...schema.insideProps }
    if (insideProps.slots) {
      const slots: Record<string, any> = {}
      for (const [key, value] of Object.entries(insideProps.slots)) {
        slots[key] = stringToFunction(value as string | boolean, false)
      }
      insideProps.slots = slots
    }
    if (insideProps.renders) {
      const renders: Record<string, any> = {}
      for (const [key, value] of Object.entries(insideProps.renders)) {
        renders[key] = renderForJsonToFunction(value as RenderForJson)
      }
      insideProps.renders = renders
    }
    schema.insideProps = insideProps
  }

  // 转换 componentProps 中的表达式属性
  if (schema.componentProps) {
    const componentProps: Record<string, any> = {}
    for (const [key, value] of Object.entries(schema.componentProps)) {
      if (key.startsWith('_v_') && typeof value === 'string' && value.startsWith('{{')) {
        // 动态属性
        const code = value.slice(2, -2).trim()
        componentProps[key] = (form: Recordable, column: FormSchema, disabled: boolean, excontext: Recordable) => {
          return runFormSchemaExpFunction(code, form, column, disabled, excontext, expressionTools)
        }
      } else {
        componentProps[key] = value
      }
    }
    schema.componentProps = componentProps
  }

  // 转换 componentEvent
  if (schema.componentEvent) {
    const componentEvent: Record<string, any> = {}
    for (const [key, value] of Object.entries(schema.componentEvent)) {
      if (typeof value === 'string' && value.startsWith('{{')) {
        const code = value.slice(2, -2).trim()
        componentEvent[key] = (event: any, form: Recordable, column: FormSchema, disabled: boolean, excontext: Recordable) => {
          runFormSchemaExpFunction(code, form, column, disabled, excontext, expressionTools)
        }
      } else {
        componentEvent[key] = value
      }
    }
    schema.componentEvent = componentEvent
  }

  // 递归转换 children
  if (schema.children && Array.isArray(schema.children)) {
    schema.children = schema.children.map((child: FormSchemaForJson) => jsonToFormSchema(child))
  }

  return schema as FormSchema
}

/**
 * 批量转换 FormSchemaForJson 数组为 FormSchema 数组
 */
export function jsonToFormSchemas(jsonSchemas: FormSchemaForJson[]): FormSchema[] {
  return jsonSchemas.map(jsonToFormSchema)
}

/**
 * 将函数转换为字符串表达式（如果可能）
 * @description 仅支持简单的函数，复杂函数无法转换
 */
function functionToString<T>(fn: FormSchemaFn<T> | T): string | T {
  if (!isFunction(fn)) {
    return fn as T
  }

  try {
    const fnString = fn.toString()
    // 检查是否是箭头函数或普通函数
    // 这里简化处理，实际可能需要更复杂的解析
    if (fnString.includes('=>') || fnString.startsWith('function')) {
      // 尝试提取函数体
      // 注意：这只是一个简单的实现，可能无法处理所有情况
      return `{{ ${fnString} }}`
    }
  } catch (e) {
    // 无法转换，返回原值
  }

  return fn as T
}

/**
 * 将 FormSchema 转换为 FormSchemaForJson
 * @description 注意：函数和 VNode 无法完全转换回 JSON，此函数主要用于基础转换
 * 对于复杂的 render 函数，需要手动转换为 ComponentConfig 或字符串表达式
 */
export function formSchemaToJson(schema: FormSchema): FormSchemaForJson {
  const jsonSchema: any = {
    ...schema
  }

  // 转换 label
  if (jsonSchema.label !== undefined) {
    jsonSchema.label = functionToString(jsonSchema.label)
  }

  // 转换 hidden
  if (jsonSchema.hidden !== undefined) {
    jsonSchema.hidden = functionToString(jsonSchema.hidden)
  }

  // 转换 value
  if (jsonSchema.value !== undefined) {
    jsonSchema.value = functionToString(jsonSchema.value)
  }

  // 转换 render（CustomSchema）
  // 注意：VNode 无法直接序列化，需要手动处理
  if (jsonSchema.render !== undefined) {
    // 如果 render 是函数，尝试转换为字符串
    // 但 VNode 返回值无法序列化，需要用户手动处理
    jsonSchema.render = functionToString(jsonSchema.render)
    // 实际使用时，可能需要用户手动将 render 转换为 ComponentConfig
  }

  // 转换 formItemProps
  if (jsonSchema.formItemProps) {
    const formItemProps: any = { ...jsonSchema.formItemProps }
    if (formItemProps.noLabel !== undefined) {
      formItemProps.noLabel = functionToString(formItemProps.noLabel)
    }
    if (formItemProps.subLabel !== undefined) {
      formItemProps.subLabel = functionToString(formItemProps.subLabel)
    }
    if (formItemProps.subLabelRender !== undefined) {
      formItemProps.subLabelRender = functionToString(formItemProps.subLabelRender)
    }
    jsonSchema.formItemProps = formItemProps
  }

  // 转换 outsideProps
  if (jsonSchema.outsideProps) {
    const outsideProps: any = { ...jsonSchema.outsideProps }
    if (outsideProps.enable !== undefined) {
      outsideProps.enable = functionToString(outsideProps.enable)
    }
    if (outsideProps.prependSlot !== undefined) {
      outsideProps.prependSlot = functionToString(outsideProps.prependSlot)
    }
    if (outsideProps.appendSlot !== undefined) {
      outsideProps.appendSlot = functionToString(outsideProps.appendSlot)
    }
    if (outsideProps.prependRender !== undefined) {
      outsideProps.prependRender = functionToString(outsideProps.prependRender)
    }
    if (outsideProps.appendRender !== undefined) {
      outsideProps.appendRender = functionToString(outsideProps.appendRender)
    }
    jsonSchema.outsideProps = outsideProps
  }

  // 转换 insideProps
  if (jsonSchema.insideProps) {
    const insideProps: any = { ...jsonSchema.insideProps }
    if (insideProps.slots) {
      const slots: Record<string, any> = {}
      for (const [key, value] of Object.entries(insideProps.slots)) {
        slots[key] = functionToString(value)
      }
      insideProps.slots = slots
    }
    if (insideProps.renders) {
      const renders: Record<string, any> = {}
      for (const [key, value] of Object.entries(insideProps.renders)) {
        renders[key] = functionToString(value)
      }
      insideProps.renders = renders
    }
    jsonSchema.insideProps = insideProps
  }

  // 转换 componentProps 中的动态属性
  if (jsonSchema.componentProps) {
    const componentProps: Record<string, any> = {}
    for (const [key, value] of Object.entries(jsonSchema.componentProps)) {
      if (key.startsWith('_v_') && isFunction(value)) {
        componentProps[key] = functionToString(value)
      } else {
        componentProps[key] = value
      }
    }
    jsonSchema.componentProps = componentProps
  }

  // 转换 componentEvent
  if (jsonSchema.componentEvent) {
    const componentEvent: Record<string, any> = {}
    for (const [key, value] of Object.entries(jsonSchema.componentEvent)) {
      if (isFunction(value)) {
        componentEvent[key] = functionToString(value)
      } else {
        componentEvent[key] = value
      }
    }
    jsonSchema.componentEvent = componentEvent
  }

  // 递归转换 children
  if (jsonSchema.children && Array.isArray(jsonSchema.children)) {
    jsonSchema.children = jsonSchema.children.map((child: FormSchema) => formSchemaToJson(child))
  }

  return jsonSchema as FormSchemaForJson
}

/**
 * 批量转换 FormSchema 数组为 FormSchemaForJson 数组
 */
export function formSchemasToJson(schemas: FormSchema[]): FormSchemaForJson[] {
  return schemas.map(formSchemaToJson)
}
