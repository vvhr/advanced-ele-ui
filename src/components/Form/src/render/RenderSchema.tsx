import type { FormSchema, FormProps, FormSlots, FormEmits } from '../types'
import { isHidden } from '../utils/schema'
import { ElCol, ElRow, ElFormItem } from 'element-plus'
import { useFormItem } from '../hook/useFormItem'
import {
  renderContainer,
  renderCustom,
  renderInputer,
  renderDecorator
} from '../render/RenderComponent'
/**
 * 渲染表单项
 * @param props
 * @param slots
 * @param emits
 * @param schema
 * @param componentRefs
 * @param formModel
 * @param schemasKeys
 */
export function renderSchema(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  componentRefs: Ref<Recordable<ComponentRef<any>>>,
  formModel: Ref<Recordable>,
  schemasKeys: Ref<string[]>
): VNode | undefined {
  // 判断当前是否隐藏
  const hidden = isHidden(schema, formModel.value, props)
  if (hidden) {
    return undefined
  }
  // 获取组件key
  const key = schema.key ?? schema.field
  if (!key) {
    console.error(`[ZwForm]: 组件必须设置key属性或者field属性，无法渲染schema:`, schema)
    return undefined
  }
  // 根据组件类型
  const type = schema.type ?? 'Inputer'
  switch (type) {
    case 'Step':
      console.error(`[ZwForm]: 不支持嵌套Step类型的子组件，无法渲染schema:`, schema)
      return undefined
    case 'Custom':
      return renderSchemaLayout(props, schema, key, () => {
        const { getFormItemProps, getFormItemSlots } = useFormItem(props, slots, schema, formModel)
        return (
          <ElFormItem {...getFormItemProps()}>
            {{
              ...getFormItemSlots(),
              default: () => renderCustom(props, slots, emits, schema, formModel)
            }}
          </ElFormItem>
        )
      })
    case 'Container': {
      const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
      return renderSchemaLayout(props, schema, key, () =>
        renderContainer(props, slots, emits, schema, trueComponentProps, formModel, () => (
          <ElRow
            class="zw-form-main__container_row"
            data-id={`container-row-${key}`}
            key={`container-row-${key}`}
            gutter={10}
          >
            {schema.children
              ? schema.children?.map(item =>
                  renderSchema(props, slots, emits, item, componentRefs, formModel, schemasKeys)
                )
              : undefined}
          </ElRow>
        ))
      )
    }
    case 'Decorator': {
      const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
      return renderSchemaLayout(props, schema, key, () =>
        renderDecorator(props, slots, emits, schema, trueComponentProps, formModel)
      )
    }
    case 'Inputer':
    default:
      return renderSchemaLayout(props, schema, key, () => {
        const { trueComponentProps, isDisabled, getFormItemProps, getFormItemSlots } = useFormItem(
          props,
          slots,
          schema,
          formModel
        )
        return (
          <ElFormItem {...getFormItemProps()}>
            {{
              ...getFormItemSlots(),
              default: () =>
                renderInputer(
                  props,
                  slots,
                  emits,
                  schema,
                  componentRefs,
                  trueComponentProps,
                  formModel,
                  isDisabled
                )
            }}
          </ElFormItem>
        )
      })
  }
}

function renderSchemaLayout(
  props: FormProps,
  schema: FormSchema,
  key: string,
  defaultRender?: () => VNode
): VNode {
  const layoutProps = {
    span: schema.layoutProps?.span ?? props.schemaProps?.layoutProps?.span ?? 12,
    alone: schema.layoutProps?.alone ?? props.schemaProps?.layoutProps?.alone ?? false
  }
  const type = schema.type ?? 'Inputer'
  const enableAlone = ['Container', 'Custom', 'Inputer', 'Decorator']
  // 判断布局方式
  if (layoutProps.alone && enableAlone.includes(type)) {
    // 如果需要独占一行, 需要包裹 ElCol+ElRow
    return (
      <ElCol span={24} key={key} data-id={key} class="mb-1">
        <ElRow>
          <ElCol span={layoutProps.span}>{defaultRender?.() || undefined}</ElCol>
        </ElRow>
      </ElCol>
    )
  } else {
    return (
      <ElCol span={layoutProps.span} key={key} data-id={key} class="mb-2">
        {defaultRender?.() || undefined}
      </ElCol>
    )
  }
}
