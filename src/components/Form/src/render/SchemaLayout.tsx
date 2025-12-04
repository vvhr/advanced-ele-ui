import { defineComponent, computed, type PropType } from 'vue'
import type { FormSchema, FormSchemaProps } from '../types'
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
      type: Object as PropType<Recordable>,
      default: () => {}
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
    // 如果是设计模式{
    const designableColProps = props.designable ? {...(props.designableColProps || {})} : {}

    return () => {
      if (layoutProps.value.alone && enableAlone.includes(type.value)) {
        // 如果需要独占一行, 需要包裹 ElCol+ElRow
        return (
          <ElCol
            span={24}
            key={props.itemKey}
            data-id={props.itemKey}
            class="mb-2"
            id={props.itemKey}
            {...designableColProps}
          >
            <ElRow>
              <ElCol span={layoutProps.value.span} style={layoutProps.value.style}>
                {slots.default?.()}
              </ElCol>
            </ElRow>
            { props.designable ? slots.design?.(props.schema) : undefined }
          </ElCol>
        )
      } else {
        return (
          <ElCol
            span={layoutProps.value.span}
            key={props.itemKey}
            data-id={props.itemKey}
            id={props.itemKey}
            class="mb-2"
            style={layoutProps.value.style}
            {...designableColProps}
          >
            {slots.default?.()}
            { props.designable ? slots.design?.(props.schema) : undefined }
          </ElCol>
        )
      }
    }
  }
})
