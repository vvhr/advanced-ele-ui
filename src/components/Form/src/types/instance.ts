import type Form from '../Form.vue'

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
   * 验证表单
   * @returns Promise，验证成功返回表单数据，失败返回错误信息
   */
  validate: () => Promise<any>

  /**
   * 重置表单验证状态
   */
  resetValidate: () => void
}

/**
 * Form 组件实例类型
 * 包含组件实例本身的属性和 expose 暴露的方法
 */
export type FormInstance = InstanceType<typeof Form> & FormExpose
