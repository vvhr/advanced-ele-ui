/**
 * 内置表单验证规则
 * @description 适用于表单验证规则
 * @remarks
 * - `isRequired`: 不为空
 * - `isRequiredArray`: 不为空数组
 * - `noSpace`: 无空格
 * - `normalText`: 常规文本 无特殊符号
 * - `isIdCard`: 身份证
 * - `isMobilePhone`: 手机号码
 * - `isTelephone`: 通用号码
 * - `noChinese`: 无汉字
 * - `isCreditCode`: 统一社会信用代码
 * - `onlyNumber`: 纯数字
 * - `onlyLetter`: 纯字母
 * - `isEmail`: 邮箱号
 */
export type AutoRules =
  | 'isRequired' // 不为空
  | 'isRequiredArray' // 不为空数组
  | 'noSpace' // 不得包含空格
  | 'normalText' // 常规文本 无特殊符号
  | 'isIdCard' // 身份证号码
  | 'isMobilePhone' // 11位手机号码
  | 'isTelephone' // 通用号码
  | 'noChinese' // 无汉字
  | 'isCreditCode' // 统一社会信用代码
  | 'onlyNumber' // 只能输入数字
  | 'onlyLetter' // 只能输入字母
  | 'isEmail' // 邮箱号
