import { isExistAttr, isFunction } from "@/utils/is"
import { defineComponent } from "vue"
import { get } from "lodash-es"
import type { Component } from 'vue'
import {
  TableProps,
  TableSlots,
  TableEmits,
  TableColumn,
  TableFormComponentName,
  TableFormImportItemConfig,
  TableFormComponentProps,
  TableFormComponentEventFn,
  TableFormInsidePropsRenders
} from '../types'
import { setReactiveValue } from '@/utils/set'
import type {FormItemRule} from "element-plus";
import { AUTO_RULES_MAP } from "@/utils/rules";
import {isDisabled} from "@/components/Table/src/utils.ts";

export function useComponent(
  props: TableProps,
  slots: TableSlots,
  emits: TableEmits,
  row: Recordable,
  index: number,
  column: TableColumn,
  formModel: Recordable,
  components: Partial<Recordable<Component, TableFormComponentName>>,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
) {
  const componentName = column?.editProps?.component || 'Input'
  const field = column.editProps?.field || column.field
  const freshKey = `${column}-${index}-${column.editProps?.componentProps?.freshKey || 0}`
  const formItemProps = {
    prop: `${index}.${field}`,
    rules: getFormItemRules()
  }
  const getAnyComponent = () => {
    if (isExistAttr(components, componentName)) {
      return components[componentName] as ReturnType<typeof defineComponent>
    }
    return undefined
  }

  /**
   * 为组件构造双向绑定
   */
  function setModelValue() {
    if (field) {
      const modelValueKey = isExistAttr(components, componentName)
        ? componentConfigs[componentName]?.modelValueKey || 'modelValue'
        : 'modelValue'
      return {
        [modelValueKey]: get(formModel.value, field),
        [`onUpdate:${modelValueKey}`]: (value: any) => {
          // 使用响应式安全的方式更新值
          setReactiveValue(formModel.value, field, value)
        }
      }
    }
    return {}
  }

  function getFormItemRules() {
    // 如果已定义autoRules
    if (column.editProps?.formItemProps?.autoRules?.length) {
      const rules: FormItemRule[] = []
      column.editProps.formItemProps.autoRules.forEach((ruleName: string) => {
        if (AUTO_RULES_MAP[ruleName] !== undefined) {
          const rule = Object.assign({}, AUTO_RULES_MAP[ruleName])
          rule.message = rule.message.replace('{label}', column.label || column.field)
          rules.push(rule)
        }
      })
      if (rules.length) {
        return rules
      }
    }
    return column.editProps?.formItemProps?.rules || []
  }

  /**
   * 本函数会构造一个新的组件属性对象绑定给组件
   */
  function setComponentProps(): Recordable {
    let compProps: Recordable = {}
    compProps = {
      style: {
        width: '100%'
      },
      // 自动添加placeholder
      ...getPlaceholder(column, props),
      // 注入组件属性
      ...(column.editProps?.componentProps || {}),
      // 自动处理选项
      ...setAttrsOptions(row, index, column, column.editProps?.componentProps || {}, formModel, props),
      // 自动处理时间范围组件的默认时间
      ...setDateRangeDefaultTime(column, column.editProps?.componentProps || {}),
      // 是否禁用
      disabled: isDisabled(props, column, row, index)
    }
    // 删除optionKeys属性
    delete compProps.optionKeys
    return compProps
  }

  /**
   * 本函数会构造一个新的组件事件对象绑定给组件
   */
  function setComponentEvent(): Recordable {
    if (column.editProps?.componentEvent) {
      const compEvents = {}
      Object.keys(column.editProps?.componentEvent).forEach(eventName => {
        const eventFn = column.editProps?.componentEvent[eventName]
        if (isFunction(eventFn)) {
          compEvents[eventName] = getComponentEventFunction(
            eventFn,
            row,
            index,
            column,
            formModel,
            props.excontext
          )
        }
      })
      return compEvents
    }
    return {}
  }

  function setInsideRenders(): Recordable {
    const slotObj: Recordable = {}
    const insideRenders: TableFormInsidePropsRenders = column.editProps?.insideProps?.renders || {}
    for (const slotName in insideRenders) {
      const fn = insideRenders[slotName]
      if (isFunction(fn)) {
        slotObj[slotName] = () => fn(row, index, column, formModel, props.excontext)
      } else if (typeof fn === 'string') {
        slotObj[slotName] = () => fn
      }
    }
    return slotObj
  }

  return {
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setInsideRenders,
    field,
    freshKey,
    formItemProps,
    componentName
  }
}

function getPlaceholder(column: TableColumn, props: TableProps) {
  const needInputPlaceholder = ['Autocomplete', 'Editor', 'Input', 'InputNumber', 'Mention']
  const needSelectPlaceholder = ['Cascader', 'DatePicker', 'Select', 'TimePicker', 'TimeSelect']
  const componentName = column.editProps?.component || 'Input'
  if (needInputPlaceholder.includes(componentName)) {
    return {
      placeholder: '请填写' + column?.label || ''
    }
  }
  if (needSelectPlaceholder.includes(componentName)) {
    return {
      startPlaceholder: '选择' + column?.label,
      endPlaceholder: '选择' + column?.label,
      rangeSeparator: '-',
      placeholder: '请选择' + column?.label || ''
    }
  }
  return {}
}

/**
* 解析componentProps中关于options属性并用于透传到组件的属性上
* @description 组件本身支持options属性时才需要处理
*/
function setAttrsOptions(
  row: Recordable,
  index: number,
  column: TableColumn,
  componentProps: TableFormComponentProps,
  formModel: Recordable,
  props: TableProps) {
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
        options: componentProps.options(row, index, column, formModel, props.excontext),
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
  return {}
}
export const dateRangeTypes = [
  'years',
  'months',
  'dates',
  'datetimerange',
  'daterange',
  'monthrange',
  'yearrange'
]
/**
 * 日期范围组件的默认时间
 * @description 组件自动为时间范围组件添加起始和截止时间的时分秒
 */
function setDateRangeDefaultTime(column: TableColumn, componentProps: TableFormComponentProps) {
  const componentName = column.editProps?.component || 'Input'
  // 组件类型检查
  if (componentName === 'DatePicker') {
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

function getComponentEventFunction(
  eventValue: any,
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable
) {
  // 是否是方法
  if (typeof eventValue === 'function') {
    return (event: any) => eventValue(event, row, index, column, form, excontext) as TableFormComponentEventFn<any>
  }
  return () => undefined
}
