import { defineComponent, computed, type PropType } from 'vue'
import type { FormSchema, FormSchemaProps, DesignableColProps } from '../types'
import { ElCol, ElRow } from 'element-plus'

export const SchemaLayout = defineComponent({
  name: 'SchemaLayout',
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      required: true
    },
    schemaProps: {
      type: Object as PropType<FormSchemaProps>,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    designable: {
      type: Boolean,
      default: false
    },
    designableColProps: {
      type: Function as PropType<DesignableColProps>,
      default: () => {}
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const layoutProps = computed(() => {
      return {
        span: props.schema.layoutProps?.span ?? props.schemaProps?.layoutProps?.span ?? 12,
        alone: props.schema.layoutProps?.alone ?? props.schemaProps?.layoutProps?.alone ?? false,
        style: props.schema.layoutProps?.colStyle ?? {}
      }
    })
    const type = computed(() => props.schema.type ?? 'Inputer')
    const enableAlone = ['Container', 'Custom', 'Inputer', 'Decorator']
    return () => {
      // 每次渲染时重新计算
      const designableColProps = props.designable
        ? { ...(props.designableColProps?.(props.itemKey, props.schema, props.isHidden) || {}) }
        : {}
      if (layoutProps.value.alone && enableAlone.includes(type.value)) {
        // 如果需要独占一行, 需要包裹 ElCol+ElRow
        return (
          <ElCol
            class="mb-2"
            {...designableColProps}
            span={24}
            key={props.itemKey}
            data-id={props.itemKey}
            id={props.itemKey}
          >
            <ElRow>
              <ElCol span={layoutProps.value.span} style={layoutProps.value.style}>
                {slots.default?.()}
              </ElCol>
            </ElRow>
            {props.designable ? slots.design?.(props.schema) : undefined}
          </ElCol>
        )
      } else {
        return (
          <ElCol
            class="mb-2"
            {...designableColProps}
            span={layoutProps.value.span}
            key={props.itemKey}
            data-id={props.itemKey}
            id={props.itemKey}
            style={layoutProps.value.style}
          >
            {slots.default?.()}
            {props.designable ? slots.design?.(props.schema) : undefined}
          </ElCol>
        )
      }
    }
  }
})
