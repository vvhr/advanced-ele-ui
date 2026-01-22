import type Form from '../Form.vue'

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

/**
 * Form 组件通过 expose 暴露的方法
 */
export interface FormExpose {
  /**
   * 初始化表单值
   * @param initModel 初始化的数据模型
   */
  initValues: (initModel: Recordable) => void

  /**
   * 获取默认模型（包含所有字段的默认值）
   * @param defaultModel 默认数据模型
   * @returns 完整的默认模型
   */
  getDefaultModel: (defaultModel: Recordable) => Recordable

  /**
   * 获取当前表单模型数据
   * @returns 当前表单的所有数据
   */
  getFormModel: () => Recordable

  /**
   * 获取 Element Plus Form 实例
   * @returns ElForm 实例
   */
  getElFormRef: () => any

  /**
   * 批量设置表单值
   * @param data 要设置的数据对象
   */
  setValues: (data: Recordable) => void

  /**
   * 清空表单值，恢复为默认值
   * @param defaultModel 默认数据模型
   */
  clearValues: (defaultModel: Recordable) => void

  /**
   * 设置单个字段的值
   * @param key 字段名（支持嵌套路径，如 'user.name'）
   * @param value 字段值
   */
  setValue: (key: string, value: any) => void

  /**
   * 删除单个字段
   * @param key 字段名（支持嵌套路径）
   */
  delValue: (key: string) => void

  /**
   * 验证表单（异步方法）
   * @returns Promise，验证成功返回 true，失败返回 false
   *
   * 注意：此方法是异步的，需要使用 await 获取结果。
   * 如果无法使用 await，可以：
   * 1. 监听 'validate-complete' 事件获取验证结果
   * 2. 调用 validate() 后在 nextTick 中调用 getValidationResult() 获取结果
   */
  validate: () => Promise<any>

  /**
   * 静默验证表单（异步方法）
   * @returns Promise，验证成功返回 true，失败返回 false
   *
   * 与 validate() 的区别：
   * - 不会显示错误通知
   * - 不会滚动到错误字段
   * - 适用于自动验证场景
   */
  validateSilent: () => Promise<boolean>

  /**
   * 重置表单验证状态
   */
  resetValidate: () => void

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
  getValidationResult: () => ValidationResultState

  /**
   * 重置验证结果状态
   * 当需要强制用户重新验证时可调用此方法
   */
  resetValidationResult: () => void
}

/**
 * Form 组件实例类型
 * 包含组件实例本身的属性和 expose 暴露的方法
 */
export type FormInstance = InstanceType<typeof Form> & FormExpose
