import type { Component, ComputedRef, Ref, VNode } from 'vue'
import {
  ElForm,
  ElRow,
  ElFormItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElCol,
  ElTooltip
} from 'element-plus'
import type {
  ComponentName,
  ComponentProps,
  FormEmits,
  FormProps,
  FormSchema,
  FormSlots,
  DescriptionsSchema
} from '../types'
import type { FormImportItemConfig } from '@/types/imports'
import { getSubLabel, isHidden } from '../utils/schema'
import { useFormItem } from '../hook/useFormItem'
import { SchemaLayout } from './SchemaLayout'
import { getSlot, getStyleWidth } from '@/utils/get'
import { isExistAttr, isFunction } from '@/utils/is'
import { useComponent } from '../hook/useComponent'
import { logger } from '@/locale'
export function useRenderForm(
  props: FormProps,
  emits: FormEmits,
  attrs: any,
  slots: FormSlots,
  formModel: Ref<Recordable>,
  elFormRef: Ref<ComponentRef<typeof ElForm>>,
  componentRefs: Ref<Recordable<ComponentRef<any>>>,
  baseElRowRef: Ref<ComponentRef<typeof ElRow>>,
  schemasKeys: Ref<string[]>,
  components: Recordable<Component, ComponentName>,
  componentConfigs: Recordable<FormImportItemConfig, ComponentName>
) {
  // 渲染容器类组件
  function renderContainer(
    schema: FormSchema,
    componentProps: ComponentProps,
    defaultRender?: () => VNode | undefined
  ): VNode | undefined {
    // 检查组件是否在组件映射中
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error(
        'console.form.componentNotExist',
        { type: 'Container', component: schema.component },
        schema
      )
      return undefined
    }
    const { getAnyComponent, freshKey, setComponentProps, setInsideSlots } = useComponent(
      props,
      slots,
      emits,
      schema,
      formModel,
      componentProps,
      components,
      componentConfigs
    )

    // 渲染组件
    const renderAnyComponent = () => {
      const AnyComponent = getAnyComponent()
      if (AnyComponent !== undefined) {
        return (
          <AnyComponent {...setComponentProps()} key={freshKey}>
            {{
              ...setInsideSlots(),
              default: () => defaultRender?.()
            }}
          </AnyComponent>
        )
      } else {
        logger.error(
          'console.form.componentError',
          { type: 'Container', component: schema.component },
          schema
        )
        return undefined
      }
    }

    return renderAnyComponent()
  }

  // 渲染装饰类组件
  function renderDecorator(schema: FormSchema, componentProps: ComponentProps): VNode | undefined {
    // 检查组件是否在组件映射中
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error(
        'console.form.componentNotExist',
        { type: 'Decorator', component: schema.component },
        schema
      )
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
    } = useComponent(
      props,
      slots,
      emits,
      schema,
      formModel,
      componentProps,
      components,
      componentConfigs
    )

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
        logger.error(
          'console.form.componentError',
          { type: 'Decorator', component: schema.component },
          schema
        )
        return undefined
      }
    }

    const renderAnyComponentWithOutside = () => {
      const direction = schema?.outsideProps?.direction || 'row'
      const style: Recordable = {
        display: 'flex',
        flexDirection: direction,
        flexWrap: 'wrap',
        // 水平布局时默认居中对齐, 垂直布局时默认靠左
        alignItems: direction === 'row' ? 'center' : 'flex-start',
        width: '100%',
        ...(schema?.outsideProps?.style || {})
      }
      return (
        <div class="ae-form-item-outside" style={style}>
          {setOutsidePrepend()}
          {renderAnyComponent()}
          {setOutsideAppend()}
        </div>
      )
    }

    // 是否激活渲染外部容器
    return enableOutside ? renderAnyComponentWithOutside() : renderAnyComponent()
  }

  // 渲染输入类组件
  function renderInputer(
    schema: FormSchema,
    componentProps: ComponentProps,
    disabled: ComputedRef<boolean>
  ): VNode | undefined {
    // 检查组件是否在组件映射中
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error(
        'console.form.componentNotExist',
        { type: 'Inputer', component: schema.component },
        schema
      )
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
    } = useComponent(
      props,
      slots,
      emits,
      schema,
      formModel,
      componentProps,
      components,
      componentConfigs,
      disabled
    )
    const setComponentRef = (el: any) => {
      const refKey = schema.key || schema.field || ''
      // 只有部分特殊组件才存储ref, 比如存储Table组件的ref, 用于表单校验时自动调用Table的校验函数
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
            disabled={disabled.value}
            key={freshKey}
          >
            {{ ...setInsideSlots() }}
          </AnyComponent>
        )
      } else {
        logger.error(
          'console.form.componentError',
          { type: 'Inputer', component: schema.component },
          schema
        )
        return undefined
      }
    }

    const renderAnyComponentWithOutside = () => {
      const direction = schema?.outsideProps?.direction || 'row'
      const style: Recordable = {
        display: 'flex',
        flexDirection: direction,
        flexWrap: 'wrap',
        // 水平布局时默认居中对齐, 垂直布局时默认靠左
        alignItems: direction === 'row' ? 'center' : 'flex-start',
        width: '100%',
        ...(schema?.outsideProps?.style || {})
      }
      return (
        <div class="ae-form-item-outside" style={style}>
          {setOutsidePrepend()}
          {renderAnyComponent()}
          {setOutsideAppend()}
        </div>
      )
    }

    // 是否激活渲染外部容器
    return enableOutside ? renderAnyComponentWithOutside() : renderAnyComponent()
  }

  // 渲染自定义类组件
  function renderCustom(schema: FormSchema): VNode | undefined {
    if (schema?.type === 'Custom') {
      if (isFunction(schema.render)) {
        return schema.render(
          formModel.value,
          schema,
          props.disabled,
          props.excontext,
          props.domCreator
        )
      }
      const { slotKey } = useComponent(
        props,
        slots,
        emits,
        schema,
        formModel,
        {},
        components,
        componentConfigs
      )
      if (slots[slotKey]) {
        return getSlot(slots, slotKey, formModel.value) as any
      }
    }
    logger.error('console.form.customComponentError', undefined, schema)
    return undefined
  }
  // 渲染描述块标签
  function renderDescItemLabel(label: string, schema: FormSchema) {
    const subLabel = getSubLabel(schema, formModel.value, props)
    const popperStyle = {
      width: '150px'
    }
    if (!!subLabel) {
      return (
        <ElTooltip
          content={subLabel}
          popper-class="ae-form-label-popper"
          popper-style={popperStyle}
        >
          <span class="ae-description-item-label__text has-sub-label">{label}</span>
        </ElTooltip>
      )
    }
    return <span class="ae-description-item-label__text">{label}</span>
  }

  // 渲染表单项标签
  function renderFormItemLabel(label: string, schema: FormSchema) {
    const labelPosition =
      schema.formItemProps?.labelPosition ??
      props.schemaProps?.formItemProps?.labelPosition ??
      'right'
    if (labelPosition === 'top') {
      // 只要定义了subLabelRender，则优先使用
      if (isFunction(schema.formItemProps?.subLabelRender)) {
        const renderSubLabel = schema.formItemProps.subLabelRender(
          formModel.value,
          schema,
          props.disabled,
          props.excontext,
          props.domCreator
        )
        if (!!renderSubLabel) {
          return (
            <div class="ae-form-item-label">
              <div class="label">{label}</div>
              <div class="sub-label">{renderSubLabel}</div>
            </div>
          )
        } else {
          return (
            <div class="ae-form-item-label">
              <div class="label">{label}</div>
            </div>
          )
        }
      }
      // 如果未定义subLabelRender，则读取subLabel
      const subLabel = getSubLabel(schema, formModel.value, props)
      return (
        <div class="ae-form-item-label">
          <div class="label">{label}</div>
          {!!subLabel && <div class="sub-label">{subLabel}</div>}
        </div>
      )
    } else {
      const labelStyle = {
        width: getStyleWidth(schema.formItemProps?.labelMaxWidth) || 'fit-content',
        lineHeight: schema.formItemProps?.labelMaxWidth ? "var(--el-font-size-base, '14px')" : '',
        marginTop: schema.formItemProps?.labelMaxWidth ? '5px' : ''
      }
      return (
        <div class="ae-form-item-label inline-flex">
          <span class="label" style={labelStyle}>
            {label}
          </span>
        </div>
      )
    }
  }

  // 渲染表单项
  function renderSchema(schema: FormSchema) {
    // 判断当前是否隐藏
    const hidden = isHidden(schema, formModel.value, props)
    if (hidden) {
      return undefined
    }
    // 获取组件key
    const key = schema.key ?? schema.field
    if (!key) {
      logger.error('console.form.keyRequired', undefined, schema)
      return undefined
    }
    // 根据组件类型
    const type = schema.type ?? 'Inputer'
    switch (type) {
      case 'Step':
        logger.error('console.form.nestedStepNotSupported', undefined, schema)
        return undefined
      case 'Descriptions':
        logger.error('console.form.nestedDescriptionsNotSupported', undefined, schema)
        return undefined
      case 'Custom': {
        const { getFormItemProps, slotKey, formItemLabel } = useFormItem(
          props,
          slots,
          schema,
          formModel
        )
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
          >
            {{
              default: () => (
                <ElFormItem {...getFormItemProps()}>
                  {{
                    ...(slots[`${slotKey}--label`]
                      ? { label: slots[`${slotKey}--label`] }
                      : { label: () => renderFormItemLabel(formItemLabel.value, schema) }),
                    ...(slots[`${slotKey}--error`] ? { error: slots[`${slotKey}--error`] } : {}),
                    default: () => renderCustom(schema)
                  }}
                </ElFormItem>
              ),
              ...(props.designable && {
                design: (column: FormSchema) => slots[`${slotKey}--design`]?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case 'Container': {
        const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
        const containerRowDirectives =
          props.designable && props.type !== 'desc'
            ? props.designableDirectives?.containerRow || {}
            : {}
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
          >
            {{
              default: () =>
                renderContainer(schema, trueComponentProps, () => (
                  <ElRow
                    class="ae-form-main__container_row type-form"
                    data-id={`container-row-${key}`}
                    key={`container-row-${key}`}
                    gutter={10}
                    {...containerRowDirectives}
                  >
                    {schema.children ? schema.children?.map(item => renderSchema(item)) : undefined}
                  </ElRow>
                )),
              ...(props.designable && {
                design: (column: FormSchema) => slots[`${slotKey}--design`]?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case 'Decorator': {
        const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
          >
            {{
              default: () => renderDecorator(schema, trueComponentProps),
              ...(props.designable && {
                design: (column: FormSchema) => slots[`${slotKey}--design`]?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case 'Inputer':
      default:
        const { trueComponentProps, isDisabled, getFormItemProps, slotKey, formItemLabel } =
          useFormItem(props, slots, schema, formModel)
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
          >
            {{
              default: () => (
                <ElFormItem {...getFormItemProps()}>
                  {{
                    ...(slots[`${slotKey}--label`]
                      ? { label: slots[`${slotKey}--label`] }
                      : { label: () => renderFormItemLabel(formItemLabel.value, schema) }),
                    ...(slots[`${slotKey}--error`] ? { error: slots[`${slotKey}--error`] } : {}),
                    default: () => renderInputer(schema, trueComponentProps, isDisabled)
                  }}
                </ElFormItem>
              ),
              ...(props.designable && {
                design: (column: FormSchema) => slots[`${slotKey}--design`]?.(column)
              })
            }}
          </SchemaLayout>
        )
    }
  }

  // 渲染描述组件
  function renderDescription(schema: DescriptionsSchema) {
    // 判断当前是否隐藏
    const hidden = isHidden(schema, formModel.value, props)
    if (hidden) {
      return undefined
    }
    // 获取组件key
    const key = schema.key ?? schema.field
    if (!key) {
      logger.error('console.form.keyRequired', undefined, schema)
      return undefined
    }
    const { getDescriptionsProps, getDescriptionsSlots } = useFormItem(
      props,
      slots,
      schema,
      formModel
    )
    return (
      <ElCol span={schema.layoutProps?.span ?? 24}>
        <ElDescriptions
          {...getDescriptionsProps()}
          key={`container-row-${key}`}
          data-id={`container-row-${key}`}
        >
          {{
            ...getDescriptionsSlots(),
            default: () => {
              return schema.children
                ? schema.children.map(item => renderDescriptionItem(item))
                : undefined
            }
          }}
        </ElDescriptions>
      </ElCol>
    )
  }
  // 渲染描述项组件
  function renderDescriptionItem(schema: FormSchema) {
    // 判断当前是否隐藏
    const hidden = isHidden(schema, formModel.value, props)
    if (hidden) {
      return undefined
    }
    // 获取组件key
    const key = schema.key ?? schema.field
    if (!key) {
      logger.error('console.form.keyRequired', undefined, schema)
      return undefined
    }
    // 根据组件类型
    const type = schema.type ?? 'Inputer'
    switch (type) {
      case 'Step':
        logger.error('console.form.nestedStepNotSupported', undefined, schema)
        return undefined
      case 'Container':
        logger.error('console.form.nestedContainerNotSupported', undefined, schema)
        return undefined
      case 'Descriptions':
        logger.error('console.form.nestedDescriptionsNotSupported', undefined, schema)
        return undefined
      case 'Custom': {
        const { formItemLabel, getFormItemProps, getDescriptionItemProps } = useFormItem(
          props,
          slots,
          schema,
          formModel
        )
        return (
          <ElDescriptionsItem {...getDescriptionItemProps()} key={key}>
            {{
              label: () => renderDescItemLabel(formItemLabel.value, schema),
              default: () => (
                <ElFormItem {...getFormItemProps()}>
                  {{
                    default: () => renderCustom(schema)
                  }}
                </ElFormItem>
              )
            }}
          </ElDescriptionsItem>
        )
      }
      case 'Decorator': {
        const { formItemLabel, trueComponentProps, getDescriptionItemProps } = useFormItem(
          props,
          slots,
          schema,
          formModel
        )
        return (
          <ElDescriptionsItem {...getDescriptionItemProps()} key={key}>
            {{
              label: () => renderDescItemLabel(formItemLabel.value, schema),
              default: () => renderDecorator(schema, trueComponentProps)
            }}
          </ElDescriptionsItem>
        )
      }
      case 'Inputer':
      default: {
        const {
          trueComponentProps,
          isDisabled,
          getFormItemProps,
          slotKey,
          formItemLabel,
          getDescriptionItemProps
        } = useFormItem(props, slots, schema, formModel)
        return (
          <ElDescriptionsItem {...getDescriptionItemProps()} key={key}>
            {{
              label: () => renderDescItemLabel(formItemLabel.value, schema),
              default: () => (
                <ElFormItem {...getFormItemProps()}>
                  {renderInputer(schema, trueComponentProps, isDisabled)}
                </ElFormItem>
              )
            }}
          </ElDescriptionsItem>
        )
      }
    }
  }

  // 渲染ElForm
  function renderForm() {
    const filterStepSchemas = (schemas: FormSchema[]): FormSchema[] => {
      if (props.stepValue !== null) {
        // 找到对应步骤块
        const stepSchema = schemas.find(
          schema => schema?.type === 'Step' && schema.step === props.stepValue
        )
        return stepSchema ? stepSchema.children || [] : []
      } else {
        return schemas
      }
    }

    /**
     * 渲染表单所有组件
     * @description 当Form的type属性为form时，将以传统表单结构渲染
     */
    const renderSchemas = () => {
      // 过滤出符合当前步骤值的表单项
      const currentSchemas: FormSchema[] = filterStepSchemas(props.schemas)
      const setBaseElFormRef = (el: ComponentRef<typeof ElRow>) => {
        baseElRowRef.value = el
      }
      // 为根级绑定设计模式需要的拖拽指令
      const baseRowDirectives =
        props.designable && props.type !== 'desc' ? props.designableDirectives?.baseRow || {} : {}
      return (
        <ElRow
          ref={(el: any) => setBaseElFormRef(el)}
          data-id="base-row"
          key="base-row"
          class="ae-form-main__base_row type-form"
          gutter={10}
          {...baseRowDirectives}
        >
          {currentSchemas.map(item => renderSchema(item))}
        </ElRow>
      )
    }

    /**
     * 渲染描述列表
     * @description 当Form的type属性为descriptions时，将渲染描述列表
     * @remarks 当采用该模式时, 所有的容器都将自动替换为el-descriptions组件, 不在容器内的组件将被忽略
     */
    const renderDescriptions = () => {
      // 过滤出符合当前步骤值的表单项
      const currentSchemas: FormSchema[] = filterStepSchemas(props.schemas)
      // 检查是否存在未被容器包裹的表单项
      const descriptionsSchemas: DescriptionsSchema[] = currentSchemas
        .filter(item => {
          if (item.type == 'Container' || item.type === 'Descriptions') {
            return true
          } else {
            logger.error('console.form.wrapInDescriptions', undefined, item)
            return false
          }
        })
        .map(item => {
          return {
            ...item,
            type: 'Descriptions'
          } as DescriptionsSchema
        })
      const setBaseElFormRef = (el: ComponentRef<typeof ElRow>) => {
        baseElRowRef.value = el
      }
      return (
        <ElRow
          ref={(el: any) => setBaseElFormRef(el)}
          data-id="base-row"
          key="base-row"
          class="ae-form-main__base_row type-desc"
          gutter={10}
        >
          {descriptionsSchemas.map(item => renderDescription(item))}
        </ElRow>
      )
    }

    // 获取需要透传给el-form的属性
    const getElFormProps = () => {
      const elFormProps = { ...props, ...attrs }
      const removeProps = [
        'model',
        'schemas',
        'stepValue',
        'disabled',
        'type',
        'designable',
        'excontext',
        'schemaProps',
        'showErrorNotice',
        'scrollRef',
        'autoInitField',
        'imports'
      ]
      // 将removeProps从elFormProps中删除
      removeProps.forEach(prop => delete elFormProps[prop])
      return elFormProps
    }

    const setElFormRef = (el: ComponentRef<typeof ElForm>) => {
      elFormRef.value = el
    }

    return (
      <ElForm
        class="ae-form-main"
        ref={(el: any) => setElFormRef(el)}
        {...getElFormProps()}
        model={formModel.value}
      >
        {{
          default: () => (props.type === 'form' ? renderSchemas() : renderDescriptions())
        }}
      </ElForm>
    )
  }

  return {
    renderForm
  }
}
