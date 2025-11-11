import type { AutoRules } from './types'
import type { FormItemRule } from 'element-plus'

function createValidator(check: (v: any) => boolean, defaultMessage?: string) {
  return (rule: any, value: any, cb: (err?: any) => void) => {
    // 允许空值通过，由 other 规则（如 required）处理
    if (value === undefined || value === null || value === '') {
      return cb()
    }
    const ok = check(value)
    if (ok) {
      cb()
    } else {
      // rule.message 可能已经本地化，这里优先使用 rule.message，其次使用默认 messages
      cb(new Error(rule?.message ?? defaultMessage ?? 'Invalid value'))
    }
  }
}
export const needClearable = [
  'Autocomplete',
  'Cascader',
  'DatePicker',
  'Editor',
  'Input',
  'InputNumber',
  'Mention',
  'Select',
  'TimePicker',
  'TimeSelect'
]
export const needOptions = ['Select', 'Radio', 'Checkbox', 'Cascader', 'Transfer', 'Segmented']
export const noNeedOptions = ['RadioButton', 'CheckboxButton']
export const dateRangeTypes = [
  'years',
  'months',
  'dates',
  'datetimerange',
  'daterange',
  'monthrange',
  'yearrange'
]
export const AUTO_RULES_MAP: Record<AutoRules, FormItemRule> = {
  isRequired: {
    required: true,
    message: '{label}不能为空',
    trigger: 'change'
  },
  isRequiredArray: {
    required: true,
    message: '{label}不能为空',
    trigger: 'change',
    validator: createValidator(v => Array.isArray(v) && v.length > 0, '不能为空')
  },
  noSpace: {
    message: '{label}不得包含空格',
    trigger: 'change',
    validator: createValidator(v => (typeof v === 'string' ? !/\s/.test(v) : true), '不得包含空格')
  },
  isIdCard: {
    message: '{label}必须是有效的身份证号码',
    trigger: 'change',
    validator: createValidator(
      v => /^(?:\d{15}|\d{18}|\d{17}[\dX])/.test(v),
      '必须是有效的身份证号码'
    )
  },
  isMobilePhone: {
    message: '{label}必须是有效的11位手机号码',
    trigger: 'change',
    validator: createValidator(v => /^1[3456789]\d{9}/.test(v), '必须是有效的11位手机号码')
  },
  isTelephone: {
    message: '{label}必须是有效的电话号码',
    trigger: 'change',
    validator: createValidator(v => /^[0-9+-]+/.test(v) && /[0-9]/.test(v), '必须是有效的电话号码')
  },
  isCreditCode: {
    message: '{label}必须是有效的统一社会信用代码',
    trigger: 'change',
    validator: createValidator(
      v => /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/.test(v),
      '必须是有效的统一社会信用代码'
    )
  },
  isEmail: {
    message: '{label}必须是有效的邮箱号',
    trigger: 'change',
    validator: createValidator(
      v => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/.test(v),
      '必须是有效的邮箱号'
    )
  },
  onlyNumber: {
    message: '{label}只能输入数字',
    trigger: 'change',
    // 使用明确的数字正则，确保仅数字
    validator: createValidator(v => /^[0-9]+/.test(v), '只能输入数字')
  },
  onlyLetter: {
    message: '{label}只能输入字母',
    trigger: 'change',
    validator: createValidator(v => /^[a-zA-Z]+$/.test(v), '只能输入字母')
  },
  normalText: {
    message: '{label}不能包含特殊符号',
    trigger: 'change',
    // 允许的字符集：字母、数字、中文、下划线、横线、#、( ) 等等
    validator: createValidator(
      v => !/[^a-zA-Z0-9\u4e00-\u9fa5_\-#()（）·.]/.test(v),
      '不能包含特殊符号'
    )
  },
  noChinese: {
    message: '{label}不能包含汉字',
    trigger: 'change',
    validator: createValidator(v => !/[\u4e00-\u9fa5]/.test(v), '不能包含汉字')
  }
}
