import { defineComponent } from 'vue'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
// 局部
import type { ComponentProps, FormSchema, FormProps } from '../types'
export const useRenderCheckbox = (
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

  const renderCheckboxOptions = () => {
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
    const Com = (schema.component === 'Checkbox' ? ElCheckbox : ElCheckboxButton) as ReturnType<
      typeof defineComponent
    >
    // 获取选项
    const options = getOptions()
    return options.map((option: any) => {
      const { value, label, ...other } = option
      return (
        <Com {...other} value={option[valueKey]}>
          {option[labelKey]}
        </Com>
      )
    })
  }

  return {
    renderCheckboxOptions
  }
}
