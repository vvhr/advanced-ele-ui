import { ElForm, ElRow } from 'element-plus'
import type { FormEmits, FormProps, FormSchema, FormSlots } from '../types'
import { renderSchema } from './RenderSchema'
export function renderForm(
  props: FormProps,
  emits: FormEmits,
  attrs: any,
  slots: FormSlots,
  formModel: Ref<Recordable>,
  elFormRef: Ref<ComponentRef<typeof ElForm>>,
  componentRefs: Ref<Recordable<ComponentRef<any>>>,
  baseElRowRef: Ref<ComponentRef<typeof ElRow>>,
  schemasKeys: Ref<string[]>
) {
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
   */
  const renderSchemas = () => {
    // 过滤出符合当前步骤值的表单项
    const currentSchemas: FormSchema[] = filterStepSchemas(props.schemas)
    return (
      <ElRow
        ref={baseElRowRef}
        data-id="base-row"
        key="base-row"
        class="zw-form-main__base_row"
        gutter={10}
      >
        {currentSchemas.map(item =>
          renderSchema(props, slots, emits, item, componentRefs, formModel, schemasKeys)
        )}
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
      'dataSource',
      'schemaProps',
      'showErrorNotice',
      'scrollRef',
      'autoInitField'
    ]
    // 将removeProps从elFormProps中删除
    removeProps.forEach(prop => delete elFormProps[prop])
    return elFormProps
  }

  return (
    <ElForm class="zw-form-main" ref={elFormRef} {...getElFormProps()} model={formModel.value}>
      {{
        default: () => renderSchemas()
      }}
    </ElForm>
  )
}
