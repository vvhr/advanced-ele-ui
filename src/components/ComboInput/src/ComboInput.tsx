import { computed, defineComponent, h, ref, watch, type VNode, onBeforeUnmount } from 'vue'
import { ElInput, ElSelect, ElDatePicker } from 'element-plus'
import {
  comboInputProps,
  comboInputEmits,
  type TemplateModel,
  type ComboTemplate,
  type ComboInputChangeEvent
} from './types'
import {
  normalizeTemplate,
  parseValueToModel,
  assembleModelToValue,
  initTemplateModel,
  validateTemplate
} from './utils'
import './combo-input.less'

export default defineComponent({
  name: 'AeComboInput',
  props: comboInputProps,
  emits: comboInputEmits,
  setup(props, { emit }) {
    // 用于防止 watch 循环的标志
    let isInternalUpdate = false

    // 防抖定时器
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    // 标准化模板（使用 computed 自动缓存）
    const normalizedTemplates = computed(() => {
      return normalizeTemplate(props.template)
    })

    // 验证模板是否有效
    const isValidTemplate = computed(() => {
      return validateTemplate(normalizedTemplates.value)
    })

    // 内部模板模型
    const templateModel = ref<TemplateModel>(initTemplateModel(normalizedTemplates.value))

    // 清理防抖定时器
    const clearDebounceTimer = () => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
    }

    // 组件卸载时清理
    onBeforeUnmount(() => {
      clearDebounceTimer()
    })

    // 统一的 watch，监听 template 和 modelValue
    // 使用单一 watch 避免竞态条件
    watch(
      [() => props.template, () => props.modelValue],
      ([newTemplate, newModelValue], [oldTemplate]) => {
        // 如果是内部更新触发的，跳过处理
        if (isInternalUpdate) {
          return
        }

        // 检测 template 是否变化
        const templateChanged = newTemplate !== oldTemplate

        if (templateChanged) {
          // template 变化时，重新初始化模型
          const newNormalizedTemplates = normalizeTemplate(newTemplate)
          const newModel = initTemplateModel(newNormalizedTemplates)
          templateModel.value = newModel

          // 触发更新
          isInternalUpdate = true
          const newValue = assembleModelToValue(templateModel.value, newNormalizedTemplates)
          emit('update:modelValue', newValue)
          // 使用 nextTick 或 setTimeout 重置标志
          setTimeout(() => {
            isInternalUpdate = false
          }, 0)
        } else if (newModelValue !== undefined) {
          // 只有 modelValue 变化时，解析值到模型
          const currentValue = assembleModelToValue(templateModel.value, normalizedTemplates.value)
          if (newModelValue !== currentValue) {
            const newModel = parseValueToModel(newModelValue, normalizedTemplates.value)
            templateModel.value = newModel
          }
        }
      },
      { immediate: true }
    )

    // 执行实际的值更新和事件触发
    const doEmitChange = (assembledValue: string) => {
      isInternalUpdate = true
      emit('update:modelValue', assembledValue)

      // 触发 change 事件
      const changeEvent: ComboInputChangeEvent = {
        value: assembledValue,
        params: { ...templateModel.value }
      }
      emit('change', changeEvent)

      setTimeout(() => {
        isInternalUpdate = false
      }, 0)
    }

    // 处理输入变化
    const handleInputChange = (prop: string, value: any) => {
      templateModel.value[prop] = value
      const assembledValue = assembleModelToValue(templateModel.value, normalizedTemplates.value)

      // 如果配置了防抖
      if (props.debounce > 0) {
        clearDebounceTimer()
        debounceTimer = setTimeout(() => {
          doEmitChange(assembledValue)
        }, props.debounce)
      } else {
        doEmitChange(assembledValue)
      }
    }

    // 渲染单个模板项
    const renderTemplateItem = (item: ComboTemplate, index: number): VNode => {
      if (item.tag === 'span') {
        return h(
          'span',
          {
            key: `span-${index}`,
            class: 'ae-combo-input__text'
          },
          item.content || ''
        )
      }

      if (!item.prop) {
        return h('span', { key: `empty-${index}` })
      }

      const commonProps = {
        key: `${item.prop}-${index}`,
        size: props.size,
        disabled: props.disabled,
        modelValue: templateModel.value[item.prop],
        'onUpdate:modelValue': (value: any) => handleInputChange(item.prop!, value)
      }

      switch (item.tag) {
        case 'input':
          return h(ElInput, {
            ...commonProps,
            ...item.componentProps
          } as any)
        case 'select':
          return h(ElSelect, {
            ...commonProps,
            ...item.componentProps
          } as any)
        case 'date-picker':
          return h(ElDatePicker, {
            ...commonProps,
            ...item.componentProps
          } as any)
        default:
          return h('span', { key: `unknown-${index}` })
      }
    }

    return () => {
      // 如果模板无效，返回空容器
      if (!isValidTemplate.value) {
        return h('div', {
          class: ['ae-combo-input', `ae-combo-input--${props.size}`, 'ae-combo-input--empty']
        })
      }

      return h(
        'div',
        {
          class: ['ae-combo-input', `ae-combo-input--${props.size}`]
        },
        normalizedTemplates.value.map((item, index) => renderTemplateItem(item, index))
      )
    }
  }
})
