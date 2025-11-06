import { ComponentProps, FormProps, FormSchema, FormSlots } from '../types'
import {
  getComponentPropValue,
  getLabel, getNoLabel,
  getStyleWidth,
  getTrueComponentProps,
} from '../utils'
import type { FormItemRule } from 'element-plus'
import { autoRulesMap } from '../constants'
import { getSlot } from '../utils'

interface UserFormItemData {
  trueComponentProps: ComponentProps
  isDisabled: boolean
  getFormItemProps: () => Recordable
  getFormItemSlots: () => Recordable
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
  function getFormItemSlots() {
    return setFormItemSlots(slots, schema.key || schema.field)
  }

  function getFormItemProps() {
    return {
      ...(props.schemaProps.formItemProps || {}),
      ...(schema.formItemProps || {}),
      prop: schema.field || '',
      label: formItemLabel.value,
      class: ['zw-form-item', getNoMarginBottomClass(), getNoLabelClass()].join(' '),
      required: getFormItemRequired(),
      rules: getFormItemRules()
    }
  }

  function getFormItemRules() {
    // 如果已定义autoRules
    if (schema.formItemProps?.autoRules?.length) {
      const rules: FormItemRule[] = []
      schema.formItemProps.autoRules.forEach((ruleName: string) => {
        if (autoRulesMap[ruleName] !== undefined) {
          const rule = Object.assign({}, autoRulesMap[ruleName])
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

  /**
   * @param slots 插槽
   * @param field 字段名
   * @returns 返回FormIiem插槽
   */
  function setFormItemSlots(slots: FormSlots, field: string): Recordable {
    const slotObj: Recordable = {}
    if (slots[`${field}--error`]) {
      slotObj['error'] = (data: Recordable) => {
        return getSlot(slots, `${field}-error`, data)
      }
    }
    if (slots[`${field}--label`]) {
      slotObj['label'] = (data: Recordable) => {
        return getSlot(slots, `${field}-label`, data)
      }
    }
    // 如果标题不为空且使用了labelMaxWidth属性,则默认生成label插槽的内容
    const labelPosition =
      schema.formItemProps?.labelPosition ??
      props.schemaProps?.formItemProps?.labelPosition ??
      'right'
    if (
      labelPosition !== 'top' &&
      schema.formItemProps?.labelMaxWidth &&
      formItemLabel?.value?.length
    ) {
      slotObj['label'] = () => {
        const style = {
          width: getStyleWidth(schema.formItemProps.labelMaxWidth),
          textAlign: labelPosition,
          verticalAlign: 'middle',
          lineHeight: 'var(--el-font-size-base)'
        }
        return (
          <div class="zw-form-item-label" style={style}>
            {formItemLabel}
          </div>
        )
      }
    }
    return slotObj
  }

  return {
    trueComponentProps: componentProps,
    isDisabled: isDisabled.value,
    getFormItemProps,
    getFormItemSlots
  }
}
