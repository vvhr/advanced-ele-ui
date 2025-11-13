import { defineComponent } from 'vue'
import { ElRadio, ElRadioButton } from 'element-plus'
// 局部
import type { ComponentProps, FormSchema, FormProps } from '../types'

export const useRenderRadio = (
  schema: FormSchema,
  componentProps: ComponentProps,
  formModel: Recordable,
  props: FormProps
) => {
  const getOptions = (): any[] => {
    if (Reflect.has(componentProps, 'options')) {
      if (typeof componentProps.options === 'function') {
        return componentProps.options(formModel, schema, props.disabled, props.excontext)
      }
      // 是否是数组
      if (Array.isArray(componentProps.options)) {
        return componentProps.options
      }
    }
    return []
  }

  const renderRadioOptions = () => {
    // 如果有别名，就取别名
    const optionKeys = {
      disabled: 'disabled',
      children: 'children',
      value: 'value',
      label: 'label',
      ...(componentProps?.optionKeys || {}),
      ...(componentProps?.props || {})
    }
    const labelKey = optionKeys.label ?? 'label'
    const valueKey = optionKeys.value ?? 'value'
    const Com = (schema.component === 'Radio' ? ElRadio : ElRadioButton) as ReturnType<
      typeof defineComponent
    >
    // 获取选项
    const options = getOptions()
    return options.map(option => {
      const { value, label, ...other } = option
      return (
        <Com {...other} value={option[valueKey]}>
          {option[labelKey]}
        </Com>
      )
    })
  }

  return {
    renderRadioOptions
  }
}
