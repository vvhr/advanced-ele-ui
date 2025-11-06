import { componentMap } from '../component'
import type { FormProps, FormSchema, FormSlots, FormEmits, ComponentProps } from '../types'
import { useComponent } from '../hook/useComponent'
import { getSlot } from '../utils/helpers'
import type { Ref, VNode } from 'vue'

export function renderContainer(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  componentProps: ComponentProps,
  formModel: Ref<Recordable>,
  defaultRender?: () => VNode | undefined
): VNode | undefined {
  // 检查组件是否在组件映射中
  if (!schema.component || !componentMap.hasOwnProperty(schema.component)) {
    console.error(`[ZwForm]: 组件 ${schema.component} 不存在`)
    return undefined
  }
  const { getAnyComponent, freshKey, setComponentProps, setInsideSlots } = useComponent(
    props,
    slots,
    emits,
    schema,
    formModel,
    componentProps
  )

  // 渲染组件
  const renderAnyComponent = () => {
    const AnyComponent = getAnyComponent()
    if (AnyComponent !== undefined) {
      return (
        <AnyComponent {...setComponentProps()} key={freshKey}>
          {{
            ...setInsideSlots(),
            default: () => defaultRender()
          }}
        </AnyComponent>
      )
    } else {
      console.error(`[ZwForm]: 配置异常，请检查组件 ${schema.component} 是否正确！`)
      return undefined
    }
  }

  return renderAnyComponent()
}
export function renderDecorator(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  componentProps: ComponentProps,
  formModel: Ref<Recordable>
): VNode | undefined {
  // 检查组件是否在组件映射中
  if (!schema.component || !componentMap.hasOwnProperty(schema.component)) {
    console.error(`[ZwForm]: 组件 ${schema.component} 不存在`)
    return undefined
  }
  const {
    enableOutside,
    setOutsideAppend,
    setOutsidePrepend,
    getAnyComponent,
    freshKey,
    setComponentProps,
    setComponentEvent,
    setInsideSlots
  } = useComponent(props, slots, emits, schema, formModel, componentProps)

  // 渲染组件
  const renderAnyComponent = () => {
    const AnyComponent = getAnyComponent()
    if (AnyComponent !== undefined) {
      return (
        <AnyComponent {...setComponentProps()} {...setComponentEvent()} key={freshKey}>
          {{ ...setInsideSlots() }}
        </AnyComponent>
      )
    } else {
      console.error(`[ZwForm]: 配置异常，请检查组件 ${schema.component} 是否正确！`)
      return undefined
    }
  }

  const renderAnyComponentWithOutside = () => {
    const direction = schema?.outsideProps?.direction || 'row'
    const style: Recordable = {
      display: 'flex',
      flexDirection: direction,
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%',
      ...(schema?.outsideProps?.style || {})
    }
    return (
      <div class="zw-form-item-outside" style={style}>
        {setOutsidePrepend()}
        {renderAnyComponent()}
        {setOutsideAppend()}
      </div>
    )
  }

  // 是否激活渲染外部容器
  return enableOutside ? renderAnyComponentWithOutside() : renderAnyComponent()
}

/**
 * 输入类组件渲染
 * @param props
 * @param slots
 * @param emits
 * @param schema
 * @param componentRefs
 * @param componentProps
 * @param formModel
 * @param disabled 组件是否禁用
 */
export function renderInputer(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  componentRefs: Ref<Recordable<ComponentRef<any>>>,
  componentProps: ComponentProps,
  formModel: Ref<Recordable>,
  disabled: boolean
): VNode | undefined {
  // 检查组件是否在组件映射中
  if (!schema.component || !componentMap.hasOwnProperty(schema.component)) {
    console.error(`[ZwForm]: 组件 ${schema.component} 不存在`)
    return undefined
  }
  const {
    enableOutside,
    setOutsideAppend,
    setOutsidePrepend,
    getAnyComponent,
    freshKey,
    setModelValue,
    setComponentEvent,
    setComponentProps,
    setInsideSlots
  } = useComponent(props, slots, emits, schema, formModel, componentProps)
  const setComponentRef = (el: any) => {
    const refKey = schema.key || schema.field || ''
    // 只有部分特殊组件才存储ref
    const enableComponents = ['Table']
    if (el && refKey && enableComponents.includes(schema.component)) {
      componentRefs.value[`${refKey}Ref`] = el
    }
  }
  // 渲染组件
  const renderAnyComponent = () => {
    const AnyComponent = getAnyComponent()
    if (AnyComponent !== undefined) {
      return (
        <AnyComponent
          ref={(el: any) => setComponentRef(el)}
          {...setModelValue()}
          {...setComponentProps()}
          {...setComponentEvent()}
          disabled={disabled}
          key={freshKey}
        >
          {{ ...setInsideSlots() }}
        </AnyComponent>
      )
    } else {
      console.error(`[ZwForm]: 配置异常，请检查组件 ${schema.component} 是否正确！`)
      return undefined
    }
  }

  const renderAnyComponentWithOutside = () => {
    const direction = schema?.outsideProps?.direction || 'row'
    const style: Recordable = {
      display: 'flex',
      flexDirection: direction,
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%',
      ...(schema?.outsideProps?.style || {})
    }
    return (
      <div class="zw-form-item-outside" style={style}>
        {setOutsidePrepend()}
        {renderAnyComponent()}
        {setOutsideAppend()}
      </div>
    )
  }

  // 是否激活渲染外部容器
  return enableOutside ? renderAnyComponentWithOutside() : renderAnyComponent()
}

/**
 * 自定义渲染
 * @param schema
 * @param formModel
 * @param props
 * @param emits
 * @param slots
 */
export function renderCustom(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  formModel: Ref<Recordable>
): VNode | undefined {
  if (schema?.type === 'Custom') {
    if (schema.render !== undefined) {
      return schema.render(formModel.value, schema, props.disabled, props.dataSource)
    }
    const { slotKey } = useComponent(props, slots, emits, schema, formModel, {})
    if (slots[slotKey]) {
      return getSlot(slots, slotKey, formModel.value) as any
    }
    console.error(`
      [ZwForm]: 配置异常，若您期望使用自定义渲染组件，请使用 render属性 或 slot插槽 编写组件内容！
      例如: render: (form, column, disabled, dataSource) => ...
      或在ZwForm组件内使用 <template #${slotKey}>...</template>
    `)
  }
  console.error(
    `[ZwForm]: 配置异常，若您期望使用自定义渲染组件，请使用 render属性 或 slot插槽 编写组件内容！`
  )
  return undefined
}
