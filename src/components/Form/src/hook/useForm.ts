import { ref, unref, type Component, toRaw } from 'vue'
import { ElForm, ElRow, ElNotification } from 'element-plus'
import { get, set, unset } from 'lodash-es'
import type { ComponentName, FormProps, FormSchema } from '../types'
import { findNode, findNodes } from '@/utils/tree'
import { getFirstAttr } from '@/utils/get'
import { getTrueComponentProps, getValue, isHidden } from '../utils/schema'
import { t } from '@/locale'

export function useForm(
  props: FormProps,
  schemas: FormSchema[],
  components: Recordable<Component, ComponentName>,
  arrayStrategies: Partial<Record<ComponentName, (cps: Recordable) => boolean>>
): {
  isValidating: any
  formModel: any
  elFormRef: any
  baseElRowRef: any
  schemasKeys: any
  componentRefs: any
  initValues: (initModel: Recordable) => void
  getDefaultModel: (defaultModel: Recordable) => Recordable
  getFormModel: () => Recordable
  getElFormRef: () => any
  setValues: (data: Recordable) => void
  clearValues: (defaultModel: Recordable) => void
  setValue: (key: string, value: any) => void
  delValue: (key: string) => void
  resetValidate: () => void
  validate: () => Promise<any>
  scrollToKey: (key: string) => void
} {
  const isValidating = ref(false)
  const formModel = ref<Recordable>({})
  const elFormRef = ref<ComponentRef<typeof ElForm>>()
  const baseElRowRef = ref<ComponentRef<typeof ElRow>>()
  const schemasKeys = ref<string[]>([])
  const componentRefs = ref<Recordable<ComponentRef<any>>>({})
  function initValues(initModel: Recordable) {
    formModel.value = {
      ...getDefaultModel(initModel),
      ...initModel
    }
    setTimeout(() => {
      resetValidate()
    }, 200)
  }

  function getDefaultModel(defaultModel: Recordable) {
    const model: Recordable = { ...defaultModel }
    const initField = (schema: FormSchema) => {
      // 1. 检查 schema 是否需要初始化字段
      const type = schema.type ?? 'Inputer'
      if (!schema.field || !['Custom', 'Inputer'].includes(type)) {
        // 是否存在子组件
        if (
          ['Step', 'Container'].includes(type) &&
          schema.children &&
          Array.isArray(schema.children)
        ) {
          schema.children.forEach(child => {
            initField(child)
          })
        }
        return
      }

      // 2. 如果字段已在 model 中定义，则跳过
      if (get(model, schema.field) !== undefined) {
        return
      }

      // 3. 如果 schema 定义了初始值 (value)，直接使用
      if (schema.value !== undefined) {
        set(model, schema.field, getValue(schema, model, props))
        return
      }

      // 4. 根据组件类型决定默认值
      const componentName = schema.component as string
      if (componentName && arrayStrategies[componentName]) {
        const componentProps = getTrueComponentProps(schema, model, props)
        const shouldBeArray = arrayStrategies[componentName](componentProps)
        set(model, schema.field, shouldBeArray ? [] : null)
        return
      }

      // 5. 默认初始化为 null
      set(model, schema.field, null)
    }
    schemas.forEach(v => initField(v))

    return model
  }

  function getFormModel() {
    return formModel.value
  }
  function getElFormRef() {
    return unref(elFormRef) as ComponentRef<typeof ElForm>
  }

  // 对表单赋值
  function setValues(data: Recordable = {}) {
    formModel.value = Object.assign(unref(formModel), data)
  }
  // 清空表单
  function clearValues(defaultModel: Recordable) {
    formModel.value = {
      ...getDefaultModel(defaultModel)
    }
    setTimeout(() => {
      resetValidate()
    }, 200)
  }
  // 对表单某路径赋值 支持多层嵌套字段赋值
  function setValue(path: string, value: any) {
    // 使用响应式安全的方式设置值
    if (path.includes('.')) {
      set(formModel.value, path, value)
    } else {
      formModel.value[path] = value
    }
  }
  // 删除表单某路径字段 支持多层嵌套字段
  function delValue(path: string) {
    if (get(formModel.value, path) !== undefined) {
      unset(formModel.value, path)
      return true
    }
    return false
  }

  function resetValidate() {
    unref(elFormRef)?.clearValidate()
    // 找到所有可见的表格组件
    const tableSchemas = findNodes(schemas, (node: FormSchema) => {
      return node.component === 'Table' && !isHidden(node, formModel.value, props)
    })
    if (tableSchemas?.length) {
      tableSchemas.forEach((v: FormSchema) => {
        const tableRef = getComponentRef(v.key || v.field)
        if (tableRef) {
          tableRef?.resetValidate()
        }
      })
    }
  }
  // 获取特殊子组件实例
  const getComponentRef = (key: string) => {
    return key ? componentRefs.value[`${key}Ref`] : undefined
  }
  /**
   * 校验所有表单当前已渲染的字段
   * 说明: el-form原生校验函数封装
   */
  async function validate() {
    const validateTables = async () => {
      // 找到所有可见的表格组件
      const rawSchemas = toRaw(schemas)
      const tableSchemas = findNodes(rawSchemas, (node: FormSchema) => {
        return node.component === 'Table' && !isHidden(node, formModel.value, props)
      })
      if (tableSchemas?.length) {
        for (const item of tableSchemas) {
          const tableRef = getComponentRef(item.key || item.field)
          if (tableRef) {
            const valid = await tableRef?.validate()
            if (valid === false) {
              const fieldLabel = item?.label || item?.field
              if (fieldLabel && props.showErrorNotice) {
                ElNotification({
                  title: t('form.validation.tableError', { field: fieldLabel }),
                  message: t('form.validation.checkTable'),
                  type: 'warning'
                })
              }
              return false
            }
          }
        }
      }
      return true
    }

    isValidating.value = true
    try {
      const result = await unref(elFormRef)?.validate((valid, fields) => {
        if (!valid) {
          const firstRule = getFirstAttr(fields)
          const findSchema = findNode(
            props.schemas,
            (schema: FormSchema) => schema.field === firstRule[0].field
          )
          // Scroll to the first error field
          if (props.scrollRef && findSchema) {
            const container = props.scrollRef
            const fieldId = findSchema.key || findSchema.field
            try {
              const element = container.querySelector(`[data-id="${CSS.escape(fieldId)}"]`)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            } catch (e) {
              console.error('[AeForm] scrollRef is invalid', e)
            }
          }
          // If props.showErrorNotice is set to true, it automatically alerts which field validation has failed.
          if (props.showErrorNotice && findSchema) {
            const fieldLabel = findSchema?.label || findSchema?.field
            if (fieldLabel) {
              ElNotification({
                title: t('form.validation.fieldError', { field: fieldLabel }),
                message: firstRule[0].message,
                type: 'warning'
              })
            }
          }
        }
      })
      const tableResult = await validateTables()
      return result && tableResult
    } finally {
      isValidating.value = false
    }
  }

  function scrollToKey(key: string) {
    if (props.scrollRef && key) {
      const container = props.scrollRef
      const element = container.querySelector(`[data-id="${CSS.escape(key)}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return {
    isValidating,
    formModel,
    elFormRef,
    baseElRowRef,
    schemasKeys,
    componentRefs,
    initValues,
    getDefaultModel,
    getFormModel,
    getElFormRef,
    setValues,
    clearValues,
    setValue,
    delValue,
    resetValidate,
    validate,
    scrollToKey
  }
}
