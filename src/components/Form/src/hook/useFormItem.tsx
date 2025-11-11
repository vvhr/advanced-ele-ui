import { computed, type ComputedRef, type Ref } from 'vue'
import { ComponentProps, FormProps, FormSchema, FormSlots } from '../types'
import {
  getComponentPropValue,
  getLabel,
  getNoLabel,
  getTrueComponentProps
} from '../utils/schema'
import type { FormItemRule } from 'element-plus'
import { AUTO_RULES_MAP } from '../constants'

interface UserFormItemData {
  trueComponentProps: ComponentProps
  isDisabled: ComputedRef<boolean>
  getFormItemProps: () => Recordable
  slotKey: string
  formItemLabel: ComputedRef<string>
}

export function useFormItem(
  props: FormProps,
  slots: FormSlots,
  schema: FormSchema,
  formModel: Ref<Recordable>
): UserFormItemData {
  const componentProps: ComponentProps = getTrueComponentProps(schema, formModel.value, props)
  const formItemLabel = computed<string>(() => getFormItemLabel())
  const isDisabled = computed<boolean>(() => getDisabled())
  const slotKey = schema.key || schema.field
  function getFormItemProps() {
    return {
      ...(props.schemaProps.formItemProps || {}),
      ...(schema.formItemProps || {}),
      prop: schema.field || '',
      // label: formItemLabel.value,
      class: ['ae-form-item', getNoMarginBottomClass(), getNoLabelClass(), getNormalLabelClass()]
        .filter(name => !!name)
        .join(' '),
      required: getFormItemRequired(),
      rules: getFormItemRules()
    }
  }

  function getFormItemRules() {
    // 如果已定义autoRules
    if (schema.formItemProps?.autoRules?.length) {
      const rules: FormItemRule[] = []
      schema.formItemProps.autoRules.forEach((ruleName: string) => {
        if (AUTO_RULES_MAP[ruleName] !== undefined) {
          const rule = Object.assign({}, AUTO_RULES_MAP[ruleName])
          rule.message = rule.message.replace('{label}', formItemLabel.value)
          rules.push(rule)
        }
      })
      if (rules.length) {
        return rules
      }
    }
    return schema.formItemProps?.rules || []
  }

  function getFormItemLabel() {
    const noLabel = getNoLabel(schema, formModel.value, props)
    if (noLabel) {
      return ''
    }
    return getLabel(schema, formModel.value, props)
  }

  // 组件是否禁用
  function getDisabled() {
    // 如果表单本身被禁用则返回true
    if (props.disabled) {
      return true
    }
    return getComponentPropValue(
      'disabled',
      true,
      schema,
      formModel.value,
      componentProps,
      props,
      props.schemaProps?.componentProps?.disabled ?? false
    )
  }
  // 是否强制显示校验图标在form-item上
  function getFormItemRequired() {
    if (isDisabled.value) {
      return undefined
    } else if (schema.formItemProps && schema.formItemProps.required) {
      return true
    } else return undefined
  }

  // el-form-item默认具有较大的下边距用来显示校验信息,但表单如果是禁用或组件是禁用时,则不需要显示下边距
  function getNoMarginBottomClass() {
    return isDisabled.value ? 'no-margin-bottom' : ''
  }

  // el-form-item的el-form-item__content始终有外左边距, 如果没有标题则不需要外左边距
  function getNoLabelClass() {
    return formItemLabel?.value?.length === 0 ? 'no-label' : ''
  }

  // 当没有自定义label插槽时, 为form-item添加一个类名
  function getNormalLabelClass() {
    if (!slots || !Reflect.has(slots, `${schema.key || schema.field}-error`)) {
      return 'is-normal-label'
    } else {
      return ''
    }
  }

  return {
    trueComponentProps: componentProps,
    isDisabled,
    getFormItemProps,
    formItemLabel,
    slotKey
  }
}
