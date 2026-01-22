import { ref, unref, computed, type Component, toRaw } from 'vue'
import { ElForm, ElRow, ElNotification } from 'element-plus'
import { get, set, unset } from 'lodash-es'
import type { ComponentName, FormProps, FormSchema, FormEmits } from '../types'
import { SchemaType } from '../constants'
import { findNode, findNodes } from '@/utils/tree'
import { getFirstAttr } from '@/utils/get'
import { getTrueComponentProps, getValue, isHidden } from '../utils/schema'
import { t } from '@/locale'

/**
 * 验证结果状态接口
 */
export interface ValidationResultState {
  /** 是否已完成验证（自上次数据变化后） */
  isValidated: boolean
  /** 最后一次验证的结果，null 表示还未验证 */
  result: boolean | null
  /** 验证完成的时间戳 */
  timestamp: number | null
}

export function useForm(
  props: FormProps,
  emit: FormEmits,
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
  validateSilent: () => Promise<boolean>
  scrollToKey: (key: string) => void
  getValidationResult: () => ValidationResultState
  resetValidationResult: () => void
} {
  const isValidating = ref(false)

  // 验证结果状态缓存
  const validationResultState = ref<ValidationResultState>({
    isValidated: false,
    result: null,
    timestamp: null
  })

  // 可控模式直接返回props.model, 非可控模式使用内部对象
  const formModel = props.controlled
    ? computed({
        get: () => props.model,
        set: val => {
          emit('update:model', val)
        }
      })
    : ref<Recordable>({})

  const elFormRef = ref<ComponentRef<typeof ElForm>>()
  const baseElRowRef = ref<ComponentRef<typeof ElRow>>()
  const schemasKeys = ref<string[]>([])
  const componentRefs = ref<Recordable<ComponentRef<any>>>({})
  function initValues(initModel?: Recordable) {
    formModel.value = {
      ...getDefaultModel(initModel || {}),
      ...initModel
    }
    setTimeout(() => resetValidate(), 200)
  }

  function getDefaultModel(defaultModel?: Recordable) {
    const model: Recordable = { ...(defaultModel || {}) }
    const initField = (schema: FormSchema) => {
      // 1. 检查 schema 是否需要初始化字段
      const type: any = schema.type ?? SchemaType.INPUTER
      if (!schema.field || ![SchemaType.CUSTOM, SchemaType.INPUTER].includes(type)) {
        // 是否存在子组件
        if (
          [SchemaType.STEP, SchemaType.CONTAINER, SchemaType.DESCRIPTIONS].includes(type) &&
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
    unref(props).schemas.forEach(v => initField(v))
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
    formModel.value = { ...unref(formModel), ...data }
  }
  // 清空表单
  function clearValues(defaultModel?: Recordable) {
    formModel.value = { ...(defaultModel || getDefaultModel()) }
    setTimeout(() => resetValidate(), 200)
  }
  // 对表单某路径赋值 支持多层嵌套字段赋值
  function setValue(path: string, value: any) {
    if (props.controlled) {
      // 可控模式:创建新对象触发响应式更新
      const newModel = { ...props.model }
      if (path.includes('.')) {
        set(newModel, path, value)
      } else {
        newModel[path] = value
      }
      formModel.value = newModel
    } else {
      // 非可控模式:直接修改
      if (path.includes('.')) {
        set(formModel.value, path, value)
      } else {
        formModel.value[path] = value
      }
    }
  }
  // 删除表单某路径字段 支持多层嵌套字段
  function delValue(path: string) {
    if (get(unref(formModel), path) !== undefined) {
      if (props.controlled) {
        const newModel = { ...props.model }
        unset(newModel, path)
        formModel.value = newModel
      } else {
        unset(formModel.value, path)
      }
      return true
    }
    return false
  }

  function resetValidate() {
    unref(elFormRef)?.clearValidate()
    // 找到所有可见的表格组件
    const tableSchemas = getVisibleTableSchemas()
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

  // 辅助函数：获取所有可见的Table组件Schema
  const getVisibleTableSchemas = () => {
    const rawSchemas = toRaw(unref(props).schemas)
    return findNodes(rawSchemas, (node: FormSchema) => {
      return node.component === 'Table' && !isHidden(node, formModel.value, props)
    })
  }

  // 辅助函数：校验表格
  const validateTables = async () => {
    // 找到所有可见的表格组件
    const tableSchemas = getVisibleTableSchemas()
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

  // 辅助函数：处理校验错误
  const handleValidationError = (valid: boolean, fields: any) => {
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
  }

  /**
   * 校验所有表单当前已渲染的字段
   * 说明: el-form原生校验函数封装
   *
   * 验证完成后会：
   * 1. 更新 validationResultState，可通过 getValidationResult() 同步获取
   * 2. 触发 'validate-complete' 事件，携带验证结果
   */
  async function validate() {
    isValidating.value = true
    try {
      const result = await unref(elFormRef)?.validate(handleValidationError)
      const tableResult = await validateTables()
      const finalResult = result && tableResult

      // 更新验证结果状态缓存
      validationResultState.value = {
        isValidated: true,
        result: finalResult,
        timestamp: Date.now()
      }

      // 触发验证完成事件
      emit('validate-complete', finalResult)

      return finalResult
    } catch (error) {
      console.error('[AeForm] validate error', error)

      // 验证失败也要更新状态
      validationResultState.value = {
        isValidated: true,
        result: false,
        timestamp: Date.now()
      }

      // 触发验证完成事件
      emit('validate-complete', false)

      return false
    } finally {
      isValidating.value = false
    }
  }

  /**
   * 静默校验所有表单当前已渲染的字段
   * 说明: 不显示错误通知，仅更新验证结果状态缓存
   *
   * 适用于自动验证场景，避免在用户输入过程中频繁弹出错误提示
   */
  async function validateSilent(): Promise<boolean> {
    // 如果正在验证中，直接返回当前缓存的结果
    if (isValidating.value) {
      return validationResultState.value.result ?? false
    }

    isValidating.value = true
    try {
      // 静默验证 el-form，不触发错误处理回调
      let formResult = true
      try {
        formResult = await unref(elFormRef)?.validate()
      } catch {
        // el-form validate 在验证失败时会 reject，这里捕获并设置为 false
        formResult = false
      }

      // 静默验证表格组件
      let tableResult = true
      const tableSchemas = getVisibleTableSchemas()
      if (tableSchemas?.length) {
        for (const item of tableSchemas) {
          const tableRef = getComponentRef(item.key || item.field)
          if (tableRef) {
            try {
              const valid = await tableRef?.validate?.()
              if (valid === false) {
                tableResult = false
                break
              }
            } catch {
              tableResult = false
              break
            }
          }
        }
      }

      const finalResult = formResult && tableResult

      // 更新验证结果状态缓存
      validationResultState.value = {
        isValidated: true,
        result: finalResult,
        timestamp: Date.now()
      }

      // 触发验证完成事件
      emit('validate-complete', finalResult)

      return finalResult
    } catch (error) {
      console.error('[AeForm] validateSilent error', error)

      // 验证失败也要更新状态
      validationResultState.value = {
        isValidated: true,
        result: false,
        timestamp: Date.now()
      }

      // 触发验证完成事件
      emit('validate-complete', false)

      return false
    } finally {
      isValidating.value = false
    }
  }

  /**
   * 同步获取验证结果状态
   * @returns ValidationResultState 验证结果状态对象
   *
   * 使用场景：
   * - 外部项目无法使用 await 时，可以先调用 validate() 触发验证
   * - 然后监听 'validate-complete' 事件，或在 nextTick 后调用此方法获取结果
   *
   * 返回值说明：
   * - isValidated: true 表示已完成验证，false 表示还未验证或数据已变化
   * - result: 验证结果，true 通过，false 未通过，null 表示还未验证
   * - timestamp: 验证完成的时间戳
   */
  function getValidationResult(): ValidationResultState {
    return { ...validationResultState.value }
  }

  /**
   * 重置验证结果状态
   * 当表单数据发生变化时，可以调用此方法重置验证状态
   */
  function resetValidationResult() {
    validationResultState.value = {
      isValidated: false,
      result: null,
      timestamp: null
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
    validateSilent,
    scrollToKey,
    getValidationResult,
    resetValidationResult
  }
}
