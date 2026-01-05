import type { FormProps, FormSchema, ComponentProps } from '../types'
import { isFunction } from '@/utils/is'
import { logger } from '@/locale'
export function isHidden(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.hidden, schema, formModel, props, 'boolean', false)
}
export function getValue(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.value, schema, formModel, props, 'any', null)
}
export function getLabel(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.label, schema, formModel, props, 'string', '')
}
export function getSubLabel(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.formItemProps?.subLabel, schema, formModel, props, 'string', '')
}
export function getNoLabel(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(
    schema.formItemProps?.noLabel,
    schema,
    formModel,
    props,
    'boolean',
    false
  )
}

export function getSchemaPropValue(
  propValue: any, // 该属性值
  schema: FormSchema, // 当前schema
  formModel: Recordable, // 表单数据
  props: FormProps, // 表单属性
  staticType: 'boolean' | 'string' | 'number' | 'array' | 'object' | 'any', // 该属性的原始静态类型
  def: any // 未定义时的默认值
) {
  if (propValue !== undefined) {
    // 静态类型一致时直接返回原值
    if (typeof propValue === staticType && ['boolean', 'number', 'string'].includes(staticType)) {
      return propValue
    }
    // 静态类型一致时直接返回原数组
    if (staticType === 'array' && Array.isArray(propValue)) {
      return propValue
    }
    // 静态类型一致时直接返回原对象
    if (staticType === 'object' && typeof propValue === 'object') {
      return propValue
    }
    // 如果是方法,则通过方法赋值
    if (typeof propValue === 'function') {
      return propValue(formModel, schema, props.disabled, props.excontext)
    }
    // 如果静态类型不确定,则返回原值
    if (staticType === 'any') {
      return propValue
    }
    return def
  } else {
    return def
  }
}

/**
 * 解析表达式并返回组件属性对象
 * @description 由于componentProps支持_v_前缀，因此本函数需要先解析为实际的属性
 * @param schema
 * @param formModel
 * @param props
 */
export function getTrueComponentProps(
  schema: FormSchema,
  formModel: Recordable,
  props: FormProps
): Recordable {
  // 如果是步骤则忽略
  if (schema?.type === 'Step') {
    return {}
  }
  if (schema.componentProps && typeof schema.componentProps === 'object') {
    // 遍历组件属性对象
    const schemaProps = { ...schema.componentProps }
    // 遍历schemaProps找出所有_v_开头的属性
    const _v_keys = Object.keys(schemaProps).filter((key: string) => key.startsWith('_v_'))
    if (_v_keys.length > 0) {
      for (const i in _v_keys) {
        const key = _v_keys[i]
        if (key.startsWith('_v_')) {
          const tureKey = key.replace('_v_', '')
          if (tureKey && isFunction(schemaProps[key])) {
            try {
              schemaProps[tureKey] = schemaProps[key](
                formModel,
                schema,
                props.disabled,
                props.excontext
              )
            } catch (e) {
              logger.error('console.form.dynamicPropertyError', { key }, schema, e)
            } finally {
              delete schemaProps[key]
            }
          }
        }
      }
    }
    return schemaProps
  }
  return {}
}

/**
 * 获取组件属性值
 * @param truePropName 实际执行的属性名
 * @param enableFn 实际属性是否已内置支持动态方法
 * @param schema 原始表单项配置
 * @param formModel 表单数据
 * @param trueComponentProps 已处理过_v_属性的组件属性对象
 * @param props 表单自身属性
 * @param def 未定义时的默认值
 */
export function getComponentPropValue(
  truePropName: string,
  enableFn: boolean,
  schema: FormSchema,
  formModel: Recordable,
  trueComponentProps: ComponentProps,
  props: FormProps,
  def: any
) {
  // 首先判断原始组件属性对象是否有效
  if (schema.componentProps) {
    // 判断实际属性值是否已定义，trueComponentProps是将_v_和实际属性合并后的结果对象
    if (trueComponentProps[truePropName] !== undefined) {
      const propValue = trueComponentProps[truePropName]
      if (enableFn && typeof propValue === 'function') {
        return propValue(formModel, schema, props.disabled, props.excontext)
      } else {
        return propValue
      }
    } else {
      return def
    }
  } else {
    return def
  }
}

export function getComponentEventFunction(
  eventValue: any,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable
) {
  // 是否是方法
  if (typeof eventValue === 'function') {
    return (e: any) => eventValue(e, form, column, disabled, excontext)
  }
  return () => undefined
}
