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
    }
  },
  setup(props, { slots }) {
    const layoutProps = computed(() => {
      return {
        span: props.schema.layoutProps?.span ?? props.schemaProps?.layoutProps?.span ?? 12,
        alone: props.schema.layoutProps?.alone ?? props.schemaProps?.layoutProps?.alone ?? false
      }
    })
    const type = computed(() => props.schema.type ?? 'Inputer')
    const enableAlone = ['Container', 'Custom', 'Inputer', 'Decorator']
    
    return () => {
      if (layoutProps.value.alone && enableAlone.includes(type.value)) {
        // 如果需要独占一行, 需要包裹 ElCol+ElRow
        return (
          <ElCol span={24} key={props.itemKey} data-id={props.itemKey} class="mb-1">
            <ElRow>
              <ElCol span={layoutProps.value.span}>{slots.default?.()}</ElCol>
            </ElRow>
          </ElCol>
        )
      } else {
        return (
          <ElCol span={layoutProps.value.span} key={props.itemKey} data-id={props.itemKey} class="mb-2">
            {slots.default?.()}
          </ElCol>
        )
      }
    }
  }
})
