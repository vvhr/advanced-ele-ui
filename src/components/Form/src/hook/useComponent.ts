import type {
  FormSchema,
  FormSlots,
  FormProps,
  FormEmits,
  InsideProps,
  ComponentProps,
  FormSchemaProps,
  ComponentName,
  InputerName
} from '../types'
import { needInputPlaceholder, needSelectPlaceholder, SchemaType } from '../constants'
import type { FormImportItemConfig } from '@/types/imports'
import { defineComponent, type Component, type Ref, type VNode, type ComputedRef } from 'vue'
import { get } from 'lodash-es'
import { getComponentEventFunction, getSchemaPropValue } from '../utils/schema'
import { getSlot } from '@/utils/get'
import { isFunction, isExistAttr } from '@/utils/is'
import { setReactiveValue } from '@/utils/set'
import { dateRangeTypes, needClearable, needOptions, noNeedOptions } from '../constants'
import { useRenderCheckbox } from '../render/RenderCheckbox'
import { useRenderRadio } from '../render/RenderRadio'

export function useComponent(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  formModel: Ref<Recordable>,
  componentProps: ComponentProps, // 由useFormItem生成的ComponentProps
  components: Recordable<Component, ComponentName>,
  componentConfigs: Recordable<FormImportItemConfig, ComponentName>,
  disabled?: ComputedRef<boolean>
) {
  const type: any = schema.type ?? SchemaType.INPUTER
  const getAnyComponent = () => {
    if ([SchemaType.CONTAINER, SchemaType.INPUTER, SchemaType.DECORATOR].includes(type)) {
      if (isExistAttr(components, schema?.component || 'Input')) {
        return components[schema.component] as ReturnType<typeof defineComponent>
      }
      return undefined
    }
    return undefined
  }
  const enableOutside = [SchemaType.INPUTER, SchemaType.DECORATOR].includes(type)
    ? (schema.outsideProps?.enable ?? false)
    : false
  const slotKey = (schema.key || schema.field).replace(/\./g, '-')
  const freshKey = `${slotKey}-${schema.componentProps?.freshKey || 0}`
  /**
   * 为组件构造双向绑定
   */
  function setModelValue() {
    const bindings: Record<string, any> = {}
    // 1. Handle the default modelValue binding
    if (schema.field) {
      const modelValueKey = isExistAttr(components, schema.component)
        ? componentConfigs[schema.component]?.modelValueKey || 'modelValue'
        : 'modelValue'

      bindings[modelValueKey] = get(formModel.value, schema.field)
      bindings[`onUpdate:${modelValueKey}`] = (value: any) => {
        const oldValue = get(formModel.value, schema.field)
        setReactiveValue(formModel.value, schema.field, value)
        emits('change', { value: value, field: schema.field, oldValue })
      }
    }
    // 2. Handling additional vBinds bindings
    if (schema.field && schema.componentProps?.vBinds) {
      Object.entries(schema.componentProps.vBinds).forEach(([propName, fieldPath]) => {
        // 校验propName和fieldPath不得为空
        if (propName && fieldPath && typeof fieldPath === 'string') {
          bindings[propName] = get(formModel.value, fieldPath)
          bindings[`onUpdate:${propName}`] = (value: any) => {
            const oldValue = get(formModel.value, fieldPath)
            setReactiveValue(formModel.value, fieldPath, value)
            emits('change', { value: value, field: schema.field, oldValue })
          }
        }
      })
    }
    return bindings
  }

  /**
   * 本函数会构造一个新的组件属性对象绑定给组件
   */
  function setComponentProps(): Recordable {
    let compProps: Recordable = {}
    // 仅对输入组件
    if (type === SchemaType.INPUTER) {
      compProps = {
        // 自动添加clearable属性
        ...getClearable(schema, props.schemaProps),
        // 自动添加placeholder
        ...getPlaceholder(schema, props.schemaProps, props),
        // 如果是表格组件,自动将表单的formModel和excontext传递给组件
        ...setTableProps(schema, formModel.value, props, disabled.value),
        // 注入组件属性
        ...(componentProps || {}),
        // 自动处理选项
        ...setAttrsOptions(schema, componentProps, formModel.value, props),
        // 自定处理日期时间组件的初始时刻
        ...setDateRangeDefaultTime(schema, componentProps)
      }
      // 针对部分组件删除选项属性
      removeAttrsOptions(compProps, schema)
      // 删除vBinds属性
      if (Reflect.has(compProps, 'vBinds')) {
        delete compProps.vBinds
      }
      // 删除optionKeys属性
      if (Reflect.has(compProps, 'optionKeys')) {
        delete compProps.optionKeys
      }
    } else if (type === SchemaType.CONTAINER) {
      compProps = {
        // 容器组件将自动将label和subLabel传递给组件
        label: schema.label || '',
        subLabel: schema?.formItemProps?.subLabel || '',
        // 注入组件属性
        ...(componentProps || {})
      }
    } else if (type === SchemaType.DECORATOR) {
      compProps = {
        // 注入组件属性
        ...(componentProps || {})
      }
    }
    return compProps
  }

  /**
   * 本函数会构造一个新的组件事件对象绑定给组件
   */
  function setComponentEvent(): Recordable {
    if (schema.componentEvent) {
      const compEvents = {}
      // 遍历schema.componentEvent
      Object.keys(schema.componentEvent).forEach(eventName => {
        const eventFn = schema.componentEvent[eventName]
        if (isFunction(eventFn)) {
          compEvents[eventName] = getComponentEventFunction(
            eventFn,
            formModel.value,
            schema,
            props.disabled,
            props.excontext
          )
        }
      })
      return compEvents
    }
    return {}
  }
  function setOutsidePrepend(): VNode | undefined {
    if (schema?.outsideProps?.enable) {
      if (
        schema.outsideProps.hasOwnProperty('prependRender') &&
        isFunction(schema.outsideProps.prependRender) &&
        !schema.outsideProps.hasOwnProperty('prependSlot')
      ) {
        return (
          schema.outsideProps.prependRender(
            formModel.value,
            schema,
            props.disabled,
            props.excontext
          ) || undefined
        )
      }

      if (schema.outsideProps.hasOwnProperty('prependSlot')) {
        const enableSlot = getSchemaPropValue(
          schema.outsideProps.prependSlot,
          schema,
          formModel.value,
          props,
          'boolean',
          false
        )
        if (enableSlot) {
          return getSlot(slots, `${slotKey}--out-prepend`, formModel.value) as any
        }
      }
    }
    return undefined
  }
  function setOutsideAppend(): VNode | undefined {
    if (schema?.outsideProps?.enable) {
      if (
        schema.outsideProps.hasOwnProperty('appendRender') &&
        isFunction(schema.outsideProps.appendRender) &&
        !schema.outsideProps.hasOwnProperty('appendSlot')
      ) {
        return (
          schema.outsideProps.appendRender(
            formModel.value,
            schema,
            props.disabled,
            props.excontext
          ) || undefined
        )
      }

      if (schema.outsideProps.hasOwnProperty('appendSlot')) {
        const enableSlot = getSchemaPropValue(
          schema.outsideProps.appendSlot,
          schema,
          formModel.value,
          props,
          'boolean',
          false
        )
        if (enableSlot) {
          return getSlot(slots, `${slotKey}--out-append`, formModel.value) as any
        }
      }
    }
    return undefined
  }
  function setInsideSlots(): Recordable {
    const slotObj: Recordable = {}
    const insideSlots: InsideProps['slots'] = schema?.insideProps?.slots || {}
    const insideRenders: InsideProps['renders'] = schema?.insideProps?.renders || {}
    // 因为insideRenders优先级低, 所以先处理
    for (const slotName in insideRenders) {
      if (!insideSlots.hasOwnProperty(slotName)) {
        const fn = insideRenders[slotName]
        if (isFunction(fn)) {
          slotObj[slotName] = (...args: any[]) => fn(formModel.value, schema, props.disabled, props.excontext, ...args)
        } else if (typeof fn === 'string') {
          slotObj[slotName] = () => fn
        }
      }
    }
    for (const slotName in insideSlots) {
      const enableSlot = getSchemaPropValue(
        insideSlots[slotName],
        schema,
        formModel.value,
        props,
        'boolean',
        false
      )
      if (enableSlot) {
        slotObj[slotName] = (...args: any[]) => {
          // 始终将 formModel.value 包装为 form 属性，保持 API 一致性
          // 如果插槽传递了参数，将插槽参数合并到对象中
          const slotData = args.length > 0
            ? { form: formModel.value, ...args[0] }
            : { form: formModel.value }
          return getSlot(slots, `${slotKey}--${slotName}`, slotData)
        }
      }
    }
    // 插入选项
    if (schema.component && noNeedOptions.includes(schema.component as InputerName)) {
      switch (schema.component) {
        case 'Radio':
        case 'RadioButton': {
          const { renderRadioOptions } = useRenderRadio(
            schema,
            componentProps,
            formModel.value,
            props
          )
          slotObj.default = () => renderRadioOptions()
          break
        }
        case 'Checkbox':
        case 'CheckboxButton': {
          const { renderCheckboxOptions } = useRenderCheckbox(
            schema,
            componentProps,
            formModel.value,
            props
          )
          slotObj.default = () => renderCheckboxOptions()
          break
        }
      }
    }
    return slotObj
  }

  return {
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setInsideSlots,
    setOutsidePrepend,
    setOutsideAppend,
    freshKey,
    slotKey,
    enableOutside
  }
}

/**
 * 自动删除不需要options属性的组件的options属性
 */
function removeAttrsOptions(comProps: Recordable, schema: FormSchema) {
  if (schema.component && noNeedOptions.includes(schema.component as InputerName)) {
    if (comProps.options !== undefined) {
      delete comProps.options
    }
  }
}

/**
 * 日期范围组件的默认时间
 * @description 组件自动为时间范围组件添加起始和截止时间的时分秒
 */
function setDateRangeDefaultTime(schema: FormSchema, componentProps: ComponentProps) {
  // 组件类型检查
  if (schema.component === 'DatePicker') {
    // 组件属性检查
    if (componentProps.type && dateRangeTypes.includes(componentProps.type)) {
      if (componentProps.defaultTime) {
        return {
          defaultTime: componentProps.defaultTime
        }
      } else {
        return {
          defaultTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)]
        }
      }
    }
  }
  return {}
}

/**
 * 设置表格组件的必要属性
 * @description Table也是一个高级组件,其也支持form和excontext属性,因此在表单中使用表格组件时,表单需自动将表单对象和上下文对象传递给表格组件
 */
function setTableProps(
  schema: FormSchema,
  formModel: Recordable,
  props: FormProps,
  disabled?: boolean
) {
  // 检查组件类型及属性
  if (!schema.component || schema.component !== 'Table') {
    return {}
  }
  return {
    excontext: props.excontext,
    form: formModel,
    editable: !disabled, // 自动启用表格编辑功能
    adaptive: false // 禁止自适应高宽度
  }
}

/**
 * 解析componentProps中关于options属性并用于透传到组件的属性上
 * @description 组件本身支持options属性时才需要处理
 * @notes RadioButton和CheckboxButton不支持Options属性,因此这两个组件的选项实际上是通过renderOptions函数渲染在组件内
 * @param schema
 * @param componentProps
 * @param formModel
 * @param props
 * @param formModel
 * @param props
 */
function setAttrsOptions(
  schema: FormSchema,
  componentProps: ComponentProps,
  formModel: Recordable,
  props: FormProps
) {
  // 检查组件类型及属性
  if (!schema.component) {
    return {}
  }
  // 支持options属性的组件
  if (needOptions.includes(schema.component as InputerName)) {
    // 必须拥有options属性
    if (Reflect.has(componentProps, 'options')) {
      // 选项键名
      const optionKeys = {
        disabled: 'disabled',
        children: 'children',
        value: 'value',
        label: 'label',
        ...(componentProps?.optionKeys || {}),
        ...(componentProps?.props || {})
      }
      if (typeof componentProps.options === 'function') {
        return {
          options: componentProps.options(formModel, schema, props.disabled, props.excontext),
          props: optionKeys
        }
      }
      // 是否是数组
      if (Array.isArray(componentProps.options)) {
        return {
          options: componentProps.options,
          props: optionKeys
        }
      }
    }
  }
  return {}
}

// 自动为组件添加clearable属性
function getClearable(schema: FormSchema, schemaProps: FormSchemaProps) {
  const clearable = schemaProps?.componentProps?.clearable ?? true
  if (clearable) {
    const type = schema.type ?? SchemaType.INPUTER
    if (type === SchemaType.INPUTER && schema.component) {
      if (needClearable.includes(schema.component as InputerName)) {
        return { clearable: true }
      }
    }
  }
  return {}
}

function getPlaceholder(schema: FormSchema, schemaProps: FormSchemaProps, props: FormProps) {
  const autoPlaceholder = schemaProps?.componentProps?.autoPlaceholder ?? true
  const setPlaceholderInDisabled = schemaProps?.componentProps?.setPlaceholderInDisabled

  if (autoPlaceholder || (props.disabled && setPlaceholderInDisabled !== undefined)) {
    const type = schema.type ?? SchemaType.INPUTER
    if (type === SchemaType.INPUTER) {
      const labelStr = typeof schema?.label === 'string' ? schema.label : ''

      if (needInputPlaceholder.includes(schema.component as InputerName)) {
        if (props.disabled && setPlaceholderInDisabled !== undefined) {
          return {
            placeholder: setPlaceholderInDisabled
          }
        }
        return {
          placeholder: labelStr ? '请填写' + labelStr : ''
        }
      }
      if (needSelectPlaceholder.includes(schema.component as InputerName)) {
        if (props.disabled && setPlaceholderInDisabled !== undefined) {
          return {
            startPlaceholder: setPlaceholderInDisabled,
            endPlaceholder: setPlaceholderInDisabled,
            rangeSeparator: '-',
            placeholder: setPlaceholderInDisabled
          }
        }
        return {
          startPlaceholder: labelStr ? '选择' + labelStr : '',
          endPlaceholder: labelStr ? '选择' + labelStr : '',
          rangeSeparator: '-',
          placeholder: labelStr ? '请选择' + labelStr : ''
        }
      }
    }
  }
  return {}
}
