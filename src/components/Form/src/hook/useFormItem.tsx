import { computed, type ComputedRef, type Ref } from 'vue'
import { ComponentProps, type DescriptionsProps, FormProps, FormSchema, FormSlots, type InsideProps} from '../types'
import {
  getComponentPropValue,
  getLabel,
  getNoLabel, getSchemaPropValue,
  getTrueComponentProps
} from '../utils/schema'
import type { FormItemRule } from 'element-plus'
import { DEFAULT_DESCS_ATTRS} from '../constants'
import {isFunction} from "@/utils/is";
import {getSlot} from "@/utils/get";
import { getAutoRulesMap } from '@/utils/rules'

interface UserFormItemData {
  trueComponentProps: ComponentProps
  isDisabled: ComputedRef<boolean>
  getFormItemProps: () => Recordable
  slotKey: string
  formItemLabel: ComputedRef<string>,
  getDescriptionsProps: () => DescriptionsProps
  getDescriptionsSlots: () => Recordable
  getDescriptionItemProps: () => Recordable
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

  function getDescriptionsProps(): DescriptionsProps {
    const _props = {
      size: props.size ?? 'default',
      title: formItemLabel.value,
      style: { width: '100%', margin: '10px 0' },
      direction: props.schemaProps?.descriptionsProps?.direction ?? DEFAULT_DESCS_ATTRS.direction,
      column: props.schemaProps?.descriptionsProps?.column ?? DEFAULT_DESCS_ATTRS.column,
      border: props.schemaProps?.descriptionsProps?.border ?? DEFAULT_DESCS_ATTRS.border,
      ...getTrueComponentProps(schema, formModel.value, props)
    }
    // console.log('getDescriptionsProps', _props)
    return _props
  }
  function getDescriptionItemProps() {
    return {
      label: formItemLabel.value,
      span: schema.layoutProps?.span ?? props.schemaProps?.layoutProps?.span ?? 1,
      rowspan: schema.layoutProps?.rowspan ?? 1,
      width: schema.formItemProps?.width ?? undefined,
      minWidth: schema.formItemProps?.minWidth ?? '150px',
      labelWidth: schema.formItemProps?.labelWidth ?? undefined,
      align: schema.formItemProps?.align ?? props.schemaProps?.formItemProps?.align ?? 'left',
      labelAlign: schema.formItemProps?.labelAlign ?? props.schemaProps?.formItemProps?.labelAlign ?? undefined,
      className: 'ae-description-item-content',
      labelClassName: 'ae-description-item-label' + (getDescriptionItemRequired() && ' is-required')
    }
  }

  function getFormItemProps() {
    return {
      ...(props.schemaProps.formItemProps || {}),
      ...(schema.formItemProps || {}),
      prop: schema.field || '',
      // label: formItemLabel.value,
      class: ['ae-form-item', getNoMarginBottomClass(), getNoLabelClass(), getNormalLabelClass(), getDisabledClass()]
        .filter(name => !!name)
        .join(' '),
      required: getFormItemRequired(),
      rules: getFormItemRules()
    }
  }

  function getDescriptionItemRequired() {
    if (schema.formItemProps?.required) {
      return true
    } else {
      if (schema.formItemProps?.autoRules?.length) {
        return schema.formItemProps.autoRules.some(ruleName => ruleName === 'isRequired' || ruleName === 'isRequiredArray')
      } else if (schema.formItemProps?.rules?.length) {
        return schema.formItemProps.rules.some(rule => rule.required)
      }
    }
    return false
  }

  function getFormItemRules() {
    // 如果已定义autoRules
    if (schema.formItemProps?.autoRules?.length) {
      const rules: FormItemRule[] = []
      const autoRulesMap = getAutoRulesMap()
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

  function getDisabledClass() {
    return getDisabled() ? 'ae-form-item-is-disabled' : ''
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
    } else if (schema.formItemProps?.required) {
      return true
    } else return undefined
  }

  // el-form-item默认具有较大的下边距用来显示校验信息,但表单如果是禁用或组件是禁用时,则不需要显示下边距
  function getNoMarginBottomClass() {
    return isDisabled.value ? 'no-margin-bottom' : ''
  }

  // el-form-item的el-form-item__content始终有外左边距, 如果没有标题则不需要外左边距
  function getNoLabelClass() {
    return formItemLabel?.value?.length === 0 || props.type === 'desc' ? 'no-label' : ''
  }

  // 当没有自定义label插槽时, 为form-item添加一个类名
  function getNormalLabelClass() {
    if (!slots || !Reflect.has(slots, `${schema.key || schema.field}-error`)) {
      return 'is-normal-label'
    } else {
      return ''
    }
  }

  function getDescriptionsSlots(): Recordable {
    const slotObj: Recordable = {}
    const insideSlots: InsideProps['slots'] = schema?.insideProps?.slots || {}
    const insideRenders: InsideProps['renders'] = schema?.insideProps?.renders || {}
    // 因为insideRenders优先级低, 所以先处理
    for (const slotName in insideRenders) {
      if (!insideSlots.hasOwnProperty(slotName)) {
        const fn = insideRenders[slotName]
        if (isFunction(fn)) {
          slotObj[slotName] = () => fn(formModel.value, schema, props.disabled, props.excontext)
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
        slotObj[slotName] = () => {
          return getSlot(slots, `${slotKey}--${slotName}`, formModel.value)
        }
      }
    }
    return slotObj
  }

  return {
    trueComponentProps: componentProps,
    isDisabled,
    getFormItemProps,
    formItemLabel,
    slotKey,
    getDescriptionsProps,
    getDescriptionsSlots,
    getDescriptionItemProps
  }
}
